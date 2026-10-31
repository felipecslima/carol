// Partes da folha do mídia kit (DEV-154). Cada uma desenha uma região a partir do objeto `Kit` (dadosDoKit.ts);
// região sem conteúdo não chega aqui (a página não a monta) e o espaço fecha. Nada de botões: no papel, contato e
// vídeos são texto e imagem com link.
import qrcode from 'qrcode-generator';
import { posicaoDoFoco } from '@blocks/foco';
import type { ItemDeNumero } from '@blocks/tipos';
import { tamanhoDaManchete, type Kit } from './dadosDoKit';

/** "@eu.carollimah · São Paulo" → "@eu.carollimah" (o rodapé leva só o @) */
const soOArroba = (arroba?: string) => arroba?.split(/\s*[·|•,–-]\s*/)[0];

export function Rodape({
  kit,
  pagina,
  total,
  marcaDagua,
}: {
  kit: Kit;
  pagina: number;
  total: number;
  marcaDagua: boolean;
}) {
  return (
    <>
      <footer className="mk-rodape">
        <span>{soOArroba(kit.arroba)}</span>
        {!marcaDagua && <span>Feito com Portfólio Creator</span>}
        <span>
          {pagina}/{total}
        </span>
      </footer>
      {marcaDagua && (
        <div className="mk-marca" aria-hidden="true">
          PORTFÓLIO CREATOR • TESTE
        </div>
      )}
    </>
  );
}

/**
 * Abertura da página 1: foto em sangria à esquerda (colunas 1 a 6) e, na coluna do texto (7 a 12, o mesmo eixo do
 * Sobre lá embaixo), o resumo no alto e a manchete embaixo, encostada na faixa dos números.
 */
export function Abertura({ kit, linhaFina }: { kit: Kit; linhaFina: boolean }) {
  return (
    <header className={`mk-abertura${kit.foto ? '' : ' mk-abertura--sem-foto'}`}>
      {kit.foto && (
        <img
          className="mk-abertura-foto"
          src={kit.foto.src}
          alt=""
          style={{ objectPosition: posicaoDoFoco(kit.foto.foco) ?? '50% 30%' }}
        />
      )}
      <div className="mk-abertura-texto">
        {kit.resumo.length > 0 && <Resumo itens={kit.resumo} />}
        {kit.manchete && (
          <h1 className="mk-manchete" data-cabe-em-linhas="3" style={{ fontSize: tamanhoDaManchete(kit.manchete) }}>
            {kit.manchete}
          </h1>
        )}
        {kit.arroba && <p className="mk-arroba">{kit.arroba}</p>}
        {/* quando a frase em destaque não tem lugar no meio da página, o subtítulo fica aqui, como linha fina */}
        {linhaFina && kit.frase && <p className="mk-linha-fina">{kit.frase}</p>}
      </div>
    </header>
  );
}

export function FaixaDeNumeros({ numeros }: { numeros: Kit['numeros'] }) {
  return (
    <section className="mk-faixa" aria-label="Números">
      {/* 4 vagas de 3 colunas (eixos 1, 4, 7 e 10); com até 3 números, o período ocupa a última vaga */}
      <dl className="mk-numeros">
        {numeros.itens.map((n, i) => (
          <div key={i}>
            <dt>{n.rotulo}</dt>
            <dd>{n.valor}</dd>
          </div>
        ))}
        {numeros.selo && (
          <p className={`mk-legenda mk-numeros-selo${numeros.itens.length > 3 ? ' mk-numeros-selo--embaixo' : ''}`}>
            {numeros.selo}
          </p>
        )}
      </dl>
    </section>
  );
}

export function Resumo({ itens }: { itens: Kit['resumo'] }) {
  return (
    <p className="mk-resumo">
      {itens.map((i, n) => (
        <span key={n}>
          <b>{i.rotulo}:</b> {i.valor}
        </span>
      ))}
    </p>
  );
}

const temBarra = (i: ItemDeNumero) => typeof i.proporcao === 'number' && i.proporcao > 0;

function Frase({ texto }: { texto: string }) {
  return (
    <blockquote className="mk-frase">
      <p>“{texto}”</p>
    </blockquote>
  );
}

export function Barras({ publico, frase }: { publico: NonNullable<Kit['publico']>; frase?: string }) {
  return (
    <section className="mk-regiao mk-publico">
      <h2 className="mk-titulo">{publico.titulo}</h2>
      {/* idade, gênero e cidades não somam juntos: cada grupo vem com o nome, para não parecer uma distribuição só */}
      {publico.grupos.map((g) => (
        <div key={g.nome} className="mk-grupo">
          {publico.grupos.length > 1 && <p className="mk-grupo-nome">{g.nome}</p>}
          <dl className="mk-barras">
            {g.itens.map((i, n) => (
              <div key={n}>
                <dt>{i.rotulo}</dt>
                <dd>
                  {temBarra(i) && (
                    <span
                      className="mk-publico-barra"
                      style={{ width: `${Math.min(100, i.proporcao!)}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="mk-publico-valor">{i.valor}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {publico.selo && <p className="mk-legenda">{publico.selo}</p>}
      {frase && <Frase texto={frase} />}
    </section>
  );
}

export function Sobre({ sobre, frase }: { sobre: NonNullable<Kit['sobre']>; frase?: string }) {
  const paragrafos = sobre.texto.split(/\n{2,}/);
  return (
    <section className="mk-regiao mk-sobre">
      <h2 className="mk-titulo">{sobre.titulo}</h2>
      <div className="mk-sobre-texto">
        {paragrafos.map((p, i) => (
          <p key={i} className={i === 0 ? 'mk-capitular' : undefined}>
            {p}
          </p>
        ))}
      </div>
      {frase && <Frase texto={frase} />}
    </section>
  );
}

/** Os vídeos como fotos da matéria: capas 9:16 na mesma proporção, cada uma com link para a página no ar. */
export function FolhaDeContato({ videos, link }: { videos: NonNullable<Kit['videos']>; link?: string }) {
  // com poucos vídeos as capas crescem (até 4 por linha); com 4 a 6, uma linha cheia
  const colunas = Math.max(4, videos.itens.length);
  return (
    <section className="mk-regiao mk-videos">
      <h2 className="mk-titulo">{videos.titulo}</h2>
      <ul className="mk-capas" style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}>
        {videos.itens.map((v, i) => {
          const capa = v.capa ? (
            <img src={v.capa} alt="" style={{ objectPosition: posicaoDoFoco(v.capa_foco) }} />
          ) : (
            <span className="mk-capa-vazia" />
          );
          return (
            <li key={i}>
              {link ? (
                <a className="mk-capa" href={`${link}#videos`} aria-label={`${v.titulo}: ver o vídeo tocando`}>
                  {capa}
                </a>
              ) : (
                <span className="mk-capa">{capa}</span>
              )}
              <p className="mk-legenda">
                <b>{v.titulo}</b>
                {v.visualizacoes && <span>{v.visualizacoes} views</span>}
                {v.marca && <span>{v.marca}</span>}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Marcas como créditos de revista: logos na mesma altura ou nomes em serifa, em colunas. */
export function Creditos({ marcas }: { marcas: NonNullable<Kit['marcas']> }) {
  return (
    <section className="mk-regiao mk-marcas">
      <h2 className="mk-titulo">{marcas.titulo}</h2>
      {marcas.comLogo ? (
        <ul className="mk-logos">
          {marcas.itens.map((m, i) => (
            <li key={i}>
              <img src={m.logo} alt={m.nome} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mk-creditos">
          {marcas.itens.map((m, i) => (
            <li key={i}>{m.nome}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Tabela de verdade: nome, pontilhado até o valor, e o que inclui e o prazo como legenda. */
export function Formatos({ formatos }: { formatos: NonNullable<Kit['formatos']> }) {
  // sem nenhum preço, o pontilhado levaria a "Sob consulta" em todas as linhas: vira uma linha só, sob o título
  const comPreco = formatos.itens.some((f) => f.preco?.trim());
  return (
    <section className="mk-regiao mk-formatos">
      <div className="mk-titulo-linha">
        <h2 className="mk-titulo">{formatos.titulo}</h2>
        {!comPreco && <p>Valores sob consulta</p>}
      </div>
      <table className={`mk-tabela${comPreco ? '' : ' mk-tabela--sem-preco'}`}>
        <tbody>
          {formatos.itens.map((f, i) => {
            const legenda = [f.inclui ?? f.descricao, f.prazo && `Entrega em ${f.prazo}`].filter(Boolean).join(' · ');
            return (
              <tr key={i}>
                <th scope="row">
                  <span className="mk-pontilhado">
                    <span>{f.titulo}</span>
                  </span>
                  {legenda && <span className="mk-legenda">{legenda}</span>}
                </th>
                {comPreco && <td>{f.preco?.trim() || 'Sob consulta'}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/** QR em SVG (nítido no PDF, sem imagem extra), com os módulos na cor do texto sobre o papel. */
function Qr({ texto }: { texto: string }) {
  const qr = qrcode(0, 'M');
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount();
  let caminho = '';
  for (let l = 0; l < n; l++) for (let c = 0; c < n; c++) if (qr.isDark(l, c)) caminho += `M${c} ${l}h1v1h-1z`;
  return (
    <svg className="mk-qr" viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label={`QR code para ${texto}`}>
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="var(--fundo)" />
      <path d={caminho} fill="var(--texto)" shapeRendering="crispEdges" />
    </svg>
  );
}

export function Contato({ contato, link }: { contato: NonNullable<Kit['contato']>; link?: string }) {
  return (
    <section className={`mk-contato${link ? '' : ' mk-contato--sem-qr'}`}>
      <div className="mk-contato-texto">
        {contato.titulo && <h2 className="mk-titulo">{contato.titulo}</h2>}
        <p className="mk-contato-meios">
          {contato.email && <a href={`mailto:${contato.email}`}>{contato.email}</a>}
          {contato.whatsapp && contato.linkDoWhatsapp && (
            <a href={contato.linkDoWhatsapp}>WhatsApp {contato.whatsapp}</a>
          )}
        </p>
        {contato.prazo && <p className="mk-legenda">{contato.prazo}</p>}
      </div>
      {link && (
        <a className="mk-contato-qr" href={link}>
          <Qr texto={link} />
          <span className="mk-legenda">Veja os vídeos tocando</span>
        </a>
      )}
    </section>
  );
}

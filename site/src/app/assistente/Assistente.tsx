// Assistente de início: escolher as cores (prévia da página e as paletas prontas) e responder uma pergunta por tela.
// Não há modelo para escolher: a creator monta o portfólio com as seções no editor. No fim monta o projeto (lib/montagem.ts), grava o rascunho e abre o editor. Sem IA.
import { motion } from 'motion/react';
import { MovimentoDoApp, SUAVE } from '../movimento';
import { Marca } from '../Marca';
import { useEffect, useRef, useState } from 'react';
import { PROJETO_DE_EXEMPLO } from '@blocks/exemplos';
import { montarProjeto, normalizarArroba, sugestoesDeTitulo, type Respostas } from '@lib/montagem';
import { gerarPaleta } from '@themes/paleta';
import { NUVEM } from '@themes/modelos/nuvem';
import type { Numeros } from '@lib/numeros';
import { Miniatura } from '../area/Miniatura';
import { CampoDeArquivo } from '../editor/CampoDeArquivo';
import { PainelNumeros } from '../editor/PainelNumeros';
import { salvarPerfil } from '../nuvem';
import { salvarRascunho } from '../editor/persistencia';
import { useSessao } from '../sessao';
import '../editor/editor.css';
import './assistente.css';
import '../refino.css';
import '../tema.css';

const NICHOS = ['Gastronomia', 'Viagem', 'Beleza', 'Lifestyle', 'Moda', 'Casa', 'Maternidade', 'Fitness'];

type Etapa =
  'cores' | 'nome' | 'arroba' | 'cidade' | 'nicho' | 'publi' | 'grava' | 'titulo' | 'frase' | 'videos' | 'numeros';
const ETAPAS_BASE: Etapa[] = [
  'cores',
  'nome',
  'arroba',
  'cidade',
  'nicho',
  'publi',
  'grava',
  'titulo',
  'frase',
  'videos',
];

function PreviaDasCores({ paleta }: { paleta: number }) {
  return (
    <div className="as-previa">
      <Miniatura projeto={{ ...PROJETO_DE_EXEMPLO, paleta }} blocos={['capa', 'numeros']} />
    </div>
  );
}

export default function Assistente() {
  const sessao = useSessao();
  const [indice, setIndice] = useState(0);
  const [paleta, setPaleta] = useState(0);
  const [r, setR] = useState<Respostas>({
    nome: '',
    arroba: '',
    cidade: '',
    nicho: '',
    jaFezPubli: true,
    oQueGrava: '',
    frase: '',
  });
  const [publiRespondida, setPubliRespondida] = useState(false);
  const [videos, setVideos] = useState<Array<{ titulo: string; video: string; capa: string }>>([]);
  const [numeros, setNumeros] = useState<Numeros | undefined>(undefined);
  const campo = useRef<HTMLInputElement>(null);
  // quem ainda não fez publi não tem números para mostrar: a etapa de números não aparece
  // o envio de vídeos exige conta: sem login, essa etapa fica para o editor
  const base = sessao ? ETAPAS_BASE : ETAPAS_BASE.filter((e) => e !== 'videos');
  const ETAPAS: Etapa[] = r.jaFezPubli ? [...base, 'numeros'] : base;
  const etapa = ETAPAS[indice]!;

  useEffect(() => campo.current?.focus(), [indice]);

  const ultima = indice === ETAPAS.length - 1;
  const valido =
    etapa === 'cores' ||
    (etapa === 'nome' && r.nome.trim().length > 0) ||
    (etapa === 'nicho' && r.nicho.trim().length > 0) ||
    (etapa === 'publi' && publiRespondida) ||
    (etapa === 'grava' && r.oQueGrava.trim().length > 0) ||
    etapa === 'arroba' ||
    etapa === 'cidade' ||
    etapa === 'titulo' ||
    etapa === 'frase' ||
    etapa === 'videos' ||
    etapa === 'numeros';

  async function concluir(numerosFinais: Numeros | undefined) {
    const projeto = montarProjeto(
      { ...PROJETO_DE_EXEMPLO, paleta },
      { ...r, videos: videos.filter((v) => v.video), numeros: numerosFinais },
    );
    salvarRascunho(projeto);
    // com conta, o que ela respondeu também vira o perfil dela
    if (sessao)
      await salvarPerfil(sessao.user.id, {
        nome: r.nome.trim(),
        arroba: normalizarArroba(r.arroba),
        whatsapp: '',
        cidade: r.cidade.trim(),
        nicho: r.nicho.trim(),
        modoIniciante: !r.jaFezPubli,
      });
    window.location.href = '/app/editor/';
  }

  function avancar() {
    if (!valido) return;
    if (!ultima) return setIndice(indice + 1);
    void concluir(numeros);
  }

  const mudar = (parte: Partial<Respostas>) => setR({ ...r, ...parte });
  const aoDigitar = { onKeyDown: (ev: React.KeyboardEvent) => ev.key === 'Enter' && avancar() };

  return (
    <MovimentoDoApp>
      <div className="as">
        <header className="as-topo">
          <Marca />
          <div className="as-passos" role="img" aria-label={`Passo ${indice + 1} de ${ETAPAS.length}`}>
            <span className="as-passo-texto">
              {indice + 1} de {ETAPAS.length}
            </span>
            {ETAPAS.map((e, i) => (
              <span key={e} data-feito={i <= indice || undefined} />
            ))}
          </div>
        </header>

        <main className="as-corpo">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: SUAVE }}
            style={{ display: 'grid', gap: 24 }}
          >
            {etapa === 'cores' && (
              <>
                <h1 className="as-titulo">
                  Escolha as cores do <em>seu portfólio</em>
                </h1>
                <p className="as-texto">Dá para trocar quando quiser. Depois é só montar as seções do seu jeito.</p>
                {/* grupo de rádio: uma parada de Tab só, e as setas trocam a cor (padrão do ARIA) */}
                <div className="as-opcoes as-cores" role="radiogroup" aria-label="Cores">
                  {NUVEM.paletas.map((p, i) => (
                    <button
                      key={p.nome}
                      type="button"
                      role="radio"
                      aria-checked={paleta === i}
                      tabIndex={paleta === i ? 0 : -1}
                      onClick={() => setPaleta(i)}
                      onKeyDown={(ev) => {
                        const passo = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
                        if (!passo) return;
                        ev.preventDefault();
                        const total = NUVEM.paletas.length;
                        const proxima = (i + passo + total) % total;
                        setPaleta(proxima);
                        (ev.currentTarget.parentElement?.children[proxima] as HTMLElement | undefined)?.focus();
                      }}
                    >
                      <span
                        className="ed-amostra"
                        style={{ background: gerarPaleta(p.origem, NUVEM.esquema).claro.destaque }}
                        aria-hidden="true"
                      />
                      {p.nome}
                    </button>
                  ))}
                </div>
                <PreviaDasCores paleta={paleta} />
              </>
            )}

            {etapa === 'nome' && (
              <>
                <h1 className="as-titulo">Como você quer ser chamada?</h1>
                <div className="as-campo">
                  <label htmlFor="nome">Seu nome</label>
                  <input
                    id="nome"
                    ref={campo}
                    value={r.nome}
                    maxLength={40}
                    autoComplete="given-name"
                    onChange={(e) => mudar({ nome: e.target.value })}
                    {...aoDigitar}
                  />
                </div>
              </>
            )}
            {etapa === 'arroba' && (
              <>
                <h1 className="as-titulo">Qual é o seu @?</h1>
                <div className="as-campo">
                  <label htmlFor="arroba">Seu @ no Instagram</label>
                  <input
                    id="arroba"
                    ref={campo}
                    value={r.arroba}
                    maxLength={30}
                    autoCapitalize="none"
                    autoCorrect="off"
                    inputMode="url"
                    onChange={(e) => mudar({ arroba: e.target.value })}
                    onBlur={() => mudar({ arroba: normalizarArroba(r.arroba) })}
                    {...aoDigitar}
                  />
                  <span className="as-dica">Pode pular e preencher depois.</span>
                </div>
              </>
            )}
            {etapa === 'cidade' && (
              <>
                <h1 className="as-titulo">De onde você fala?</h1>
                <div className="as-campo">
                  <label htmlFor="cidade">Sua cidade</label>
                  <input
                    id="cidade"
                    ref={campo}
                    value={r.cidade}
                    maxLength={40}
                    autoComplete="address-level2"
                    onChange={(e) => mudar({ cidade: e.target.value })}
                    {...aoDigitar}
                  />
                  <span className="as-dica">Pode pular.</span>
                </div>
              </>
            )}
            {etapa === 'nicho' && (
              <>
                <h1 className="as-titulo">Sobre o que você fala?</h1>
                <div className="as-opcoes" role="group" aria-label="Nicho">
                  {NICHOS.map((n) => (
                    <button key={n} type="button" aria-pressed={r.nicho === n} onClick={() => mudar({ nicho: n })}>
                      {n}
                    </button>
                  ))}
                </div>
                <div className="as-campo">
                  <label htmlFor="nicho">Ou escreva o seu</label>
                  <input
                    id="nicho"
                    ref={campo}
                    value={NICHOS.includes(r.nicho) ? '' : r.nicho}
                    maxLength={30}
                    onChange={(e) => mudar({ nicho: e.target.value })}
                    {...aoDigitar}
                  />
                </div>
              </>
            )}
            {etapa === 'publi' && (
              <>
                <h1 className="as-titulo">Você já fez alguma publi?</h1>
                <p className="as-texto">
                  Se ainda não, o portfólio destaca seus vídeos e o que você entrega, e esconde as seções de números,
                  público e marcas até você ter o que mostrar.
                </p>
                <div className="as-opcoes" role="radiogroup" aria-label="Já fez publi">
                  {(
                    [
                      [true, 'Já fiz'],
                      [false, 'Ainda não'],
                    ] as const
                  ).map(([valor, texto]) => (
                    <button
                      key={texto}
                      type="button"
                      role="radio"
                      aria-checked={publiRespondida && r.jaFezPubli === valor}
                      onClick={() => (mudar({ jaFezPubli: valor }), setPubliRespondida(true))}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
              </>
            )}
            {etapa === 'grava' && (
              <>
                <h1 className="as-titulo">O que você mostra nos vídeos?</h1>
                <div className="as-campo">
                  <label htmlFor="grava">Em poucas palavras</label>
                  <input
                    id="grava"
                    ref={campo}
                    value={r.oQueGrava}
                    maxLength={40}
                    onChange={(e) => mudar({ oQueGrava: e.target.value })}
                    {...aoDigitar}
                  />
                  <span className="as-dica">Na próxima tela você escolhe e escreve o título da sua capa.</span>
                </div>
              </>
            )}
            {etapa === 'titulo' && (
              <>
                <h1 className="as-titulo">Qual título abre a sua capa?</h1>
                <div className="as-campo">
                  <label htmlFor="titulo">Escreva do seu jeito</label>
                  <input
                    id="titulo"
                    ref={campo}
                    value={r.titulo ?? ''}
                    maxLength={90}
                    placeholder={sugestoesDeTitulo(r.nome, r.oQueGrava)[0]}
                    onChange={(e) => mudar({ titulo: e.target.value })}
                    {...aoDigitar}
                  />
                  <span className="as-dica">
                    Se deixar em branco, usamos a primeira sugestão. Você muda quando quiser, no editor.
                  </span>
                </div>
                <div className="as-sugestoes ed-sugestoes" role="group" aria-label="Sugestões de título">
                  {sugestoesDeTitulo(r.nome, r.oQueGrava).map((t) => (
                    <button key={t} type="button" className="ed-botao-claro" onClick={() => mudar({ titulo: t })}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
            {etapa === 'frase' && (
              <>
                <h1 className="as-titulo">Uma frase que te define?</h1>
                <div className="as-campo">
                  <label htmlFor="frase">Fica embaixo do seu nome</label>
                  <input
                    id="frase"
                    ref={campo}
                    value={r.frase}
                    maxLength={120}
                    onChange={(e) => mudar({ frase: e.target.value })}
                    {...aoDigitar}
                  />
                  <span className="as-dica">Opcional. Você pode escrever depois, no editor.</span>
                </div>
              </>
            )}
            {etapa === 'videos' && (
              <>
                <h1 className="as-titulo">Mostre seus melhores vídeos</h1>
                <p className="as-texto">
                  Escolha até 4 vídeos da sua galeria. A marca procura prova antes de argumento. Pode pular e enviar
                  depois.
                </p>
                {videos.map((v, i) => (
                  <div className="as-video" key={i}>
                    <CampoDeArquivo
                      campo={{ id: 'video', rotulo: `Vídeo ${i + 1}`, tipo: 'video' }}
                      valor={v.video}
                      capa={v.capa}
                      aoMudar={(parte) =>
                        setVideos(
                          videos.map((x, k) =>
                            k === i ? { ...x, video: parte.video ?? '', capa: parte.capa ?? '' } : x,
                          ),
                        )
                      }
                    />
                    <div className="as-campo">
                      <label htmlFor={`titulo-${i}`}>Título do vídeo</label>
                      <input
                        id={`titulo-${i}`}
                        value={v.titulo}
                        maxLength={60}
                        onChange={(e) =>
                          setVideos(videos.map((x, k) => (k === i ? { ...x, titulo: e.target.value } : x)))
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="as-link"
                      onClick={() => setVideos(videos.filter((_, k) => k !== i))}
                    >
                      Remover vídeo
                    </button>
                  </div>
                ))}
                {videos.length < 4 && (
                  <button
                    type="button"
                    className="as-botao as-botao--vazado as-adicionar"
                    onClick={() => setVideos([...videos, { titulo: '', video: '', capa: '' }])}
                  >
                    {videos.length === 0 ? 'Adicionar um vídeo' : 'Adicionar outro vídeo'}
                  </button>
                )}
              </>
            )}
            {etapa === 'numeros' && (
              <>
                <h1 className="as-titulo">Seus números do Instagram</h1>
                <p className="as-texto">
                  Só você sabe esses números, e a página mostra o selo “Informado pela creator”. Pode pular e preencher
                  depois.
                </p>
                <PainelNumeros
                  inicial={numeros}
                  aoSalvar={(n) => {
                    setNumeros(n);
                    void concluir(n);
                  }}
                />
              </>
            )}
          </motion.div>
        </main>

        <div className="as-acoes">
          {indice > 0 && (
            <button type="button" className="as-botao as-botao--vazado" onClick={() => setIndice(indice - 1)}>
              Voltar
            </button>
          )}
          <button type="button" className="as-botao" disabled={!valido} onClick={avancar}>
            {etapa === 'cores'
              ? 'Usar estas cores'
              : etapa === 'numeros'
                ? numeros
                  ? 'Ver meu portfólio'
                  : 'Pular e ver meu portfólio'
                : ultima
                  ? 'Ver meu portfólio'
                  : etapa === 'videos' && videos.every((v) => !v.video)
                    ? 'Pular'
                    : 'Continuar'}
          </button>
        </div>
      </div>
    </MovimentoDoApp>
  );
}

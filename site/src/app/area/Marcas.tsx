// Marcas (DEV-180, 185): um link próprio para cada marca com quem a creator fala, para ela saber quem abriu e quando.
import { useCallback, useEffect, useState } from 'react';
import { apagarLinkDeMarca, criarLinkDeMarca, listarLinksDeMarcas, type LinkDeMarca, type Resumo } from '../nuvem';
import { dataCurta } from '../formatar';
import { supabase } from '../supabase';

const mensagem = (marca: string, url: string) =>
  `Oi${marca ? `, ${marca}` : ''}! Segue meu portfólio, com meus números, vídeos e o que posso entregar: ${url}`;

export function Marcas({ resumo }: { resumo: Resumo }) {
  const [links, setLinks] = useState<LinkDeMarca[] | null>(null);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  const carregar = useCallback(() => listarLinksDeMarcas().then(setLinks), []);
  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function criar(ev: { preventDefault(): void }) {
    ev.preventDefault();
    if (!nome.trim()) return setErro('Escreva o nome da marca.');
    const { data } = await supabase.auth.getSession();
    const dono = data.session?.user.id;
    if (!dono || !(await criarLinkDeMarca(dono, resumo.id, nome)))
      return setErro('Não conseguimos criar o link agora. Tente de novo em instantes.');
    setErro(null);
    setNome('');
    void carregar();
  }

  const urlDe = (codigo: string) => `${window.location.origin}/c/${resumo.slug}/${codigo}/`;

  return (
    <section className="ar-marcas" aria-labelledby="titulo-marcas">
      <h2 id="titulo-marcas">Mandar para uma marca</h2>
      <p className="ed-dica">
        Cada marca recebe um link só dela. Você vê quem abriu e quando; as suas próprias aberturas não contam.
      </p>
      <form className="ar-marcas-form" onSubmit={(ev) => void criar(ev)}>
        <input
          type="text"
          value={nome}
          maxLength={80}
          placeholder="Nome da marca"
          aria-label="Nome da marca"
          onChange={(e) => (setNome(e.target.value), setErro(null))}
        />
        <button type="submit" className="ed-primario">
          Criar link
        </button>
      </form>
      {erro && (
        <p className="ed-erro" role="alert">
          {erro}
        </p>
      )}
      {links?.length === 0 && <p className="ed-dica">Nenhuma marca ainda. Crie o primeiro link acima.</p>}
      <ul className="ar-marcas-lista">
        {links?.map((l) => (
          <li key={l.id}>
            <div>
              <b>{l.marca}</b>
              <span className="ed-dica">
                {l.aberturas.length === 0
                  ? 'Ainda não abriu'
                  : `Abriu ${l.aberturas.length === 1 ? '1 vez' : `${l.aberturas.length} vezes`}, última em ${dataCurta(l.aberturas.at(-1)!).replace('.', '')}`}
              </span>
            </div>
            <div className="ar-acoes">
              <button
                type="button"
                className="ed-botao-claro"
                onClick={() => void navigator.clipboard.writeText(urlDe(l.codigo)).then(() => setCopiado(l.id))}
              >
                {copiado === l.id ? 'Link copiado' : 'Copiar link'}
              </button>
              <a
                className="ar-link-texto"
                href={`https://wa.me/?text=${encodeURIComponent(mensagem(l.marca, urlDe(l.codigo)))}`}
                target="_blank"
                rel="noopener"
              >
                Enviar no WhatsApp
              </a>
              <button
                type="button"
                className="ed-link"
                onClick={() => void apagarLinkDeMarca(l.id).then(carregar)}
                aria-label={`Apagar o link de ${l.marca}`}
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Conta: dados, plano e pagamentos, e os direitos da creator (baixar dados, excluir conta). LGPD: fácil de achar e
// sem truque para segurar a creator.
import { useState } from 'react';
import { whatsappValido } from '@lib/revisao';
import { cancelarExclusao, pedirExclusao, reunirDados, salvarPerfil, type Perfil } from '../nuvem';
import { sair } from '../sessao';

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo = 'text',
  dica,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  dica?: string;
}) {
  return (
    <div className="ed-campo">
      <label htmlFor={id}>{rotulo}</label>
      <input id={id} type={tipo} value={valor} onChange={(e) => aoMudar(e.target.value)} />
      {dica && <span className="ed-dica">{dica}</span>}
    </div>
  );
}

export function Conta({
  usuarioId,
  email,
  perfil,
  aoMudar,
}: {
  usuarioId: string;
  email: string;
  perfil: Perfil;
  aoMudar: () => void;
}) {
  const [p, setP] = useState(perfil);
  const [situacao, setSituacao] = useState<'' | 'salvando' | 'salvo' | 'erro'>('');
  const [confirmacao, setConfirmacao] = useState('');
  const [excluindo, setExcluindo] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const whatsappRuim = p.whatsapp.trim() !== '' && !whatsappValido(p.whatsapp);

  async function salvar() {
    if (whatsappRuim) return;
    setSituacao('salvando');
    const ok = await salvarPerfil(usuarioId, {
      nome: p.nome.trim(),
      arroba: p.arroba.trim(),
      whatsapp: p.whatsapp.trim(),
      cidade: p.cidade.trim(),
      nicho: p.nicho.trim(),
      modoIniciante: p.modoIniciante,
    });
    setSituacao(ok ? 'salvo' : 'erro');
    if (ok) aoMudar();
  }

  async function baixar() {
    setBaixando(true);
    const dados = await reunirDados();
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'meus-dados-portfolio-creator.json';
    a.click();
    URL.revokeObjectURL(a.href);
    setBaixando(false);
  }

  async function excluir() {
    setExcluindo(true);
    if (await pedirExclusao()) aoMudar();
    setExcluindo(false);
  }

  return (
    <section className="ar-secao">
      <h1 className="ar-titulo">Conta</h1>

      <form className="ed-form ar-bloco" onSubmit={(e) => (e.preventDefault(), void salvar())}>
        <h2>Seus dados</h2>
        <Campo
          id="c-email"
          rotulo="E-mail de entrada"
          valor={email}
          aoMudar={() => {}}
          tipo="email"
          dica="Para trocar o e-mail, fale com a gente."
        />
        <Campo id="c-nome" rotulo="Nome" valor={p.nome} aoMudar={(v) => setP({ ...p, nome: v })} />
        <Campo id="c-arroba" rotulo="Seu @" valor={p.arroba} aoMudar={(v) => setP({ ...p, arroba: v })} />
        <Campo
          id="c-whats"
          rotulo="WhatsApp"
          valor={p.whatsapp}
          aoMudar={(v) => setP({ ...p, whatsapp: v })}
          tipo="tel"
          dica={whatsappRuim ? 'Use o número com DDD.' : 'Com DDD. Usado só para avisos sobre o seu portfólio.'}
        />
        <Campo id="c-cidade" rotulo="Cidade" valor={p.cidade} aoMudar={(v) => setP({ ...p, cidade: v })} />
        <Campo id="c-nicho" rotulo="Sobre o que você fala" valor={p.nicho} aoMudar={(v) => setP({ ...p, nicho: v })} />
        <button type="submit" className="ed-primario" disabled={situacao === 'salvando' || whatsappRuim}>
          {situacao === 'salvando' ? 'Salvando…' : 'Salvar dados'}
        </button>
        {situacao === 'salvo' && (
          <p className="ed-ok" role="status">
            Dados salvos.
          </p>
        )}
        {situacao === 'erro' && (
          <p className="ed-aviso" role="alert">
            Não deu para salvar agora. Tente de novo.
          </p>
        )}
      </form>

      <div className="ar-bloco">
        <h2>Plano e pagamentos</h2>
        <p>
          <b>Teste grátis.</b> Você monta o portfólio e vê o mídia kit com marca d’água de teste.
        </p>
        <p className="ed-dica">Nenhum pagamento até agora. Os planos e a publicação chegam em breve.</p>
      </div>

      <div className="ar-bloco">
        <h2>Seus dados são seus</h2>
        <p>Baixe tudo o que você escreveu e enviou: perfil, projetos, lista de fotos e vídeos e pedidos.</p>
        <button type="button" className="ed-botao-claro" disabled={baixando} onClick={() => void baixar()}>
          {baixando ? 'Preparando…' : 'Baixar meus dados'}
        </button>
      </div>

      <div className="ar-bloco ar-perigo">
        <h2>Excluir minha conta</h2>
        {perfil.exclusaoPedidaEm ? (
          <>
            <p className="ed-aviso">
              Pedido de exclusão feito em {new Date(perfil.exclusaoPedidaEm).toLocaleDateString('pt-BR')}. Sua conta
              será apagada 7 dias depois. Até lá, dá para voltar atrás.
            </p>
            <button type="button" className="ed-primario" onClick={() => void cancelarExclusao().then(aoMudar)}>
              Cancelar a exclusão
            </button>
          </>
        ) : (
          <>
            <p>
              Vai ser apagado: seu site e mídia kit, o link do seu portfólio, fotos e vídeos, seu perfil e seu acesso.
              Você tem 7 dias para voltar atrás entrando de novo; depois disso não tem volta.
            </p>
            <div className="ed-campo">
              <label htmlFor="c-excluir">Para confirmar, escreva EXCLUIR</label>
              <input
                id="c-excluir"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                autoCapitalize="characters"
              />
            </div>
            <button
              type="button"
              className="ed-botao-claro"
              disabled={confirmacao.trim().toUpperCase() !== 'EXCLUIR' || excluindo}
              onClick={() => void excluir()}
            >
              {excluindo ? 'Enviando…' : 'Excluir minha conta'}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="ed-link"
        onClick={() => void sair().then(() => (window.location.href = '/app/'))}
      >
        Sair da conta
      </button>
    </section>
  );
}

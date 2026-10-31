// Escolha de plano (DEV-160, 193): rádios nativos em cartões. Usado ao publicar (planos de publicação) e na área,
// para liberar a edição depois do prazo (planos de edição). Valores vêm de lib/planos.ts.
import { formatarValor, type IdDoPlano, type Plano } from '@lib/planos';

export function EscolhaDePlano({
  legenda,
  nome,
  planos,
  valor,
  aoMudar,
}: {
  legenda: string;
  /** `name` do grupo de rádios */
  nome: string;
  planos: Plano[];
  valor: IdDoPlano;
  aoMudar: (id: IdDoPlano) => void;
}) {
  return (
    <fieldset className="pl-planos">
      <legend>{legenda}</legend>
      {planos.map((p) => (
        <label key={p.id} className="pl-plano">
          <input type="radio" name={nome} value={p.id} checked={valor === p.id} onChange={() => aoMudar(p.id)} />
          <span className="pl-plano-nome">{p.nome}</span>
          <span className="pl-plano-valor">
            {formatarValor(p.valor)}
            {p.periodo && `/${p.periodo}`}
          </span>
          <span className="pl-plano-resumo">
            {p.resumo}
            {p.extra &&
              ` Mais ${formatarValor(p.extra.valor)} ${p.extra.nome} (total ${formatarValor(p.valor + p.extra.valor)}).`}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

/** Aceite dos Termos junto do botão de compra (DEV-200). Abre em outra aba para não tirar a creator da tela. */
export function AceiteDosTermos({ acao }: { acao: string }) {
  return (
    <p className="ed-dica pl-termos">
      {acao}, você concorda com os{' '}
      <a href="/portfolio-creator/termos/" target="_blank" rel="noopener">
        Termos de Uso
      </a>{' '}
      e a{' '}
      <a href="/portfolio-creator/privacidade/" target="_blank" rel="noopener">
        Política de Privacidade
      </a>
      .
    </p>
  );
}

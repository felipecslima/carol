// Ferramenta de calibragem: imprime a leitura de cada gravação ao lado do texto cru do OCR.
// INSPECIONAR=1 npx vitest run inspecionar            (todas)
// INSPECIONAR=felipe-5 npx vitest run inspecionar     (só uma)
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'vitest';
import { lerPrint } from '../ler-print';
import { imagemGravada, type Gravacao } from '../motor-tesseract';
import { HOJE } from './helpers';

const filtro = process.env.INSPECIONAR;
const pasta = join(import.meta.dirname, 'fixtures');

describe.runIf(filtro)('inspecionar gravações', () => {
  it('imprime', async () => {
    for (const arq of readdirSync(pasta).filter((a) => a.endsWith('.json')).sort()) {
      if (filtro !== '1' && !arq.startsWith(filtro!)) continue;
      const g: Gravacao = JSON.parse(readFileSync(join(pasta, arq), 'utf8'));
      const p = await lerPrint(imagemGravada(g), HOJE);
      const campos = Object.entries(p.campos).map(([k, c]) => `${k}=${c.valor} «${c.texto}» ${c.confianca}${c.confirmado ? ' ✓' : ''}`);
      const reels = p.reels?.map((c) => `L${c.linha}C${c.coluna}=${c.valor} «${c.texto}» ${c.confianca}`) ?? [];
      const listas = Object.entries(p.listas ?? {}).map(([k, l]) => `${k}: ${l.map((i: { nome: string; pct: number }) => `${i.nome}=${i.pct}`).join(', ')}`);
      const regioes = g.regioes.map((r) => `  ${r.modo} ${r.caixa.map(Math.round).join(',')} → ${r.palavras.map((w) => `${w.texto}·${Math.round(w.confianca * 100)}`).join(' ') || '∅'}`);
      process.stdout.write([
        `\n### ${arq}  tela=${p.tela} idioma=${p.idioma} tema=${p.tema} reserva=${p.precisa_reserva}  (página ${Math.round(g.tempos.pagina)} ms, recortes ${g.regioes.length} em ${Math.round(g.tempos.regioes)} ms)`,
        `periodo=${p.periodo?.texto ?? '-'} (${p.periodo?.dias ?? '-'})  conta=${p.conta?.valor ?? '-'}`,
        ...campos, ...reels, ...listas,
        `nao_lidos=${p.nao_lidos.join(',')}  avisos=${p.avisos.join(',')}`,
        '--- recortes', ...regioes,
        '--- OCR da página',
        ...(g.pagina?.linhas ?? []).map((l) => `${String(l.caixa[1]).padStart(5)} ${l.palavras.map((w) => `${w.texto}·${Math.round(w.confianca * 100)}`).join(' ')}`),
      ].join('\n') + '\n');
    }
  });
});

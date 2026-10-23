// Estado do editor (Zustand): o JSON do projeto, mais o histórico de desfazer e refazer (zundo). Toda mudança
// passa pelas operações puras de lib/operacoes.ts, então o histórico guarda projetos inteiros e nada se perde.
import { temporal } from 'zundo';
import { createStore } from 'zustand/vanilla';
import type { Registro } from '@lib/bloco';
import * as op from '@lib/operacoes';
import type { Projeto } from '@lib/projeto';

export interface EstadoDoEditor {
  projeto: Projeto;
  /** bloco selecionado (primeiro toque); `null` = nenhum */
  selecionado: string | null;
  selecionar: (id: string | null) => void;
  mover: (id: string, direcao: -1 | 1) => void;
  esconder: (id: string) => void;
  devolver: (id: string) => void;
  adicionar: (tipo: string) => void;
  duplicar: (id: string) => void;
  atualizarDados: (id: string, dados: Record<string, unknown>) => void;
  trocarVariacao: (id: string, variacao: string) => void;
  /** troca o projeto inteiro (carregar do servidor); entra no histórico como uma mudança só */
  substituir: (projeto: Projeto) => void;
}

const novoId = () => `b${crypto.randomUUID().slice(0, 8)}`;

/** Cria um editor isolado (um por tela; nos testes, um por teste). */
export function criarEditor(inicial: Projeto, registro: Registro, gerarId: () => string = novoId) {
  return createStore<EstadoDoEditor>()(
    temporal(
      (set) => ({
        projeto: inicial,
        selecionado: null,
        selecionar: (id) => set({ selecionado: id }),
        mover: (id, direcao) => set((s) => ({ projeto: op.mover(s.projeto, id, direcao) })),
        esconder: (id) =>
          set((s) => ({
            projeto: op.esconder(s.projeto, id, registro),
            selecionado: s.selecionado === id ? null : s.selecionado,
          })),
        devolver: (id) => set((s) => ({ projeto: op.devolver(s.projeto, id, registro) })),
        adicionar: (tipo) => set((s) => ({ projeto: op.adicionar(s.projeto, tipo, gerarId(), registro) })),
        duplicar: (id) => set((s) => ({ projeto: op.duplicar(s.projeto, id, gerarId(), registro) })),
        atualizarDados: (id, dados) => set((s) => ({ projeto: op.atualizarDados(s.projeto, id, dados) })),
        trocarVariacao: (id, variacao) =>
          set((s) => ({ projeto: op.trocarVariacao(s.projeto, id, variacao, registro) })),
        substituir: (projeto) => set({ projeto }),
      }),
      {
        // só o projeto entra no histórico: selecionar um bloco não é "desfazível"
        partialize: (s) => ({ projeto: s.projeto }),
        // mudança que não alterou nada (ex.: mover no limite) não vira passo do histórico
        equality: (passado, atual) => passado.projeto === atual.projeto,
        limit: 100,
      },
    ),
  );
}

export type Editor = ReturnType<typeof criarEditor>;

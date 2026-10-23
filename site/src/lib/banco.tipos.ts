// Gerado por `npx supabase gen types typescript --project-id djuzcmnvwkethwlilhik --schema public`. Não editar à mão.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          acao: string
          alvo: string | null
          ator: string | null
          criado_em: string
          detalhes: Json
          id: number
        }
        Insert: {
          acao: string
          alvo?: string | null
          ator?: string | null
          criado_em?: string
          detalhes?: Json
          id?: never
        }
        Update: {
          acao?: string
          alvo?: string | null
          ator?: string | null
          criado_em?: string
          detalhes?: Json
          id?: never
        }
        Relationships: []
      }
      brand_links: {
        Row: {
          codigo: string
          criado_em: string
          dono: string
          id: string
          nome_marca: string
          projeto_id: string
        }
        Insert: {
          codigo: string
          criado_em?: string
          dono: string
          id?: string
          nome_marca: string
          projeto_id: string
        }
        Update: {
          codigo?: string
          criado_em?: string
          dono?: string
          id?: string
          nome_marca?: string
          projeto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_links_dono_fkey"
            columns: ["dono"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_links_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_opens: {
        Row: {
          aberto_em: string
          id: number
          link_id: string
        }
        Insert: {
          aberto_em?: string
          id?: never
          link_id: string
        }
        Update: {
          aberto_em?: string
          id?: never
          link_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_opens_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "brand_links"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          criado_em: string
          dono: string | null
          id: number
          nome: string
          propriedades: Json
        }
        Insert: {
          criado_em?: string
          dono?: string | null
          id?: never
          nome: string
          propriedades?: Json
        }
        Update: {
          criado_em?: string
          dono?: string | null
          id?: never
          nome?: string
          propriedades?: Json
        }
        Relationships: [
          {
            foreignKeyName: "events_dono_fkey"
            columns: ["dono"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          bytes: number
          capa: string
          criado_em: string
          dono: string
          duracao_s: number | null
          id: string
          nome: string
          public_id: string
          tipo: string
          url: string
        }
        Insert: {
          bytes?: number
          capa: string
          criado_em?: string
          dono: string
          duracao_s?: number | null
          id?: string
          nome?: string
          public_id: string
          tipo: string
          url: string
        }
        Update: {
          bytes?: number
          capa?: string
          criado_em?: string
          dono?: string
          duracao_s?: number | null
          id?: string
          nome?: string
          public_id?: string
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_dono_fkey"
            columns: ["dono"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          atualizado_em: string
          criado_em: string
          dono: string
          id: string
          link_pagamento: string | null
          pago_em: string | null
          plano: string
          projeto_id: string
          slack_thread_ts: string | null
          status: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          dono: string
          id?: string
          link_pagamento?: string | null
          pago_em?: string | null
          plano: string
          projeto_id: string
          slack_thread_ts?: string | null
          status?: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          dono?: string
          id?: string
          link_pagamento?: string | null
          pago_em?: string | null
          plano?: string
          projeto_id?: string
          slack_thread_ts?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_dono_fkey"
            columns: ["dono"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_grants: {
        Row: {
          creator: string
          criado_em: string
          id: string
          liberado_por: string | null
          molde: string
          motivo: string
          validade: string | null
        }
        Insert: {
          creator: string
          criado_em?: string
          id?: string
          liberado_por?: string | null
          molde: string
          motivo?: string
          validade?: string | null
        }
        Update: {
          creator?: string
          criado_em?: string
          id?: string
          liberado_por?: string | null
          molde?: string
          motivo?: string
          validade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_grants_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          arroba: string
          atualizado_em: string
          cidade: string
          criado_em: string
          id: string
          modo_iniciante: boolean
          nicho: string
          nome: string
          whatsapp: string
        }
        Insert: {
          arroba?: string
          atualizado_em?: string
          cidade?: string
          criado_em?: string
          id: string
          modo_iniciante?: boolean
          nicho?: string
          nome?: string
          whatsapp?: string
        }
        Update: {
          arroba?: string
          atualizado_em?: string
          cidade?: string
          criado_em?: string
          id?: string
          modo_iniciante?: boolean
          nicho?: string
          nome?: string
          whatsapp?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          atualizado_em: string
          blocos: Json
          cantos: string
          clima: string
          cor_propria: string | null
          criado_em: string
          dono: string
          fontes: string
          guardados: Json
          id: string
          modelo: string
          modo_iniciante: boolean
          numeros: Json | null
          paleta: number
          prazo_edicao: string | null
          publicado: Json | null
          publicado_em: string | null
          slug: string | null
          status: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          blocos?: Json
          cantos: string
          clima?: string
          cor_propria?: string | null
          criado_em?: string
          dono: string
          fontes: string
          guardados?: Json
          id?: string
          modelo: string
          modo_iniciante?: boolean
          numeros?: Json | null
          paleta?: number
          prazo_edicao?: string | null
          publicado?: Json | null
          publicado_em?: string | null
          slug?: string | null
          status?: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          blocos?: Json
          cantos?: string
          clima?: string
          cor_propria?: string | null
          criado_em?: string
          dono?: string
          fontes?: string
          guardados?: Json
          id?: string
          modelo?: string
          modo_iniciante?: boolean
          numeros?: Json | null
          paleta?: number
          prazo_edicao?: string | null
          publicado?: Json | null
          publicado_em?: string | null
          slug?: string | null
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_dono_fkey"
            columns: ["dono"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          arroba: string
          criado_em: string
          id: number
          nome: string
          whatsapp: string
        }
        Insert: {
          arroba?: string
          criado_em?: string
          id?: never
          nome: string
          whatsapp: string
        }
        Update: {
          arroba?: string
          criado_em?: string
          id?: never
          nome?: string
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      eh_equipe: { Args: never; Returns: boolean }
      papel_da_equipe: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

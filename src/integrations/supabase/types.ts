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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          message: string | null
          phone: string
          program_slug: string | null
          source_path: string | null
          status: string
          university_slug: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          message?: string | null
          phone: string
          program_slug?: string | null
          source_path?: string | null
          status?: string
          university_slug?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          program_slug?: string | null
          source_path?: string | null
          status?: string
          university_slug?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          average_salary_lpa: string
          careers: string[]
          code: string
          created_at: string
          curriculum: Json
          duration_years: number
          eligibility: string
          hero_image_url: string | null
          id: string
          level: string
          name: string
          overview: string
          published: boolean
          semesters: number
          slug: string
          sort_order: number
          specialisations: string[]
          updated_at: string
        }
        Insert: {
          average_salary_lpa?: string
          careers?: string[]
          code: string
          created_at?: string
          curriculum?: Json
          duration_years?: number
          eligibility?: string
          hero_image_url?: string | null
          id?: string
          level?: string
          name: string
          overview?: string
          published?: boolean
          semesters?: number
          slug: string
          sort_order?: number
          specialisations?: string[]
          updated_at?: string
        }
        Update: {
          average_salary_lpa?: string
          careers?: string[]
          code?: string
          created_at?: string
          curriculum?: Json
          duration_years?: number
          eligibility?: string
          hero_image_url?: string | null
          id?: string
          level?: string
          name?: string
          overview?: string
          published?: boolean
          semesters?: number
          slug?: string
          sort_order?: number
          specialisations?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      universities: {
        Row: {
          about: string
          accent_color: string
          approvals: string[]
          city: string
          created_at: string
          domain: string | null
          established: number | null
          hero_image_url: string | null
          highlights: string[]
          hiring_partner_count: string
          id: string
          logo_url: string | null
          naac_grade: string
          name: string
          placement_partners: string[]
          published: boolean
          rating: number
          reviews: number
          short_name: string
          slug: string
          sort_order: number
          state: string
          students_enrolled: string
          updated_at: string
        }
        Insert: {
          about?: string
          accent_color?: string
          approvals?: string[]
          city?: string
          created_at?: string
          domain?: string | null
          established?: number | null
          hero_image_url?: string | null
          highlights?: string[]
          hiring_partner_count?: string
          id?: string
          logo_url?: string | null
          naac_grade?: string
          name: string
          placement_partners?: string[]
          published?: boolean
          rating?: number
          reviews?: number
          short_name?: string
          slug: string
          sort_order?: number
          state?: string
          students_enrolled?: string
          updated_at?: string
        }
        Update: {
          about?: string
          accent_color?: string
          approvals?: string[]
          city?: string
          created_at?: string
          domain?: string | null
          established?: number | null
          hero_image_url?: string | null
          highlights?: string[]
          hiring_partner_count?: string
          id?: string
          logo_url?: string | null
          naac_grade?: string
          name?: string
          placement_partners?: string[]
          published?: boolean
          rating?: number
          reviews?: number
          short_name?: string
          slug?: string
          sort_order?: number
          state?: string
          students_enrolled?: string
          updated_at?: string
        }
        Relationships: []
      }
      university_programs: {
        Row: {
          created_at: string
          emi_per_month: number
          id: string
          per_semester_fee: number
          program_slug: string
          published: boolean
          seats_filled_percent: number
          sort_order: number
          total_fee: number
          university_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emi_per_month?: number
          id?: string
          per_semester_fee?: number
          program_slug: string
          published?: boolean
          seats_filled_percent?: number
          sort_order?: number
          total_fee?: number
          university_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emi_per_month?: number
          id?: string
          per_semester_fee?: number
          program_slug?: string
          published?: boolean
          seats_filled_percent?: number
          sort_order?: number
          total_fee?: number
          university_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "university_programs_program_slug_fkey"
            columns: ["program_slug"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "university_programs_university_slug_fkey"
            columns: ["university_slug"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const

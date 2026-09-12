export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      claim_evidence: {
        Row: {
          academic_session: string | null;
          claim_type: string;
          created_at: string;
          expires_at: string;
          id: string;
          methodology: string | null;
          offering_id: string | null;
          program_slug: string | null;
          published: boolean;
          rendered_claim: string;
          reviewed_by: string | null;
          source_date: string | null;
          source_url: string;
          university_slug: string | null;
          updated_at: string;
          verified_at: string;
        };
        Insert: {
          academic_session?: string | null;
          claim_type: string;
          created_at?: string;
          expires_at: string;
          id?: string;
          methodology?: string | null;
          offering_id?: string | null;
          program_slug?: string | null;
          published?: boolean;
          rendered_claim: string;
          reviewed_by?: string | null;
          source_date?: string | null;
          source_url: string;
          university_slug?: string | null;
          updated_at?: string;
          verified_at: string;
        };
        Update: {
          academic_session?: string | null;
          claim_type?: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          methodology?: string | null;
          offering_id?: string | null;
          program_slug?: string | null;
          published?: boolean;
          rendered_claim?: string;
          reviewed_by?: string | null;
          source_date?: string | null;
          source_url?: string;
          university_slug?: string | null;
          updated_at?: string;
          verified_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "claim_evidence_offering_id_fkey";
            columns: ["offering_id"];
            isOneToOne: false;
            referencedRelation: "university_programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claim_evidence_program_slug_fkey";
            columns: ["program_slug"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "claim_evidence_university_slug_fkey";
            columns: ["university_slug"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["slug"];
          },
        ];
      };
      leads: {
        Row: {
          city: string | null;
          consent_at: string | null;
          consent_text: string | null;
          consent_version: string | null;
          contact_channels: Json;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          message: string | null;
          phone: string;
          program_slug: string | null;
          qualification: string | null;
          goal: string | null;
          referrer: string | null;
          share_with_university: boolean;
          source_path: string | null;
          status: string;
          university_slug: string | null;
          university_share_consent_at: string | null;
          university_share_consent_text: string | null;
          university_share_consent_version: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          city?: string | null;
          consent_at?: string | null;
          consent_text?: string | null;
          consent_version?: string | null;
          contact_channels?: Json;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          message?: string | null;
          phone: string;
          program_slug?: string | null;
          qualification?: string | null;
          goal?: string | null;
          referrer?: string | null;
          share_with_university?: boolean;
          source_path?: string | null;
          status?: string;
          university_slug?: string | null;
          university_share_consent_at?: string | null;
          university_share_consent_text?: string | null;
          university_share_consent_version?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          city?: string | null;
          consent_at?: string | null;
          consent_text?: string | null;
          consent_version?: string | null;
          contact_channels?: Json;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          message?: string | null;
          phone?: string;
          program_slug?: string | null;
          qualification?: string | null;
          goal?: string | null;
          referrer?: string | null;
          share_with_university?: boolean;
          source_path?: string | null;
          status?: string;
          university_slug?: string | null;
          university_share_consent_at?: string | null;
          university_share_consent_text?: string | null;
          university_share_consent_version?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      offering_specialisations: {
        Row: {
          academic_session: string | null;
          availability_status: string;
          created_at: string;
          id: string;
          next_review_at: string | null;
          offering_id: string;
          published: boolean;
          source_url: string | null;
          specialisation_id: string;
          university_label: string | null;
          updated_at: string;
          verified_at: string | null;
        };
        Insert: {
          academic_session?: string | null;
          availability_status?: string;
          created_at?: string;
          id?: string;
          next_review_at?: string | null;
          offering_id: string;
          published?: boolean;
          source_url?: string | null;
          specialisation_id: string;
          university_label?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Update: {
          academic_session?: string | null;
          availability_status?: string;
          created_at?: string;
          id?: string;
          next_review_at?: string | null;
          offering_id?: string;
          published?: boolean;
          source_url?: string | null;
          specialisation_id?: string;
          university_label?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "offering_specialisations_offering_id_fkey";
            columns: ["offering_id"];
            isOneToOne: false;
            referencedRelation: "university_programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offering_specialisations_specialisation_id_fkey";
            columns: ["specialisation_id"];
            isOneToOne: false;
            referencedRelation: "specialisations";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          average_salary_lpa: string;
          careers: string[];
          code: string;
          created_at: string;
          curriculum: Json;
          duration_years: number;
          eligibility: string;
          hero_image_url: string | null;
          id: string;
          level: string;
          name: string;
          overview: string;
          published: boolean;
          semesters: number;
          slug: string;
          sort_order: number;
          specialisations: string[];
          updated_at: string;
        };
        Insert: {
          average_salary_lpa?: string;
          careers?: string[];
          code: string;
          created_at?: string;
          curriculum?: Json;
          duration_years?: number;
          eligibility?: string;
          hero_image_url?: string | null;
          id?: string;
          level?: string;
          name: string;
          overview?: string;
          published?: boolean;
          semesters?: number;
          slug: string;
          sort_order?: number;
          specialisations?: string[];
          updated_at?: string;
        };
        Update: {
          average_salary_lpa?: string;
          careers?: string[];
          code?: string;
          created_at?: string;
          curriculum?: Json;
          duration_years?: number;
          eligibility?: string;
          hero_image_url?: string | null;
          id?: string;
          level?: string;
          name?: string;
          overview?: string;
          published?: boolean;
          semesters?: number;
          slug?: string;
          sort_order?: number;
          specialisations?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      specialisations: {
        Row: {
          career_directions: string[];
          category: string | null;
          created_at: string;
          id: string;
          name: string;
          program_slug: string | null;
          published: boolean;
          skills: string[];
          slug: string;
          sort_order: number;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          career_directions?: string[];
          category?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          program_slug?: string | null;
          published?: boolean;
          skills?: string[];
          slug: string;
          sort_order?: number;
          summary?: string | null;
          updated_at?: string;
        };
        Update: {
          career_directions?: string[];
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          program_slug?: string | null;
          published?: boolean;
          skills?: string[];
          slug?: string;
          sort_order?: number;
          summary?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "specialisations_program_slug_fkey";
            columns: ["program_slug"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["slug"];
          },
        ];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      universities: {
        Row: {
          about: string;
          accent_color: string;
          approvals: string[];
          city: string;
          created_at: string;
          domain: string | null;
          established: number | null;
          hero_image_url: string | null;
          hei_id: string | null;
          highlights: string[];
          hiring_partner_count: string;
          id: string;
          legal_name: string | null;
          logo_url: string | null;
          naac_grade: string;
          name: string;
          next_review_at: string | null;
          placement_partners: string[];
          profile_depth: string;
          published: boolean;
          rating: number;
          reviews: number;
          short_name: string;
          slug: string;
          sort_order: number;
          state: string;
          students_enrolled: string;
          updated_at: string;
          verification_academic_session: string | null;
          verification_source_url: string | null;
          verified_at: string | null;
        };
        Insert: {
          about?: string;
          accent_color?: string;
          approvals?: string[];
          city?: string;
          created_at?: string;
          domain?: string | null;
          established?: number | null;
          hero_image_url?: string | null;
          hei_id?: string | null;
          highlights?: string[];
          hiring_partner_count?: string;
          id?: string;
          legal_name?: string | null;
          logo_url?: string | null;
          naac_grade?: string;
          name: string;
          next_review_at?: string | null;
          placement_partners?: string[];
          profile_depth?: string;
          published?: boolean;
          rating?: number;
          reviews?: number;
          short_name?: string;
          slug: string;
          sort_order?: number;
          state?: string;
          students_enrolled?: string;
          updated_at?: string;
          verification_academic_session?: string | null;
          verification_source_url?: string | null;
          verified_at?: string | null;
        };
        Update: {
          about?: string;
          accent_color?: string;
          approvals?: string[];
          city?: string;
          created_at?: string;
          domain?: string | null;
          established?: number | null;
          hero_image_url?: string | null;
          hei_id?: string | null;
          highlights?: string[];
          hiring_partner_count?: string;
          id?: string;
          legal_name?: string | null;
          logo_url?: string | null;
          naac_grade?: string;
          name?: string;
          next_review_at?: string | null;
          placement_partners?: string[];
          profile_depth?: string;
          published?: boolean;
          rating?: number;
          reviews?: number;
          short_name?: string;
          slug?: string;
          sort_order?: number;
          state?: string;
          students_enrolled?: string;
          updated_at?: string;
          verification_academic_session?: string | null;
          verification_source_url?: string | null;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      university_programs: {
        Row: {
          academic_session: string | null;
          created_at: string;
          curriculum: Json | null;
          delivery_mode: string;
          duration_years: number | null;
          eligibility: string | null;
          emi_per_month: number | null;
          emi_per_month_verified: boolean;
          entitlement_source_url: string | null;
          entitlement_status: string;
          evidence_snapshot_hash: string | null;
          exam_mode: string | null;
          fee_components: Json;
          fee_source_url: string | null;
          fee_next_review_at: string | null;
          fee_verified_at: string | null;
          fees_verified: boolean;
          id: string;
          next_review_at: string | null;
          official_application_url: string | null;
          official_programme_name: string | null;
          per_semester_fee: number | null;
          per_semester_fee_verified: boolean;
          program_slug: string;
          published: boolean;
          refund_policy_url: string | null;
          scholarship_summary: string | null;
          seats_filled_percent: number | null;
          semesters: number | null;
          sort_order: number;
          total_fee: number | null;
          university_slug: string;
          university_programme_url: string | null;
          updated_at: string;
          verified_at: string | null;
        };
        Insert: {
          academic_session?: string | null;
          created_at?: string;
          curriculum?: Json | null;
          delivery_mode?: string;
          duration_years?: number | null;
          eligibility?: string | null;
          emi_per_month?: number | null;
          emi_per_month_verified?: boolean;
          entitlement_source_url?: string | null;
          entitlement_status?: string;
          evidence_snapshot_hash?: string | null;
          exam_mode?: string | null;
          fee_components?: Json;
          fee_source_url?: string | null;
          fee_next_review_at?: string | null;
          fee_verified_at?: string | null;
          fees_verified?: boolean;
          id?: string;
          next_review_at?: string | null;
          official_application_url?: string | null;
          official_programme_name?: string | null;
          per_semester_fee?: number | null;
          per_semester_fee_verified?: boolean;
          program_slug: string;
          published?: boolean;
          refund_policy_url?: string | null;
          scholarship_summary?: string | null;
          seats_filled_percent?: number | null;
          semesters?: number | null;
          sort_order?: number;
          total_fee?: number | null;
          university_slug: string;
          university_programme_url?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Update: {
          academic_session?: string | null;
          created_at?: string;
          curriculum?: Json | null;
          delivery_mode?: string;
          duration_years?: number | null;
          eligibility?: string | null;
          emi_per_month?: number | null;
          emi_per_month_verified?: boolean;
          entitlement_source_url?: string | null;
          entitlement_status?: string;
          evidence_snapshot_hash?: string | null;
          exam_mode?: string | null;
          fee_components?: Json;
          fee_source_url?: string | null;
          fee_next_review_at?: string | null;
          fee_verified_at?: string | null;
          fees_verified?: boolean;
          id?: string;
          next_review_at?: string | null;
          official_application_url?: string | null;
          official_programme_name?: string | null;
          per_semester_fee?: number | null;
          per_semester_fee_verified?: boolean;
          program_slug?: string;
          published?: boolean;
          refund_policy_url?: string | null;
          scholarship_summary?: string | null;
          seats_filled_percent?: number | null;
          semesters?: number | null;
          sort_order?: number;
          total_fee?: number | null;
          university_slug?: string;
          university_programme_url?: string | null;
          updated_at?: string;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "university_programs_program_slug_fkey";
            columns: ["program_slug"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "university_programs_university_slug_fkey";
            columns: ["university_slug"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["slug"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      submit_counselling_lead: {
        Args: {
          p_contact_channels?: Json;
          p_consent_given?: boolean;
          p_consent_text?: string | null;
          p_consent_version?: string | null;
          p_email?: string | null;
          p_full_name: string;
          p_goal?: string | null;
          p_message?: string | null;
          p_phone: string;
          p_program_slug?: string | null;
          p_qualification?: string | null;
          p_referrer?: string | null;
          p_share_with_university?: boolean;
          p_source_path?: string | null;
          p_university_slug?: string | null;
          p_university_share_consent_text?: string | null;
          p_university_share_consent_version?: string | null;
          p_utm_campaign?: string | null;
          p_utm_medium?: string | null;
          p_utm_source?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      app_role: "admin" | "editor" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const;

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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          custom_branding: Json | null
          custom_business_types: Json | null
          custom_product_services: Json | null
          enrollment_benefits: Json | null
          enrollment_checklist: Json | null
          id: string
          name: string
          updated_at: string | null
          use_custom_options: boolean | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          custom_branding?: Json | null
          custom_business_types?: Json | null
          custom_product_services?: Json | null
          enrollment_benefits?: Json | null
          enrollment_checklist?: Json | null
          id?: string
          name: string
          updated_at?: string | null
          use_custom_options?: boolean | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          custom_branding?: Json | null
          custom_business_types?: Json | null
          custom_product_services?: Json | null
          enrollment_benefits?: Json | null
          enrollment_checklist?: Json | null
          id?: string
          name?: string
          updated_at?: string | null
          use_custom_options?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_clients_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          document_type: string
          expires_at: string | null
          file_name: string
          file_url: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          supplier_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          expires_at?: string | null
          file_name: string
          file_url: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          supplier_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          expires_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          supplier_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "client_suppliers"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_drafts: {
        Row: {
          client_id: string
          contact_email: string
          created_at: string
          draft_data: Json
          id: string
          ip_address: unknown | null
          last_step_completed: string | null
          progress_percentage: number | null
          status: string | null
          submitted_at: string | null
          tax_id: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          client_id: string
          contact_email: string
          created_at?: string
          draft_data?: Json
          id?: string
          ip_address?: unknown | null
          last_step_completed?: string | null
          progress_percentage?: number | null
          status?: string | null
          submitted_at?: string | null
          tax_id?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          client_id?: string
          contact_email?: string
          created_at?: string
          draft_data?: Json
          id?: string
          ip_address?: unknown | null
          last_step_completed?: string | null
          progress_percentage?: number | null
          status?: string | null
          submitted_at?: string | null
          tax_id?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_drafts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      exceptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          reason: string
          risk_factor_id: string | null
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          reason: string
          risk_factor_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string
          risk_factor_id?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exceptions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exceptions_risk_factor_id_fkey"
            columns: ["risk_factor_id"]
            isOneToOne: false
            referencedRelation: "risk_factors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exceptions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "client_suppliers"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "exceptions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          card_type: string | null
          created_at: string
          id: string
          is_default: boolean | null
          stripe_payment_method_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          card_type?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          card_type?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          stripe_payment_method_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      program_package_risk_factors: {
        Row: {
          created_at: string
          id: string
          program_package_id: string | null
          risk_factor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          program_package_id?: string | null
          risk_factor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          program_package_id?: string | null
          risk_factor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_package_risk_factors_program_package_id_fkey"
            columns: ["program_package_id"]
            isOneToOne: false
            referencedRelation: "program_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_package_risk_factors_risk_factor_id_fkey"
            columns: ["risk_factor_id"]
            isOneToOne: false
            referencedRelation: "risk_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      program_packages: {
        Row: {
          auto_renew_enabled: boolean | null
          auto_renew_price: number | null
          client_id: string
          created_at: string | null
          description: string | null
          duration_months: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          renewal_period_months: number | null
          updated_at: string | null
        }
        Insert: {
          auto_renew_enabled?: boolean | null
          auto_renew_price?: number | null
          client_id: string
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          renewal_period_months?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_renew_enabled?: boolean | null
          auto_renew_price?: number | null
          client_id?: string
          created_at?: string | null
          description?: string | null
          duration_months?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          renewal_period_months?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_packages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      renewal_history: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          program_package_id: string | null
          renewal_date: string
          status: string | null
          stripe_payment_intent_id: string | null
          supplier_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          program_package_id?: string | null
          renewal_date: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          program_package_id?: string | null
          renewal_date?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "renewal_history_program_package_id_fkey"
            columns: ["program_package_id"]
            isOneToOne: false
            referencedRelation: "program_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_history_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "client_suppliers"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "renewal_history_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_areas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          weight?: number | null
        }
        Relationships: []
      }
      risk_factors: {
        Row: {
          ai_prompt_template: string | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          factor_type: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          name: string
          risk_area_id: string | null
          weight: number | null
        }
        Insert: {
          ai_prompt_template?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          factor_type?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name: string
          risk_area_id?: string | null
          weight?: number | null
        }
        Update: {
          ai_prompt_template?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          factor_type?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name?: string
          risk_area_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_factors_risk_area_id_fkey"
            columns: ["risk_area_id"]
            isOneToOne: false
            referencedRelation: "risk_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          payment_method_brand: string | null
          payment_method_id: string | null
          payment_method_last4: string | null
          program_package_id: string | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          payment_method_brand?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          program_package_id?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          payment_method_brand?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          program_package_id?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_program_package_id_fkey"
            columns: ["program_package_id"]
            isOneToOne: false
            referencedRelation: "program_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_client_relationships: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          relationship_end_date: string | null
          relationship_start_date: string | null
          status: Database["public"]["Enums"]["supplier_client_status"]
          supplier_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          relationship_end_date?: string | null
          relationship_start_date?: string | null
          status?: Database["public"]["Enums"]["supplier_client_status"]
          supplier_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          relationship_end_date?: string | null
          relationship_start_date?: string | null
          status?: Database["public"]["Enums"]["supplier_client_status"]
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_client_relationships_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_supplier_client_relationships_supplier_id"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "client_suppliers"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "fk_supplier_client_relationships_supplier_id"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_risk_assessments: {
        Row: {
          assessed_at: string | null
          assessed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          risk_factor_id: string | null
          score: number | null
          status: string | null
          supplier_id: string | null
        }
        Insert: {
          assessed_at?: string | null
          assessed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          risk_factor_id?: string | null
          score?: number | null
          status?: string | null
          supplier_id?: string | null
        }
        Update: {
          assessed_at?: string | null
          assessed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          risk_factor_id?: string | null
          score?: number | null
          status?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_risk_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_risk_assessments_risk_factor_id_fkey"
            columns: ["risk_factor_id"]
            isOneToOne: false
            referencedRelation: "risk_factors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_risk_assessments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "client_suppliers"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_risk_assessments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          auto_renew_enabled: boolean | null
          auto_renew_payment_method: string | null
          business_type: string | null
          client_id: string | null
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          domain: string | null
          ein: string | null
          id: string
          next_renewal_date: string | null
          overall_risk_level: Database["public"]["Enums"]["risk_level"] | null
          program_package_id: string | null
          status: Database["public"]["Enums"]["supplier_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auto_renew_enabled?: boolean | null
          auto_renew_payment_method?: string | null
          business_type?: string | null
          client_id?: string | null
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          domain?: string | null
          ein?: string | null
          id?: string
          next_renewal_date?: string | null
          overall_risk_level?: Database["public"]["Enums"]["risk_level"] | null
          program_package_id?: string | null
          status?: Database["public"]["Enums"]["supplier_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auto_renew_enabled?: boolean | null
          auto_renew_payment_method?: string | null
          business_type?: string | null
          client_id?: string | null
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          domain?: string | null
          ein?: string | null
          id?: string
          next_renewal_date?: string | null
          overall_risk_level?: Database["public"]["Enums"]["risk_level"] | null
          program_package_id?: string | null
          status?: Database["public"]["Enums"]["supplier_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_program_package_id_fkey"
            columns: ["program_package_id"]
            isOneToOne: false
            referencedRelation: "program_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      client_suppliers: {
        Row: {
          address: string | null
          auto_renew_enabled: boolean | null
          business_type: string | null
          client_id: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          domain: string | null
          ein: string | null
          next_renewal_date: string | null
          overall_risk_level: Database["public"]["Enums"]["risk_level"] | null
          program_package_id: string | null
          relationship_end_date: string | null
          relationship_notes: string | null
          relationship_start_date: string | null
          relationship_status:
            | Database["public"]["Enums"]["supplier_client_status"]
            | null
          supplier_id: string | null
          supplier_status: Database["public"]["Enums"]["supplier_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_client_relationships_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_program_package_id_fkey"
            columns: ["program_package_id"]
            isOneToOne: false
            referencedRelation: "program_packages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_supplier_duplicates: {
        Args: { p_client_id: string; p_contact_email: string; p_ein?: string }
        Returns: {
          duplicate_type: string
          existing_company_name: string
          existing_supplier_id: string
        }[]
      }
      extract_domain_from_email: {
        Args: { email_address: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "client" | "supplier"
      document_status: "pending" | "approved" | "rejected" | "expired"
      risk_level: "low" | "medium" | "high" | "critical"
      supplier_client_status:
        | "active"
        | "inactive"
        | "pending"
        | "terminated"
        | "suspended"
      supplier_status: "pending" | "active" | "suspended" | "rejected"
      user_role:
        | "super_admin"
        | "risk_reviewer"
        | "inside_sales"
        | "client"
        | "supplier"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["super_admin", "client", "supplier"],
      document_status: ["pending", "approved", "rejected", "expired"],
      risk_level: ["low", "medium", "high", "critical"],
      supplier_client_status: [
        "active",
        "inactive",
        "pending",
        "terminated",
        "suspended",
      ],
      supplier_status: ["pending", "active", "suspended", "rejected"],
      user_role: [
        "super_admin",
        "risk_reviewer",
        "inside_sales",
        "client",
        "supplier",
      ],
    },
  },
} as const

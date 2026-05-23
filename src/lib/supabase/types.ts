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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budget_requests: {
        Row: {
          contractor_id: string
          created_at: string
          id: string
          message: string
          professional_id: string
          status: Database["public"]["Enums"]["budget_request_status"]
          updated_at: string
        }
        Insert: {
          contractor_id: string
          created_at?: string
          id?: string
          message: string
          professional_id: string
          status?: Database["public"]["Enums"]["budget_request_status"]
          updated_at?: string
        }
        Update: {
          contractor_id?: string
          created_at?: string
          id?: string
          message?: string
          professional_id?: string
          status?: Database["public"]["Enums"]["budget_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_requests_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_requests_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      completed_services: {
        Row: {
          client_name: string | null
          created_at: string
          execution_date: string
          id: string
          origin: Database["public"]["Enums"]["service_origin"]
          photos_added: boolean
          professional_id: string
          service_type: string
          status: Database["public"]["Enums"]["service_status"]
          value: number | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          execution_date: string
          id?: string
          origin?: Database["public"]["Enums"]["service_origin"]
          photos_added?: boolean
          professional_id: string
          service_type: string
          status?: Database["public"]["Enums"]["service_status"]
          value?: number | null
        }
        Update: {
          client_name?: string | null
          created_at?: string
          execution_date?: string
          id?: string
          origin?: Database["public"]["Enums"]["service_origin"]
          photos_added?: boolean
          professional_id?: string
          service_type?: string
          status?: Database["public"]["Enums"]["service_status"]
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "completed_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_logs: {
        Row: {
          contact_type: Database["public"]["Enums"]["contact_log_type"]
          contractor_id: string
          created_at: string
          id: string
          professional_id: string
        }
        Insert: {
          contact_type: Database["public"]["Enums"]["contact_log_type"]
          contractor_id: string
          created_at?: string
          id?: string
          professional_id: string
        }
        Update: {
          contact_type?: Database["public"]["Enums"]["contact_log_type"]
          contractor_id?: string
          created_at?: string
          id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_logs_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reported_by_user_id: string
          reported_item_id: string
          reported_item_type: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reported_by_user_id: string
          reported_item_id: string
          reported_item_type: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reported_by_user_id?: string
          reported_item_id?: string
          reported_item_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_profiles: {
        Row: {
          created_at: string
          id: string
          last_service_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_service_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_service_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cpf_validations: {
        Row: {
          id: string
          jusbrasil_response: Json | null
          professional_id: string
          reason_if_rejected: string | null
          serpro_response: Json | null
          status: Database["public"]["Enums"]["verification_status"]
          validation_date: string
        }
        Insert: {
          id?: string
          jusbrasil_response?: Json | null
          professional_id: string
          reason_if_rejected?: string | null
          serpro_response?: Json | null
          status: Database["public"]["Enums"]["verification_status"]
          validation_date?: string
        }
        Update: {
          id?: string
          jusbrasil_response?: Json | null
          professional_id?: string
          reason_if_rejected?: string | null
          serpro_response?: Json | null
          status?: Database["public"]["Enums"]["verification_status"]
          validation_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cpf_validations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_photos: {
        Row: {
          cloudinary_id: string
          cloudinary_url: string
          evaluation_id: string
          id: string
          uploaded_at: string
        }
        Insert: {
          cloudinary_id: string
          cloudinary_url: string
          evaluation_id: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          cloudinary_id?: string
          cloudinary_url?: string
          evaluation_id?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_photos_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_responses: {
        Row: {
          created_at: string
          evaluation_id: string
          id: string
          professional_id: string
          response_text: string
        }
        Insert: {
          created_at?: string
          evaluation_id: string
          id?: string
          professional_id: string
          response_text: string
        }
        Update: {
          created_at?: string
          evaluation_id?: string
          id?: string
          professional_id?: string
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_responses_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: true
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_responses_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          comment: string | null
          contractor_id: string
          created_at: string
          dispute_status: string | null
          id: string
          is_disputed: boolean
          professional_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          contractor_id: string
          created_at?: string
          dispute_status?: string | null
          id?: string
          is_disputed?: boolean
          professional_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          contractor_id?: string
          created_at?: string
          dispute_status?: string | null
          id?: string
          is_disputed?: boolean
          professional_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          mercadopago_payment_id: string | null
          professional_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          mercadopago_payment_id?: string | null
          professional_id: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          mercadopago_payment_id?: string | null
          professional_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_images: {
        Row: {
          cloudinary_id: string
          cloudinary_url: string
          id: string
          moderation_notes: string | null
          order_in_project: number
          project_id: string
          status: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at: string
        }
        Insert: {
          cloudinary_id: string
          cloudinary_url: string
          id?: string
          moderation_notes?: string | null
          order_in_project?: number
          project_id: string
          status?: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at?: string
        }
        Update: {
          cloudinary_id?: string
          cloudinary_url?: string
          id?: string
          moderation_notes?: string | null
          order_in_project?: number
          project_id?: string
          status?: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          city_executed: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_featured: boolean
          professional_id: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category: string
          city_executed?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          professional_id: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string
          city_executed?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean
          professional_id?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_videos: {
        Row: {
          cloudinary_id: string
          cloudinary_url: string
          duration_seconds: number | null
          id: string
          manual_review_date: string | null
          moderation_notes: string | null
          order_in_project: number
          project_id: string
          status: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at: string
        }
        Insert: {
          cloudinary_id: string
          cloudinary_url: string
          duration_seconds?: number | null
          id?: string
          manual_review_date?: string | null
          moderation_notes?: string | null
          order_in_project?: number
          project_id: string
          status?: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at?: string
        }
        Update: {
          cloudinary_id?: string
          cloudinary_url?: string
          duration_seconds?: number | null
          id?: string
          manual_review_date?: string | null
          moderation_notes?: string | null
          order_in_project?: number
          project_id?: string
          status?: Database["public"]["Enums"]["media_moderation_status"]
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_videos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_affinities: {
        Row: {
          id: string
          professional_id: string
          tag: string
        }
        Insert: {
          id?: string
          professional_id: string
          tag: string
        }
        Update: {
          id?: string
          professional_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_affinities_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_contact_channels: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          link_formatted: string | null
          professional_id: string
          type: Database["public"]["Enums"]["contact_channel_type"]
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          link_formatted?: string | null
          professional_id: string
          type: Database["public"]["Enums"]["contact_channel_type"]
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          link_formatted?: string | null
          professional_id?: string
          type?: Database["public"]["Enums"]["contact_channel_type"]
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_contact_channels_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_infractions: {
        Row: {
          consequence:
            | Database["public"]["Enums"]["infraction_consequence"]
            | null
          count_total: number
          created_at: string
          id: string
          infraction_type: string
          notes: string | null
          professional_id: string
        }
        Insert: {
          consequence?:
            | Database["public"]["Enums"]["infraction_consequence"]
            | null
          count_total?: number
          created_at?: string
          id?: string
          infraction_type: string
          notes?: string | null
          professional_id: string
        }
        Update: {
          consequence?:
            | Database["public"]["Enums"]["infraction_consequence"]
            | null
          count_total?: number
          created_at?: string
          id?: string
          infraction_type?: string
          notes?: string | null
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_infractions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_metrics: {
        Row: {
          average_rating: number
          contacts_received: number
          id: string
          professional_id: string
          profile_views: number
          total_completed_services_via_prumo: number
          total_evaluations: number
          updated_at: string
        }
        Insert: {
          average_rating?: number
          contacts_received?: number
          id?: string
          professional_id: string
          profile_views?: number
          total_completed_services_via_prumo?: number
          total_evaluations?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number
          contacts_received?: number
          id?: string
          professional_id?: string
          profile_views?: number
          total_completed_services_via_prumo?: number
          total_evaluations?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_metrics_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: true
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profiles: {
        Row: {
          city: string | null
          cnpj: string | null
          cpf: string | null
          created_at: string
          id: string
          mercadopago_customer_id: string | null
          onboarding_completed_at: string | null
          personal_description: string | null
          photo_url: string | null
          price_currency: string | null
          price_per_day: number | null
          price_per_hour: number | null
          price_per_month: number | null
          price_per_service: number | null
          service_radius_km: number | null
          slug: string
          state: string | null
          status: Database["public"]["Enums"]["professional_status"]
          subscription_paid_until: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          mercadopago_customer_id?: string | null
          onboarding_completed_at?: string | null
          personal_description?: string | null
          photo_url?: string | null
          price_currency?: string | null
          price_per_day?: number | null
          price_per_hour?: number | null
          price_per_month?: number | null
          price_per_service?: number | null
          service_radius_km?: number | null
          slug: string
          state?: string | null
          status?: Database["public"]["Enums"]["professional_status"]
          subscription_paid_until?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          mercadopago_customer_id?: string | null
          onboarding_completed_at?: string | null
          personal_description?: string | null
          photo_url?: string | null
          price_currency?: string | null
          price_per_day?: number | null
          price_per_hour?: number | null
          price_per_month?: number | null
          price_per_service?: number | null
          service_radius_km?: number | null
          slug?: string
          state?: string | null
          status?: Database["public"]["Enums"]["professional_status"]
          subscription_paid_until?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_social_networks: {
        Row: {
          handle_or_url: string
          id: string
          platform: Database["public"]["Enums"]["social_network_type"]
          professional_id: string
        }
        Insert: {
          handle_or_url: string
          id?: string
          platform: Database["public"]["Enums"]["social_network_type"]
          professional_id: string
        }
        Update: {
          handle_or_url?: string
          id?: string
          platform?: Database["public"]["Enums"]["social_network_type"]
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_social_networks_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_specialties: {
        Row: {
          category: string
          created_at: string
          id: string
          professional_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          professional_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_specialties_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          id: string
          mercadopago_plan_id: string | null
          mercadopago_subscription_id: string | null
          plan: string
          professional_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          mercadopago_plan_id?: string | null
          mercadopago_subscription_id?: string | null
          plan?: string
          professional_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          mercadopago_plan_id?: string | null
          mercadopago_subscription_id?: string | null
          plan?: string
          professional_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_subscriptions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_activity_logs: {
        Row: {
          contractor_id: string
          created_at: string
          event_type: string
          id: string
          professional_id: string
        }
        Insert: {
          contractor_id: string
          created_at?: string
          event_type: string
          id?: string
          professional_id: string
        }
        Update: {
          contractor_id?: string
          created_at?: string
          event_type?: string
          id?: string
          professional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_activity_logs_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          approach_description: string
          budget_request_id: string
          created_at: string
          deadline_days: number
          id: string
          payment_stages: number
          professional_id: string
          status: string
          total_value: number
        }
        Insert: {
          approach_description: string
          budget_request_id: string
          created_at?: string
          deadline_days: number
          id?: string
          payment_stages?: number
          professional_id: string
          status?: string
          total_value: number
        }
        Update: {
          approach_description?: string
          budget_request_id?: string
          created_at?: string
          deadline_days?: number
          id?: string
          payment_stages?: number
          professional_id?: string
          status?: string
          total_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposals_budget_request_id_fkey"
            columns: ["budget_request_id"]
            isOneToOne: false
            referencedRelation: "budget_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_photos: {
        Row: {
          added_to_portfolio: boolean
          cloudinary_id: string
          cloudinary_url: string
          id: string
          service_id: string
          uploaded_at: string
        }
        Insert: {
          added_to_portfolio?: boolean
          cloudinary_id: string
          cloudinary_url: string
          id?: string
          service_id: string
          uploaded_at?: string
        }
        Update: {
          added_to_portfolio?: boolean
          cloudinary_id?: string
          cloudinary_url?: string
          id?: string
          service_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_photos_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "completed_services"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_badges: {
        Row: {
          awarded_date: string
          id: string
          professional_id: string
          type: Database["public"]["Enums"]["badge_type"]
        }
        Insert: {
          awarded_date?: string
          id?: string
          professional_id: string
          type: Database["public"]["Enums"]["badge_type"]
        }
        Update: {
          awarded_date?: string
          id?: string
          professional_id?: string
          type?: Database["public"]["Enums"]["badge_type"]
        }
        Relationships: [
          {
            foreignKeyName: "verification_badges_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      badge_type: "VERIFIED" | "TRUSTWORTHY" | "CERTIFIED"
      budget_request_status: "NEW" | "REPLIED" | "IN_NEGOTIATION" | "REFUSED"
      contact_channel_type:
        | "WHATSAPP"
        | "PHONE"
        | "EMAIL"
        | "INSTAGRAM"
        | "FACEBOOK"
        | "SITE"
        | "OTHER"
      contact_log_type: "VIEWED_WHATSAPP" | "VIEWED_PHONE" | "VIEWED_EMAIL"
      infraction_consequence: "MANUAL_REVIEW_REQUIRED" | "SUSPENDED" | "BANNED"
      media_moderation_status: "PENDING" | "APPROVED" | "REJECTED"
      professional_status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED"
      service_origin: "PRUMO" | "REFERRAL" | "OTHER"
      service_status: "IN_PROGRESS" | "COMPLETED"
      social_network_type:
        | "INSTAGRAM"
        | "FACEBOOK"
        | "TIKTOK"
        | "LINKEDIN"
        | "YOUTUBE"
      subscription_status: "TRIAL" | "ACTIVE" | "CANCELLED" | "SUSPENDED"
      verification_status: "APPROVED" | "REJECTED"
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
      badge_type: ["VERIFIED", "TRUSTWORTHY", "CERTIFIED"],
      budget_request_status: ["NEW", "REPLIED", "IN_NEGOTIATION", "REFUSED"],
      contact_channel_type: [
        "WHATSAPP",
        "PHONE",
        "EMAIL",
        "INSTAGRAM",
        "FACEBOOK",
        "SITE",
        "OTHER",
      ],
      contact_log_type: ["VIEWED_WHATSAPP", "VIEWED_PHONE", "VIEWED_EMAIL"],
      infraction_consequence: ["MANUAL_REVIEW_REQUIRED", "SUSPENDED", "BANNED"],
      media_moderation_status: ["PENDING", "APPROVED", "REJECTED"],
      professional_status: ["PENDING", "ACTIVE", "SUSPENDED", "BANNED"],
      service_origin: ["PRUMO", "REFERRAL", "OTHER"],
      service_status: ["IN_PROGRESS", "COMPLETED"],
      social_network_type: [
        "INSTAGRAM",
        "FACEBOOK",
        "TIKTOK",
        "LINKEDIN",
        "YOUTUBE",
      ],
      subscription_status: ["TRIAL", "ACTIVE", "CANCELLED", "SUSPENDED"],
      verification_status: ["APPROVED", "REJECTED"],
    },
  },
} as const

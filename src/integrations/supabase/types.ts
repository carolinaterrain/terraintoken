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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ab_test_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          session_id: string
          test_id: string | null
          variant: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          session_id: string
          test_id?: string | null
          variant: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          session_id?: string
          test_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          session_id: string
          test_id: string | null
          variant: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          session_id: string
          test_id?: string | null
          variant: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string
          test_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_events_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          traffic_split: Json | null
          updated_at: string | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          traffic_split?: Json | null
          updated_at?: string | null
          variants: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          traffic_split?: Json | null
          updated_at?: string | null
          variants?: Json
        }
        Relationships: []
      }
      achievement_definitions: {
        Row: {
          description: string
          icon: string
          id: string
          name: string
          rarity: string | null
          requirement_type: string
          requirement_value: number
          trn_reward: number
        }
        Insert: {
          description: string
          icon: string
          id: string
          name: string
          rarity?: string | null
          requirement_type: string
          requirement_value: number
          trn_reward?: number
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: string | null
          requirement_type?: string
          requirement_value?: number
          trn_reward?: number
        }
        Relationships: []
      }
      activity_notifications: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          user_identifier: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          user_identifier: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          user_identifier?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          event_properties: Json | null
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          event_properties?: Json | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          event_properties?: Json | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      contest_entries: {
        Row: {
          contest_category: string
          contest_week: string
          created_at: string | null
          goblin_endorsed: boolean | null
          id: string
          media_id: string | null
          prize_won: number | null
          user_wallet_address: string
          votes: number | null
        }
        Insert: {
          contest_category: string
          contest_week: string
          created_at?: string | null
          goblin_endorsed?: boolean | null
          id?: string
          media_id?: string | null
          prize_won?: number | null
          user_wallet_address: string
          votes?: number | null
        }
        Update: {
          contest_category?: string
          contest_week?: string
          created_at?: string | null
          goblin_endorsed?: boolean | null
          id?: string
          media_id?: string | null
          prize_won?: number | null
          user_wallet_address?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contest_entries_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "project_media"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_quests: {
        Row: {
          active: boolean | null
          description: string
          id: string
          quest_date: string
          quest_type: string
          target_count: number | null
          trn_reward: number
        }
        Insert: {
          active?: boolean | null
          description: string
          id?: string
          quest_date: string
          quest_type: string
          target_count?: number | null
          trn_reward: number
        }
        Update: {
          active?: boolean | null
          description?: string
          id?: string
          quest_date?: string
          quest_type?: string
          target_count?: number | null
          trn_reward?: number
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          created_at: string | null
          id: string
          marketing: boolean | null
          trn_rewards: boolean | null
          updated_at: string | null
          user_email: string
          waitlist_updates: boolean | null
          weekly_digest: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          marketing?: boolean | null
          trn_rewards?: boolean | null
          updated_at?: string | null
          user_email: string
          waitlist_updates?: boolean | null
          weekly_digest?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          marketing?: boolean | null
          trn_rewards?: boolean | null
          updated_at?: string | null
          user_email?: string
          waitlist_updates?: boolean | null
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      funnel_events: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          metadata: Json | null
          session_id: string
          step_name: string
          step_order: number
          time_spent_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id: string
          step_name: string
          step_order: number
          time_spent_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          step_name?: string
          step_order?: number
          time_spent_seconds?: number | null
        }
        Relationships: []
      }
      heat_map_events: {
        Row: {
          created_at: string
          element_class: string | null
          element_id: string | null
          event_type: string
          id: string
          page_url: string
          session_id: string
          viewport_height: number | null
          viewport_width: number | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_type: string
          id?: string
          page_url: string
          session_id: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string
          element_class?: string | null
          element_id?: string | null
          event_type?: string
          id?: string
          page_url?: string
          session_id?: string
          viewport_height?: number | null
          viewport_width?: number | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: []
      }
      invoice_codes: {
        Row: {
          code: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          expires_at: string
          id: string
          invoice_amount: number | null
          invoice_number: string
          redeemed_at: string | null
          redeemed_by_wallet: string | null
          status: string
          trn_reward: number
        }
        Insert: {
          code: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          expires_at?: string
          id?: string
          invoice_amount?: number | null
          invoice_number: string
          redeemed_at?: string | null
          redeemed_by_wallet?: string | null
          status?: string
          trn_reward?: number
        }
        Update: {
          code?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          expires_at?: string
          id?: string
          invoice_amount?: number | null
          invoice_number?: string
          redeemed_at?: string | null
          redeemed_by_wallet?: string | null
          status?: string
          trn_reward?: number
        }
        Relationships: []
      }
      meme_submissions: {
        Row: {
          caption: string | null
          contest_date: string | null
          created_at: string | null
          email: string | null
          engagement_score: number | null
          id: string
          image_url: string
          placement: number | null
          prize: string | null
          status: string | null
          x_handle: string | null
          x_post_url: string | null
        }
        Insert: {
          caption?: string | null
          contest_date?: string | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          id?: string
          image_url: string
          placement?: number | null
          prize?: string | null
          status?: string | null
          x_handle?: string | null
          x_post_url?: string | null
        }
        Update: {
          caption?: string | null
          contest_date?: string | null
          created_at?: string | null
          email?: string | null
          engagement_score?: number | null
          id?: string
          image_url?: string
          placement?: number | null
          prize?: string | null
          status?: string | null
          x_handle?: string | null
          x_post_url?: string | null
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          completed_steps: number[] | null
          current_step: number | null
          id: string
          session_id: string
          started_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          session_id: string
          started_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          session_id?: string
          started_at?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          ai_validation_score: number | null
          category: string
          created_at: string | null
          data_consent: boolean | null
          description: string | null
          goblin_grade: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          location: string | null
          shared_on_social: boolean | null
          sort_order: number | null
          title: string | null
          trn_earned: number | null
          user_wallet_address: string | null
          validation_status: string | null
        }
        Insert: {
          ai_validation_score?: number | null
          category: string
          created_at?: string | null
          data_consent?: boolean | null
          description?: string | null
          goblin_grade?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          location?: string | null
          shared_on_social?: boolean | null
          sort_order?: number | null
          title?: string | null
          trn_earned?: number | null
          user_wallet_address?: string | null
          validation_status?: string | null
        }
        Update: {
          ai_validation_score?: number | null
          category?: string
          created_at?: string | null
          data_consent?: boolean | null
          description?: string | null
          goblin_grade?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          location?: string | null
          shared_on_social?: boolean | null
          sort_order?: number | null
          title?: string | null
          trn_earned?: number | null
          user_wallet_address?: string | null
          validation_status?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          last_used: string | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys: Json
          last_used?: string | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          last_used?: string | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      rate_limit_tracker: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      referral_tracking: {
        Row: {
          conversion_value: number | null
          converted: boolean | null
          id: string
          metadata: Json | null
          referred_at: string
          referred_email: string
          referrer_code: string
        }
        Insert: {
          conversion_value?: number | null
          converted?: boolean | null
          id?: string
          metadata?: Json | null
          referred_at?: string
          referred_email: string
          referrer_code: string
        }
        Update: {
          conversion_value?: number | null
          converted?: boolean | null
          id?: string
          metadata?: Json | null
          referred_at?: string
          referred_email?: string
          referrer_code?: string
        }
        Relationships: []
      }
      terrainscape_waitlist: {
        Row: {
          beta_application: string | null
          created_at: string | null
          email: string
          id: string
          invited_at: string | null
          is_trn_holder: boolean | null
          metadata: Json | null
          priority_score: number | null
          referral_code: string
          referred_by: string | null
          signup_source: string | null
          status: string | null
          trn_balance: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_source: string | null
          wallet_address: string | null
        }
        Insert: {
          beta_application?: string | null
          created_at?: string | null
          email: string
          id?: string
          invited_at?: string | null
          is_trn_holder?: boolean | null
          metadata?: Json | null
          priority_score?: number | null
          referral_code: string
          referred_by?: string | null
          signup_source?: string | null
          status?: string | null
          trn_balance?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          wallet_address?: string | null
        }
        Update: {
          beta_application?: string | null
          created_at?: string | null
          email?: string
          id?: string
          invited_at?: string | null
          is_trn_holder?: boolean | null
          metadata?: Json | null
          priority_score?: number | null
          referral_code?: string
          referred_by?: string | null
          signup_source?: string | null
          status?: string | null
          trn_balance?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terrainscape_waitlist_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "terrainscape_waitlist"
            referencedColumns: ["referral_code"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          created_at: string | null
          google_review_url: string | null
          id: string
          is_featured: boolean | null
          location: string | null
          rating: number
          review_date: string | null
          review_text: string
          sort_order: number | null
        }
        Insert: {
          author_name: string
          created_at?: string | null
          google_review_url?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          rating: number
          review_date?: string | null
          review_text: string
          sort_order?: number | null
        }
        Update: {
          author_name?: string
          created_at?: string | null
          google_review_url?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          rating?: number
          review_date?: string | null
          review_text?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      trn_redemptions: {
        Row: {
          admin_notes: string | null
          completed_at: string | null
          created_at: string
          discount_usd: number
          email: string
          id: string
          notes: string | null
          phone: string | null
          preferred_contact: string | null
          service_type: string | null
          status: string
          tier: string
          trn_amount: number
          updated_at: string
          wallet_address: string
        }
        Insert: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          discount_usd: number
          email: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          service_type?: string | null
          status?: string
          tier: string
          trn_amount: number
          updated_at?: string
          wallet_address: string
        }
        Update: {
          admin_notes?: string | null
          completed_at?: string | null
          created_at?: string
          discount_usd?: number
          email?: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          service_type?: string | null
          status?: string
          tier?: string
          trn_amount?: number
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      trn_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          id: string
          media_id: string | null
          reward_metadata: Json | null
          reward_type: string
          transaction_status: string | null
          trn_amount: number
          user_wallet_address: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          media_id?: string | null
          reward_metadata?: Json | null
          reward_type: string
          transaction_status?: string | null
          trn_amount: number
          user_wallet_address: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          media_id?: string | null
          reward_metadata?: Json | null
          reward_type?: string
          transaction_status?: string | null
          trn_amount?: number
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "trn_rewards_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "project_media"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          trn_bonus: number
          user_wallet_address: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          trn_bonus: number
          user_wallet_address: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          trn_bonus?: number
          user_wallet_address?: string
        }
        Relationships: []
      }
      user_quest_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          progress: number | null
          quest_id: string | null
          user_wallet_address: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          quest_id?: string | null
          user_wallet_address: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          progress?: number | null
          quest_id?: string | null
          user_wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          last_upload_date: string | null
          reputation_score: number | null
          streak_days: number | null
          total_shares: number | null
          total_trn_earned: number | null
          total_uploads: number | null
          total_validations: number | null
          updated_at: string | null
          user_wallet_address: string
        }
        Insert: {
          created_at?: string | null
          last_upload_date?: string | null
          reputation_score?: number | null
          streak_days?: number | null
          total_shares?: number | null
          total_trn_earned?: number | null
          total_uploads?: number | null
          total_validations?: number | null
          updated_at?: string | null
          user_wallet_address: string
        }
        Update: {
          created_at?: string | null
          last_upload_date?: string | null
          reputation_score?: number | null
          streak_days?: number | null
          total_shares?: number | null
          total_trn_earned?: number | null
          total_uploads?: number | null
          total_validations?: number | null
          updated_at?: string | null
          user_wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      terrain_contributors_leaderboard: {
        Row: {
          badges_earned: number | null
          rank: number | null
          reputation_score: number | null
          streak_days: number | null
          total_trn_earned: number | null
          total_uploads: number | null
          total_validations: number | null
          user_wallet_address: string | null
        }
        Relationships: []
      }
      weekly_contributors: {
        Row: {
          user_wallet_address: string | null
          weekly_rank: number | null
          weekly_trn_earned: number | null
          weekly_uploads: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_rate_limits: { Args: never; Returns: undefined }
      expire_old_invoice_codes: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

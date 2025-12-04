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
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
          user_wallet: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
          user_wallet?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
          user_wallet?: string | null
        }
        Relationships: []
      }
      collector_drop_purchases: {
        Row: {
          buyer_email: string | null
          buyer_wallet: string
          certificate_id: string
          created_at: string
          drop_id: string
          id: string
          item_type: string | null
          nft_transfer_signature: string | null
          nft_transfer_status: string
          order_status: string
          shipping_address: Json | null
          shopify_order_id: string | null
          updated_at: string
        }
        Insert: {
          buyer_email?: string | null
          buyer_wallet: string
          certificate_id: string
          created_at?: string
          drop_id: string
          id?: string
          item_type?: string | null
          nft_transfer_signature?: string | null
          nft_transfer_status?: string
          order_status?: string
          shipping_address?: Json | null
          shopify_order_id?: string | null
          updated_at?: string
        }
        Update: {
          buyer_email?: string | null
          buyer_wallet?: string
          certificate_id?: string
          created_at?: string
          drop_id?: string
          id?: string
          item_type?: string | null
          nft_transfer_signature?: string | null
          nft_transfer_status?: string
          order_status?: string
          shipping_address?: Json | null
          shopify_order_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collector_drop_purchases_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "collector_nft_certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collector_drop_purchases_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "collector_drops"
            referencedColumns: ["id"]
          },
        ]
      }
      collector_drops: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          nft_image_url: string | null
          price_usd: number
          shopify_product_id: string | null
          status: string
          symbol: string
          total_supply: number
          treasury_wallet: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          nft_image_url?: string | null
          price_usd: number
          shopify_product_id?: string | null
          status?: string
          symbol: string
          total_supply: number
          treasury_wallet?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          nft_image_url?: string | null
          price_usd?: number
          shopify_product_id?: string | null
          status?: string
          symbol?: string
          total_supply?: number
          treasury_wallet?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      collector_nft_certificates: {
        Row: {
          claimed_at: string | null
          claimed_by_wallet: string | null
          created_at: string
          drop_id: string
          id: string
          item_type: string | null
          metadata_uri: string | null
          mint_address: string | null
          reserved_at: string | null
          reserved_by_session: string | null
          serial_number: number
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_wallet?: string | null
          created_at?: string
          drop_id: string
          id?: string
          item_type?: string | null
          metadata_uri?: string | null
          mint_address?: string | null
          reserved_at?: string | null
          reserved_by_session?: string | null
          serial_number: number
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by_wallet?: string | null
          created_at?: string
          drop_id?: string
          id?: string
          item_type?: string | null
          metadata_uri?: string | null
          mint_address?: string | null
          reserved_at?: string | null
          reserved_by_session?: string | null
          serial_number?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collector_nft_certificates_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "collector_drops"
            referencedColumns: ["id"]
          },
        ]
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
      contest_stakes: {
        Row: {
          burn_amount: number | null
          contest_id: string | null
          contest_type: string
          created_at: string
          entry_fee: number
          id: string
          placement: number | null
          prize_won: number | null
          user_wallet: string
        }
        Insert: {
          burn_amount?: number | null
          contest_id?: string | null
          contest_type: string
          created_at?: string
          entry_fee: number
          id?: string
          placement?: number | null
          prize_won?: number | null
          user_wallet: string
        }
        Update: {
          burn_amount?: number | null
          contest_id?: string | null
          contest_type?: string
          created_at?: string
          entry_fee?: number
          id?: string
          placement?: number | null
          prize_won?: number | null
          user_wallet?: string
        }
        Relationships: []
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
      energy_balances: {
        Row: {
          created_at: string
          energy_balance: number
          last_refill: string
          max_energy: number
          total_energy_purchased: number
          trn_spent_on_energy: number
          updated_at: string
          user_wallet: string
        }
        Insert: {
          created_at?: string
          energy_balance?: number
          last_refill?: string
          max_energy?: number
          total_energy_purchased?: number
          trn_spent_on_energy?: number
          updated_at?: string
          user_wallet: string
        }
        Update: {
          created_at?: string
          energy_balance?: number
          last_refill?: string
          max_energy?: number
          total_energy_purchased?: number
          trn_spent_on_energy?: number
          updated_at?: string
          user_wallet?: string
        }
        Relationships: []
      }
      energy_purchases: {
        Row: {
          created_at: string
          energy_amount: number
          id: string
          package_type: string
          transaction_signature: string | null
          trn_burned: number
          trn_cost: number
          user_wallet: string
        }
        Insert: {
          created_at?: string
          energy_amount: number
          id?: string
          package_type: string
          transaction_signature?: string | null
          trn_burned: number
          trn_cost: number
          user_wallet: string
        }
        Update: {
          created_at?: string
          energy_amount?: number
          id?: string
          package_type?: string
          transaction_signature?: string | null
          trn_burned?: number
          trn_cost?: number
          user_wallet?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_fingerprint: string | null
          error_message: string
          id: string
          metadata: Json | null
          page_url: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          session_id: string | null
          severity: string | null
          stack_trace: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_fingerprint?: string | null
          error_message: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_fingerprint?: string | null
          error_message?: string
          id?: string
          metadata?: Json | null
          page_url?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_agent?: string | null
          user_id?: string | null
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
      gamification_purchases: {
        Row: {
          created_at: string
          effect_data: Json | null
          expires_at: string | null
          id: string
          item_name: string
          item_type: string
          transaction_signature: string | null
          trn_burned: number
          trn_cost: number
          user_wallet: string
        }
        Insert: {
          created_at?: string
          effect_data?: Json | null
          expires_at?: string | null
          id?: string
          item_name: string
          item_type: string
          transaction_signature?: string | null
          trn_burned: number
          trn_cost: number
          user_wallet: string
        }
        Update: {
          created_at?: string
          effect_data?: Json | null
          expires_at?: string | null
          id?: string
          item_name?: string
          item_type?: string
          transaction_signature?: string | null
          trn_burned?: number
          trn_cost?: number
          user_wallet?: string
        }
        Relationships: []
      }
      governance_proposals: {
        Row: {
          category: string
          created_at: string
          created_by_wallet: string
          description: string
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          total_voting_power: number
          updated_at: string
          votes_against: number
          votes_for: number
        }
        Insert: {
          category: string
          created_at?: string
          created_by_wallet: string
          description: string
          end_date: string
          id?: string
          start_date?: string
          status?: string
          title: string
          total_voting_power?: number
          updated_at?: string
          votes_against?: number
          votes_for?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by_wallet?: string
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          total_voting_power?: number
          updated_at?: string
          votes_against?: number
          votes_for?: number
        }
        Relationships: []
      }
      governance_votes: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          vote_choice: string
          voter_wallet: string
          voting_power: number
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          vote_choice: string
          voter_wallet: string
          voting_power: number
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          vote_choice?: string
          voter_wallet?: string
          voting_power?: number
        }
        Relationships: [
          {
            foreignKeyName: "governance_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "governance_proposals"
            referencedColumns: ["id"]
          },
        ]
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
      holder_count_cache: {
        Row: {
          holder_count: number
          id: string
          last_updated: string
          source: string | null
        }
        Insert: {
          holder_count?: number
          id?: string
          last_updated?: string
          source?: string | null
        }
        Update: {
          holder_count?: number
          id?: string
          last_updated?: string
          source?: string | null
        }
        Relationships: []
      }
      holder_snapshots: {
        Row: {
          created_at: string | null
          holder_addresses: Json
          holder_balances: Json
          id: string
          is_live_data: boolean | null
          snapshot_date: string
          total_holders: number
        }
        Insert: {
          created_at?: string | null
          holder_addresses: Json
          holder_balances: Json
          id?: string
          is_live_data?: boolean | null
          snapshot_date: string
          total_holders: number
        }
        Update: {
          created_at?: string | null
          holder_addresses?: Json
          holder_balances?: Json
          id?: string
          is_live_data?: boolean | null
          snapshot_date?: string
          total_holders?: number
        }
        Relationships: []
      }
      investor_interests: {
        Row: {
          additional_notes: string | null
          contacted_at: string | null
          created_at: string | null
          discord_handle: string | null
          email: string
          id: string
          investment_range: string
          investment_tier: string | null
          is_accredited: boolean | null
          name: string
          nda_accepted: boolean | null
          reason: string[] | null
          status: string | null
          utm_campaign: string | null
          utm_source: string | null
          wallet_address: string | null
        }
        Insert: {
          additional_notes?: string | null
          contacted_at?: string | null
          created_at?: string | null
          discord_handle?: string | null
          email: string
          id?: string
          investment_range: string
          investment_tier?: string | null
          is_accredited?: boolean | null
          name: string
          nda_accepted?: boolean | null
          reason?: string[] | null
          status?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          wallet_address?: string | null
        }
        Update: {
          additional_notes?: string | null
          contacted_at?: string | null
          created_at?: string | null
          discord_handle?: string | null
          email?: string
          id?: string
          investment_range?: string
          investment_tier?: string | null
          is_accredited?: boolean | null
          name?: string
          nda_accepted?: boolean | null
          reason?: string[] | null
          status?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      live_viewers: {
        Row: {
          created_at: string | null
          id: string
          last_ping: string | null
          page_path: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_ping?: string | null
          page_path: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_ping?: string | null
          page_path?: string
          session_id?: string
        }
        Relationships: []
      }
      market_achievements: {
        Row: {
          achievement_id: string
          id: string
          metadata: Json | null
          unlocked_at: string | null
          user_wallet: string
        }
        Insert: {
          achievement_id: string
          id?: string
          metadata?: Json | null
          unlocked_at?: string | null
          user_wallet: string
        }
        Update: {
          achievement_id?: string
          id?: string
          metadata?: Json | null
          unlocked_at?: string | null
          user_wallet?: string
        }
        Relationships: []
      }
      market_chat: {
        Row: {
          created_at: string | null
          id: string
          message: string
          user_wallet: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          user_wallet: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          user_wallet?: string
          username?: string | null
        }
        Relationships: []
      }
      market_predictions: {
        Row: {
          actual_price: number | null
          created_at: string | null
          current_price: number
          id: string
          points_earned: number | null
          points_multiplier: number | null
          predicted_at: string
          prediction_type: string
          resolved_at: string | null
          streak_count: number | null
          target_date: string
          user_wallet: string
          was_correct: boolean | null
        }
        Insert: {
          actual_price?: number | null
          created_at?: string | null
          current_price: number
          id?: string
          points_earned?: number | null
          points_multiplier?: number | null
          predicted_at?: string
          prediction_type: string
          resolved_at?: string | null
          streak_count?: number | null
          target_date: string
          user_wallet: string
          was_correct?: boolean | null
        }
        Update: {
          actual_price?: number | null
          created_at?: string | null
          current_price?: number
          id?: string
          points_earned?: number | null
          points_multiplier?: number | null
          predicted_at?: string
          prediction_type?: string
          resolved_at?: string | null
          streak_count?: number | null
          target_date?: string
          user_wallet?: string
          was_correct?: boolean | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          item_type: string
          metadata: Json | null
          price_trn: number
          rating: number | null
          review_count: number | null
          sales_count: number | null
          seller_wallet: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          item_type: string
          metadata?: Json | null
          price_trn: number
          rating?: number | null
          review_count?: number | null
          sales_count?: number | null
          seller_wallet: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          item_type?: string
          metadata?: Json | null
          price_trn?: number
          rating?: number | null
          review_count?: number | null
          sales_count?: number | null
          seller_wallet?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_transactions: {
        Row: {
          buyer_wallet: string
          created_at: string
          fee_burned: number
          id: string
          item_id: string | null
          platform_fee: number
          price_paid: number
          seller_payout: number
          seller_wallet: string
          transaction_signature: string | null
        }
        Insert: {
          buyer_wallet: string
          created_at?: string
          fee_burned: number
          id?: string
          item_id?: string | null
          platform_fee: number
          price_paid: number
          seller_payout: number
          seller_wallet: string
          transaction_signature?: string | null
        }
        Update: {
          buyer_wallet?: string
          created_at?: string
          fee_burned?: number
          id?: string
          item_id?: string | null
          platform_fee?: number
          price_paid?: number
          seller_payout?: number
          seller_wallet?: string
          transaction_signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
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
      mystery_box_opens: {
        Row: {
          box_id: string | null
          created_at: string
          id: string
          reward_data: Json | null
          reward_type: string
          reward_value: number
          trn_paid: number
          user_wallet: string
        }
        Insert: {
          box_id?: string | null
          created_at?: string
          id?: string
          reward_data?: Json | null
          reward_type: string
          reward_value: number
          trn_paid: number
          user_wallet: string
        }
        Update: {
          box_id?: string | null
          created_at?: string
          id?: string
          reward_data?: Json | null
          reward_type?: string
          reward_value?: number
          trn_paid?: number
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "mystery_box_opens_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "mystery_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_boxes: {
        Row: {
          available_count: number | null
          box_tier: string
          created_at: string
          id: string
          is_active: boolean | null
          possible_rewards: Json
          rarity_weights: Json
          trn_cost: number
        }
        Insert: {
          available_count?: number | null
          box_tier: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          possible_rewards: Json
          rarity_weights: Json
          trn_cost: number
        }
        Update: {
          available_count?: number | null
          box_tier?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          possible_rewards?: Json
          rarity_weights?: Json
          trn_cost?: number
        }
        Relationships: []
      }
      nft_achievements: {
        Row: {
          achievement_id: string
          id: string
          metadata: Json | null
          minted_at: string | null
          nft_description: string
          nft_image_url: string
          nft_name: string
          rarity: string
          user_wallet: string
        }
        Insert: {
          achievement_id: string
          id?: string
          metadata?: Json | null
          minted_at?: string | null
          nft_description: string
          nft_image_url: string
          nft_name: string
          rarity?: string
          user_wallet: string
        }
        Update: {
          achievement_id?: string
          id?: string
          metadata?: Json | null
          minted_at?: string | null
          nft_description?: string
          nft_image_url?: string
          nft_name?: string
          rarity?: string
          user_wallet?: string
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
      portfolio_holdings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          purchase_date: string
          purchase_price: number
          quantity: number
          user_wallet: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_price: number
          quantity: number
          user_wallet: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          user_wallet?: string
        }
        Relationships: []
      }
      prediction_challenges: {
        Row: {
          active: boolean | null
          badge_icon: string
          challenge_id: string
          created_at: string | null
          description: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          trn_reward: number | null
        }
        Insert: {
          active?: boolean | null
          badge_icon: string
          challenge_id: string
          created_at?: string | null
          description: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          trn_reward?: number | null
        }
        Update: {
          active?: boolean | null
          badge_icon?: string
          challenge_id?: string
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          trn_reward?: number | null
        }
        Relationships: []
      }
      prediction_stakes: {
        Row: {
          burn_amount: number | null
          created_at: string
          id: string
          payout_amount: number | null
          prediction_id: string | null
          settled_at: string | null
          stake_amount: number
          status: string
          treasury_amount: number | null
          user_wallet: string
        }
        Insert: {
          burn_amount?: number | null
          created_at?: string
          id?: string
          payout_amount?: number | null
          prediction_id?: string | null
          settled_at?: string | null
          stake_amount: number
          status?: string
          treasury_amount?: number | null
          user_wallet: string
        }
        Update: {
          burn_amount?: number | null
          created_at?: string
          id?: string
          payout_amount?: number | null
          prediction_id?: string | null
          settled_at?: string | null
          stake_amount?: number
          status?: string
          treasury_amount?: number | null
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_stakes_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "market_predictions"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_tournaments: {
        Row: {
          created_at: string | null
          description: string
          end_date: string
          id: string
          name: string
          prize_pool: Json
          start_date: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          name: string
          prize_pool: Json
          start_date: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          name?: string
          prize_pool?: Json
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean
          target_price: number
          triggered_at: string | null
          updated_at: string
          user_email: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          target_price: number
          triggered_at?: string | null
          updated_at?: string
          user_email: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          target_price?: number
          triggered_at?: string | null
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_source: string
          is_active: boolean
          metadata: Json | null
          product_type: string
          public_url: string
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_source?: string
          is_active?: boolean
          metadata?: Json | null
          product_type: string
          public_url: string
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_source?: string
          is_active?: boolean
          metadata?: Json | null
          product_type?: string
          public_url?: string
          storage_path?: string | null
          updated_at?: string
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
      purchase_leaderboard: {
        Row: {
          achievements: Json | null
          biggest_purchase_trn: number | null
          consecutive_days: number | null
          created_at: string | null
          fastest_buy_seconds: number | null
          id: string
          is_public: boolean | null
          last_purchase_date: string | null
          total_purchases: number | null
          total_trn_purchased: number | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          achievements?: Json | null
          biggest_purchase_trn?: number | null
          consecutive_days?: number | null
          created_at?: string | null
          fastest_buy_seconds?: number | null
          id?: string
          is_public?: boolean | null
          last_purchase_date?: string | null
          total_purchases?: number | null
          total_trn_purchased?: number | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          achievements?: Json | null
          biggest_purchase_trn?: number | null
          consecutive_days?: number | null
          created_at?: string | null
          fastest_buy_seconds?: number | null
          id?: string
          is_public?: boolean | null
          last_purchase_date?: string | null
          total_purchases?: number | null
          total_trn_purchased?: number | null
          updated_at?: string | null
          wallet_address?: string
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
      referral_codes: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          total_bonus_trn: number | null
          total_referrals: number | null
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          total_bonus_trn?: number | null
          total_referrals?: number | null
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          total_bonus_trn?: number | null
          total_referrals?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
      referral_redemptions: {
        Row: {
          bonus_amount: number
          id: string
          purchase_amount: number
          redeemed_at: string | null
          referee_wallet: string
          referral_code: string
          referrer_wallet: string
        }
        Insert: {
          bonus_amount: number
          id?: string
          purchase_amount: number
          redeemed_at?: string | null
          referee_wallet: string
          referral_code: string
          referrer_wallet: string
        }
        Update: {
          bonus_amount?: number
          id?: string
          purchase_amount?: number
          redeemed_at?: string | null
          referee_wallet?: string
          referral_code?: string
          referrer_wallet?: string
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          approved_at: string | null
          created_at: string | null
          id: string
          paid_at: string | null
          referred_email: string
          referrer_code: string
          reward_type: string
          status: string
          trn_amount: number
          verification_data: Json | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referred_email: string
          referrer_code: string
          reward_type: string
          status?: string
          trn_amount: number
          verification_data?: Json | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          referred_email?: string
          referrer_code?: string
          reward_type?: string
          status?: string
          trn_amount?: number
          verification_data?: Json | null
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
      season_pass_holders: {
        Row: {
          id: string
          pass_id: string | null
          purchased_at: string
          rewards_claimed: Json | null
          tier_level: number | null
          user_wallet: string
          xp_earned: number | null
        }
        Insert: {
          id?: string
          pass_id?: string | null
          purchased_at?: string
          rewards_claimed?: Json | null
          tier_level?: number | null
          user_wallet: string
          xp_earned?: number | null
        }
        Update: {
          id?: string
          pass_id?: string | null
          purchased_at?: string
          rewards_claimed?: Json | null
          tier_level?: number | null
          user_wallet?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "season_pass_holders_pass_id_fkey"
            columns: ["pass_id"]
            isOneToOne: false
            referencedRelation: "season_passes"
            referencedColumns: ["id"]
          },
        ]
      }
      season_passes: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          max_supply: number | null
          rewards_structure: Json
          season_name: string
          season_number: number
          start_date: string
          total_sold: number | null
          trn_cost: number
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          max_supply?: number | null
          rewards_structure: Json
          season_name: string
          season_number: number
          start_date: string
          total_sold?: number | null
          trn_cost: number
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_supply?: number | null
          rewards_structure?: Json
          season_name?: string
          season_number?: number
          start_date?: string
          total_sold?: number | null
          trn_cost?: number
        }
        Relationships: []
      }
      service_redemptions: {
        Row: {
          created_at: string
          discount_code: string
          discount_percent: number
          expires_at: string
          id: string
          invoice_number: string | null
          service_type: string
          service_value_estimate: number | null
          trn_balance_snapshot: number
          trn_required: number
          used: boolean | null
          used_at: string | null
          user_wallet: string
        }
        Insert: {
          created_at?: string
          discount_code: string
          discount_percent: number
          expires_at: string
          id?: string
          invoice_number?: string | null
          service_type: string
          service_value_estimate?: number | null
          trn_balance_snapshot: number
          trn_required: number
          used?: boolean | null
          used_at?: string | null
          user_wallet: string
        }
        Update: {
          created_at?: string
          discount_code?: string
          discount_percent?: number
          expires_at?: string
          id?: string
          invoice_number?: string | null
          service_type?: string
          service_value_estimate?: number | null
          trn_balance_snapshot?: number
          trn_required?: number
          used?: boolean | null
          used_at?: string | null
          user_wallet?: string
        }
        Relationships: []
      }
      staking_positions: {
        Row: {
          amount_staked: number
          created_at: string
          id: string
          pool_id: string
          rewards_earned: number
          staked_at: string
          status: string
          unlock_at: string | null
          updated_at: string
          user_wallet: string
        }
        Insert: {
          amount_staked: number
          created_at?: string
          id?: string
          pool_id: string
          rewards_earned?: number
          staked_at?: string
          status?: string
          unlock_at?: string | null
          updated_at?: string
          user_wallet: string
        }
        Update: {
          amount_staked?: number
          created_at?: string
          id?: string
          pool_id?: string
          rewards_earned?: number
          staked_at?: string
          status?: string
          unlock_at?: string | null
          updated_at?: string
          user_wallet?: string
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount_paid: number
          created_at: string
          id: string
          payment_method: string
          stripe_payment_id: string | null
          subscription_id: string | null
          transaction_signature: string | null
          trn_burned: number | null
          user_wallet: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          id?: string
          payment_method: string
          stripe_payment_id?: string | null
          subscription_id?: string | null
          transaction_signature?: string | null
          trn_burned?: number | null
          user_wallet: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          id?: string
          payment_method?: string
          stripe_payment_id?: string | null
          subscription_id?: string | null
          transaction_signature?: string | null
          trn_burned?: number | null
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      supporter_nfts: {
        Row: {
          buyer_email: string | null
          buyer_wallet: string
          created_at: string
          id: string
          metadata_uri: string | null
          mint_address: string | null
          shopify_order_id: string | null
          shopify_variant_id: string | null
          status: string
        }
        Insert: {
          buyer_email?: string | null
          buyer_wallet: string
          created_at?: string
          id?: string
          metadata_uri?: string | null
          mint_address?: string | null
          shopify_order_id?: string | null
          shopify_variant_id?: string | null
          status?: string
        }
        Update: {
          buyer_email?: string | null
          buyer_wallet?: string
          created_at?: string
          id?: string
          metadata_uri?: string | null
          mint_address?: string | null
          shopify_order_id?: string | null
          shopify_variant_id?: string | null
          status?: string
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
      token_burns: {
        Row: {
          burn_amount: number
          burn_source: string
          created_at: string
          id: string
          metadata: Json | null
          related_transaction_id: string | null
          transaction_signature: string | null
          user_wallet: string | null
        }
        Insert: {
          burn_amount: number
          burn_source: string
          created_at?: string
          id?: string
          metadata?: Json | null
          related_transaction_id?: string | null
          transaction_signature?: string | null
          user_wallet?: string | null
        }
        Update: {
          burn_amount?: number
          burn_source?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          related_transaction_id?: string | null
          transaction_signature?: string | null
          user_wallet?: string | null
        }
        Relationships: []
      }
      tool_usage_proofs: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          proof_type: string
          proof_url: string
          status: string | null
          tool_name: string
          trn_reward: number | null
          verified_at: string | null
          verified_by: string | null
          wallet_address: string
          x_post_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          proof_type: string
          proof_url: string
          status?: string | null
          tool_name: string
          trn_reward?: number | null
          verified_at?: string | null
          verified_by?: string | null
          wallet_address: string
          x_post_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          proof_type?: string
          proof_url?: string
          status?: string | null
          tool_name?: string
          trn_reward?: number | null
          verified_at?: string | null
          verified_by?: string | null
          wallet_address?: string
          x_post_url?: string | null
        }
        Relationships: []
      }
      tournament_entries: {
        Row: {
          accuracy_rate: number | null
          correct_predictions: number | null
          created_at: string | null
          final_rank: number | null
          id: string
          prize_won: number | null
          total_points: number | null
          total_predictions: number | null
          tournament_id: string
          user_wallet: string
        }
        Insert: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string | null
          final_rank?: number | null
          id?: string
          prize_won?: number | null
          total_points?: number | null
          total_predictions?: number | null
          tournament_id: string
          user_wallet: string
        }
        Update: {
          accuracy_rate?: number | null
          correct_predictions?: number | null
          created_at?: string | null
          final_rank?: number | null
          id?: string
          prize_won?: number | null
          total_points?: number | null
          total_predictions?: number | null
          tournament_id?: string
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_entries_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "prediction_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      trn_live_stats: {
        Row: {
          active_users: number
          created_at: string
          current_supply: number
          id: string
          liquidity_usd: number | null
          market_cap_usd: number | null
          max_supply: number
          price_change_24h: number | null
          price_sol: number | null
          price_usd: number | null
          total_burned: number | null
          total_issued: number
          updated_at: string | null
          volume_24h_usd: number | null
        }
        Insert: {
          active_users?: number
          created_at?: string
          current_supply?: number
          id?: string
          liquidity_usd?: number | null
          market_cap_usd?: number | null
          max_supply?: number
          price_change_24h?: number | null
          price_sol?: number | null
          price_usd?: number | null
          total_burned?: number | null
          total_issued?: number
          updated_at?: string | null
          volume_24h_usd?: number | null
        }
        Update: {
          active_users?: number
          created_at?: string
          current_supply?: number
          id?: string
          liquidity_usd?: number | null
          market_cap_usd?: number | null
          max_supply?: number
          price_change_24h?: number | null
          price_sol?: number | null
          price_usd?: number | null
          total_burned?: number | null
          total_issued?: number
          updated_at?: string | null
          volume_24h_usd?: number | null
        }
        Relationships: []
      }
      trn_purchases: {
        Row: {
          amount_sol: number
          amount_trn: number
          created_at: string | null
          id: string
          metadata: Json | null
          purchase_tier: string
          transaction_signature: string | null
          wallet_address: string
        }
        Insert: {
          amount_sol: number
          amount_trn: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          purchase_tier: string
          transaction_signature?: string | null
          wallet_address: string
        }
        Update: {
          amount_sol?: number
          amount_trn?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          purchase_tier?: string
          transaction_signature?: string | null
          wallet_address?: string
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
      trn_rewards_ledger: {
        Row: {
          amount_trn: number
          created_at: string
          id: string
          metadata: Json | null
          reward_type: string
          session_id: string | null
          source_project: string
          source_reward_id: string
          status: string
          synced_at: string
          user_email: string | null
          wallet_address: string | null
        }
        Insert: {
          amount_trn?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reward_type: string
          session_id?: string | null
          source_project: string
          source_reward_id: string
          status?: string
          synced_at?: string
          user_email?: string | null
          wallet_address?: string | null
        }
        Update: {
          amount_trn?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reward_type?: string
          session_id?: string | null
          source_project?: string
          source_reward_id?: string
          status?: string
          synced_at?: string
          user_email?: string | null
          wallet_address?: string | null
        }
        Relationships: []
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
      user_challenge_progress: {
        Row: {
          challenge_id: string
          claimed: boolean | null
          claimed_at: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          progress: number | null
          user_wallet: string
        }
        Insert: {
          challenge_id: string
          claimed?: boolean | null
          claimed_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_wallet: string
        }
        Update: {
          challenge_id?: string
          claimed?: boolean | null
          claimed_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          user_wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "prediction_challenges"
            referencedColumns: ["challenge_id"]
          },
        ]
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
          current_streak: number | null
          last_upload_date: string | null
          longest_streak: number | null
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
          current_streak?: number | null
          last_upload_date?: string | null
          longest_streak?: number | null
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
          current_streak?: number | null
          last_upload_date?: string | null
          longest_streak?: number | null
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
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          discount_applied: number | null
          expires_at: string | null
          id: string
          payment_method: string | null
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          trn_staked: number | null
          updated_at: string
          user_wallet: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          discount_applied?: number | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier: string
          trn_staked?: number | null
          updated_at?: string
          user_wallet: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          discount_applied?: number | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          trn_staked?: number | null
          updated_at?: string
          user_wallet?: string
        }
        Relationships: []
      }
      wallet_connections: {
        Row: {
          connection_count: number | null
          first_connected_at: string | null
          id: string
          last_seen_at: string | null
          wallet_address: string
        }
        Insert: {
          connection_count?: number | null
          first_connected_at?: string | null
          id?: string
          last_seen_at?: string | null
          wallet_address: string
        }
        Update: {
          connection_count?: number | null
          first_connected_at?: string | null
          id?: string
          last_seen_at?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      whale_alerts: {
        Row: {
          alert_type: string
          amount_trn: number
          created_at: string | null
          id: string
          metadata: Json | null
          transaction_signature: string | null
          wallet_address: string
        }
        Insert: {
          alert_type: string
          amount_trn: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          transaction_signature?: string | null
          wallet_address: string
        }
        Update: {
          alert_type?: string
          amount_trn?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          transaction_signature?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      prediction_leaderboard: {
        Row: {
          accuracy_percentage: number | null
          active_days: number | null
          best_streak: number | null
          correct_predictions: number | null
          first_prediction: string | null
          highest_multiplier: number | null
          incorrect_predictions: number | null
          last_prediction: string | null
          rank: number | null
          total_points: number | null
          total_predictions: number | null
          user_wallet: string | null
        }
        Relationships: []
      }
      prediction_user_stats: {
        Row: {
          accuracy_percentage: number | null
          active_days: number | null
          best_streak: number | null
          correct_predictions: number | null
          first_prediction: string | null
          highest_multiplier: number | null
          incorrect_predictions: number | null
          last_prediction: string | null
          total_points: number | null
          total_predictions: number | null
          user_wallet: string | null
        }
        Relationships: []
      }
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
      cleanup_stale_viewers: { Args: never; Returns: undefined }
      get_drop_remaining_supply: {
        Args: { p_drop_id: string }
        Returns: number
      }
      get_public_leaderboard: {
        Args: { limit_count?: number }
        Returns: {
          masked_wallet: string
          rank: number
          reputation_score: number
          total_trn_earned: number
        }[]
      }
      get_referral_stats: {
        Args: never
        Returns: {
          active_referrers: number
          total_referrals: number
          total_rewards_distributed: number
        }[]
      }
      get_user_email: { Args: never; Returns: string }
      get_user_wallet_address: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reserve_next_certificate: {
        Args: { p_drop_id: string; p_session_id: string }
        Returns: {
          certificate_id: string
          serial_number: number
        }[]
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

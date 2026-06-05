import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ServiceBackground =
  | 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force'
  | 'Law Enforcement' | 'Fire Department' | 'EMS/EMT' | 'Dispatch' | 'Corrections';

export type Database = {
  public: {
    Tables: {
      veterans: {
        Row: {
          id: string;
          first_name: string;
          last_initial: string;
          photo_url: string;
          military_branch: ServiceBackground;
          service_location: string;
          current_location: string;
          gender: 'Male' | 'Female' | 'Other';
          career_goals: string;
          biography: string;
          video_url: string | null;
          is_sponsored: boolean;
          sponsorship_amount_needed: number;
          sponsorship_amount_raised: number;
          user_id: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['veterans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['veterans']['Insert']>;
      };
      hero_updates: {
        Row: {
          id: string;
          veteran_id: string;
          author_id: string | null;
          author_role: 'hero' | 'admin';
          title: string;
          body: string;
          update_type: 'general' | 'milestone' | 'training' | 'gratitude' | 'achievement';
          visibility: 'public' | 'sponsors_only' | 'donors_only';
          status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';
          moderation_notes: string;
          submitted_at: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_updates']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hero_updates']['Insert']>;
      };
      hero_update_media: {
        Row: {
          id: string;
          update_id: string;
          media_type: 'image' | 'video' | 'embed';
          storage_path: string;
          external_url: string;
          caption: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_update_media']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['hero_update_media']['Insert']>;
      };
      hero_invites: {
        Row: {
          id: string;
          token: string;
          veteran_id: string;
          email: string;
          expires_at: string;
          used_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_invites']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['hero_invites']['Insert']>;
      };
      hero_update_views: {
        Row: {
          id: string;
          update_id: string;
          donor_id: string;
          viewed_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_update_views']['Row'], 'id' | 'viewed_at'> & { viewed_at?: string };
        Update: Partial<Database['public']['Tables']['hero_update_views']['Insert']>;
      };
      donors: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          is_monthly_donor: boolean;
          total_contributed: number;
          monthly_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donors']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['donors']['Insert']>;
      };
      sponsorships: {
        Row: {
          id: string;
          donor_id: string;
          veteran_id: string;
          amount_committed: number;
          is_recurring: boolean;
          status: 'active' | 'completed' | 'cancelled';
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['sponsorships']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['sponsorships']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          veteran_id: string | null;
          amount: number;
          is_recurring: boolean;
          stripe_payment_id: string;
          stripe_subscription_id: string | null;
          status: 'succeeded' | 'pending' | 'failed' | 'refunded';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      veteran_progress: {
        Row: {
          id: string;
          veteran_id: string;
          milestone: string;
          description: string;
          completion_percentage: number;
          sort_order: number;
          status: 'completed' | 'in_progress' | 'upcoming';
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['veteran_progress']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['veteran_progress']['Insert']>;
      };
      veteran_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          military_branch: ServiceBackground;
          photo_url: string;
          video_url: string;
          programs_interested: string[];
          desired_start_timeline: string;
          city: string;
          state: string;
          status: 'pending' | 'reviewing' | 'approved' | 'declined';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['veteran_applications']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['veteran_applications']['Insert']> & { status?: 'pending' | 'reviewing' | 'approved' | 'declined' };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          subtitle: string;
          duration: string;
          price: string;
          salary_range: string;
          description: string;
          tier: string;
          icon_name: string;
          is_featured: boolean;
          is_coming_soon: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['programs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          military_branch: string;
          role: string | null;
          quote: string;
          rating: number;
          photo_url: string | null;
          outcome: string | null;
          story: string | null;
          video_placeholder_url: string | null;
          impact: string | null;
          page: string;
          type: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      partners: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          logo_url: string | null;
          website_url: string | null;
          category: 'training' | 'wellness' | 'community';
          services_provided: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['partners']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['partners']['Insert']>;
      };
      alumni_registrations: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          military_branch: string;
          graduation_year: string;
          job_title: string;
          employer: string;
          interests: string[];
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['alumni_registrations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['alumni_registrations']['Insert']>;
      };
      donor_sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          tier: 'gold' | 'silver' | 'bronze' | 'supporter';
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donor_sponsors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['donor_sponsors']['Insert']>;
      };
      program_courses: {
        Row: {
          id: string;
          program_id: string;
          name: string;
          description: string;
          duration: string;
          price: string;
          format: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['program_courses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['program_courses']['Insert']>;
      };
    };
  };
};

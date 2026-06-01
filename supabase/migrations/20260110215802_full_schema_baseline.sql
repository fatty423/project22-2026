/*
  # Project 22 Database Schema

  ## Overview
  This migration creates the complete database structure for Project 22, a non-profit supporting veterans through career training programs.

  ## New Tables

  ### 1. `veterans`
  Stores veteran profile information for the waiting list directory.
  - `id` (uuid, primary key) - Unique identifier
  - `first_name` (text) - Veteran's first name
  - `last_initial` (text) - Last name initial for privacy
  - `photo_url` (text) - Profile photo URL
  - `military_branch` (text) - Branch of service (Army, Navy, Air Force, Marines, Coast Guard, Space Force)
  - `service_location` (text) - Where they served
  - `current_location` (text) - Current city/state
  - `gender` (text) - Gender for filtering
  - `career_goals` (text) - Desired career path
  - `biography` (text) - Personal story
  - `video_url` (text, nullable) - Personal introduction video
  - `is_sponsored` (boolean) - Sponsorship status
  - `sponsorship_amount_needed` (numeric) - Total training cost
  - `sponsorship_amount_raised` (numeric) - Amount raised so far
  - `created_at` (timestamptz) - Profile creation date
  - `updated_at` (timestamptz) - Last update

  ### 2. `donors`
  Extends auth.users with donor-specific information.
  - `id` (uuid, primary key, foreign key to auth.users)
  - `full_name` (text) - Donor's full name
  - `email` (text) - Contact email
  - `phone` (text, nullable) - Contact phone
  - `is_monthly_donor` (boolean) - Recurring donation status
  - `total_contributed` (numeric) - Lifetime contribution amount
  - `created_at` (timestamptz) - Registration date
  - `updated_at` (timestamptz) - Last update

  ### 3. `sponsorships`
  Links donors to veterans they sponsor.
  - `id` (uuid, primary key)
  - `donor_id` (uuid, foreign key to donors)
  - `veteran_id` (uuid, foreign key to veterans)
  - `amount_committed` (numeric) - Total sponsorship amount
  - `is_recurring` (boolean) - One-time or monthly
  - `status` (text) - active, completed, cancelled
  - `started_at` (timestamptz) - Sponsorship start date
  - `completed_at` (timestamptz, nullable) - When training completed

  ### 4. `donations`
  Tracks all donation transactions.
  - `id` (uuid, primary key)
  - `donor_id` (uuid, foreign key to donors)
  - `veteran_id` (uuid, nullable, foreign key to veterans) - Null for general donations
  - `amount` (numeric) - Donation amount
  - `is_recurring` (boolean) - One-time or monthly
  - `stripe_payment_id` (text) - Stripe transaction reference
  - `stripe_subscription_id` (text, nullable) - For recurring donations
  - `status` (text) - succeeded, pending, failed, refunded
  - `created_at` (timestamptz) - Transaction date

  ### 5. `veteran_progress`
  Tracks sponsored veteran's training progress for donor portal.
  - `id` (uuid, primary key)
  - `veteran_id` (uuid, foreign key to veterans)
  - `milestone` (text) - Training milestone achieved
  - `description` (text) - Detailed update
  - `completion_percentage` (integer) - Overall progress (0-100)
  - `created_at` (timestamptz) - Update date

  ## Security

  All tables have Row Level Security (RLS) enabled with specific policies:
  - Public can view veteran profiles (for waiting list)
  - Donors can view their own donation history and sponsored veterans
  - Only authenticated users can create donations
  - Veterans and progress are publicly viewable to show transparency
*/

-- Create veterans table
CREATE TABLE IF NOT EXISTS veterans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_initial text NOT NULL,
  photo_url text NOT NULL,
  military_branch text NOT NULL CHECK (military_branch IN ('Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force')),
  service_location text NOT NULL,
  current_location text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  career_goals text NOT NULL,
  biography text NOT NULL,
  video_url text,
  is_sponsored boolean DEFAULT false,
  sponsorship_amount_needed numeric DEFAULT 15000.00,
  sponsorship_amount_raised numeric DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  is_monthly_donor boolean DEFAULT false,
  total_contributed numeric DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  veteran_id uuid NOT NULL REFERENCES veterans(id) ON DELETE CASCADE,
  amount_committed numeric NOT NULL,
  is_recurring boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  veteran_id uuid REFERENCES veterans(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  is_recurring boolean DEFAULT false,
  stripe_payment_id text NOT NULL,
  stripe_subscription_id text,
  status text DEFAULT 'succeeded' CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Create veteran_progress table
CREATE TABLE IF NOT EXISTS veteran_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veteran_id uuid NOT NULL REFERENCES veterans(id) ON DELETE CASCADE,
  milestone text NOT NULL,
  description text NOT NULL,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_veterans_location ON veterans(current_location);
CREATE INDEX IF NOT EXISTS idx_veterans_branch ON veterans(military_branch);
CREATE INDEX IF NOT EXISTS idx_veterans_gender ON veterans(gender);
CREATE INDEX IF NOT EXISTS idx_veterans_sponsored ON veterans(is_sponsored);
CREATE INDEX IF NOT EXISTS idx_sponsorships_donor ON sponsorships(donor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_veteran ON sponsorships(veteran_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_veteran ON donations(veteran_id);
CREATE INDEX IF NOT EXISTS idx_progress_veteran ON veteran_progress(veteran_id);

-- Enable Row Level Security
ALTER TABLE veterans ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE veteran_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for veterans table (publicly viewable for transparency)
CREATE POLICY "Anyone can view veteran profiles"
  ON veterans FOR SELECT
  TO public
  USING (true);

-- RLS Policies for donors table
CREATE POLICY "Donors can view own profile"
  ON donors FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can create donor profile"
  ON donors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for sponsorships table
CREATE POLICY "Donors can view own sponsorships"
  ON sponsorships FOR SELECT
  TO authenticated
  USING (donor_id = auth.uid());

CREATE POLICY "Donors can create sponsorships"
  ON sponsorships FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = auth.uid());

CREATE POLICY "Donors can update own sponsorships"
  ON sponsorships FOR UPDATE
  TO authenticated
  USING (donor_id = auth.uid())
  WITH CHECK (donor_id = auth.uid());

-- RLS Policies for donations table
CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (donor_id = auth.uid());

CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = auth.uid());

-- RLS Policies for veteran_progress table (publicly viewable for transparency)
CREATE POLICY "Anyone can view veteran progress"
  ON veteran_progress FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_veterans_updated_at
  BEFORE UPDATE ON veterans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();/*
  # Fix RLS Performance and Security Issues

  ## Performance Optimizations

  ### 1. RLS Policy Optimization
  Replaces `auth.uid()` with `(select auth.uid())` in all RLS policies to prevent
  re-evaluation for each row, significantly improving query performance at scale.
  
  **Tables Updated:**
  - `donors` - 3 policies updated
  - `sponsorships` - 3 policies updated
  - `donations` - 2 policies updated

  ### 2. Remove Unused Indexes
  Drops indexes that are not being used by queries, reducing storage overhead and
  improving write performance:
  - `idx_veterans_location` - Location filtering not used
  - `idx_veterans_branch` - Branch filtering not used
  - `idx_veterans_gender` - Gender filtering not used
  - `idx_veterans_sponsored` - Sponsored status filtering not used
  - `idx_sponsorships_donor` - Covered by foreign key
  - `idx_sponsorships_veteran` - Covered by foreign key
  - `idx_donations_donor` - Covered by foreign key
  - `idx_donations_veteran` - Covered by foreign key
  - `idx_progress_veteran` - Covered by foreign key

  ## Security Enhancements

  ### 3. Function Search Path Security
  Updates `update_updated_at_column` function to use immutable search path,
  preventing potential security vulnerabilities from search path manipulation.

  ## Important Notes
  - All changes are backwards compatible
  - No data is modified or lost
  - Query behavior remains identical with improved performance
*/

-- Drop and recreate donors RLS policies with optimized auth checks
DROP POLICY IF EXISTS "Donors can view own profile" ON donors;
CREATE POLICY "Donors can view own profile"
  ON donors FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Anyone can create donor profile" ON donors;
CREATE POLICY "Anyone can create donor profile"
  ON donors FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Donors can update own profile" ON donors;
CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Drop and recreate sponsorships RLS policies with optimized auth checks
DROP POLICY IF EXISTS "Donors can view own sponsorships" ON sponsorships;
CREATE POLICY "Donors can view own sponsorships"
  ON sponsorships FOR SELECT
  TO authenticated
  USING (donor_id = (select auth.uid()));

DROP POLICY IF EXISTS "Donors can create sponsorships" ON sponsorships;
CREATE POLICY "Donors can create sponsorships"
  ON sponsorships FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = (select auth.uid()));

DROP POLICY IF EXISTS "Donors can update own sponsorships" ON sponsorships;
CREATE POLICY "Donors can update own sponsorships"
  ON sponsorships FOR UPDATE
  TO authenticated
  USING (donor_id = (select auth.uid()))
  WITH CHECK (donor_id = (select auth.uid()));

-- Drop and recreate donations RLS policies with optimized auth checks
DROP POLICY IF EXISTS "Donors can view own donations" ON donations;
CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (donor_id = (select auth.uid()));

DROP POLICY IF EXISTS "Donors can create donations" ON donations;
CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = (select auth.uid()));

-- Remove unused indexes to improve write performance and reduce storage
DROP INDEX IF EXISTS idx_veterans_location;
DROP INDEX IF EXISTS idx_veterans_branch;
DROP INDEX IF EXISTS idx_veterans_gender;
DROP INDEX IF EXISTS idx_veterans_sponsored;
DROP INDEX IF EXISTS idx_sponsorships_donor;
DROP INDEX IF EXISTS idx_sponsorships_veteran;
DROP INDEX IF EXISTS idx_donations_donor;
DROP INDEX IF EXISTS idx_donations_veteran;
DROP INDEX IF EXISTS idx_progress_veteran;

-- Fix function search path security vulnerability
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;/*
  # Create Veteran Applications Table and Storage

  1. New Tables
    - `veteran_applications`
      - `id` (uuid, primary key) - Unique application identifier
      - `full_name` (text, not null) - Applicant's full name
      - `email` (text, not null) - Contact email address
      - `phone` (text, not null) - Contact phone number
      - `military_branch` (text, not null) - Branch of military service
      - `photo_url` (text) - URL to uploaded military photo
      - `video_url` (text) - URL to optional sponsorship video
      - `programs_interested` (text array, not null) - Selected training programs
      - `desired_start_timeline` (text, not null) - When they'd like to start
      - `status` (text, default 'pending') - Application review status
      - `created_at` (timestamptz) - Submission timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `veteran_applications` table
    - Add policy for anonymous inserts (public application form)
    - No public read access (admin only)

  3. Storage
    - Create `veteran-uploads` bucket for photos and videos
    - Allow public uploads for application submissions
*/

CREATE TABLE IF NOT EXISTS veteran_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  military_branch text NOT NULL CHECK (military_branch IN ('Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force')),
  photo_url text DEFAULT '',
  video_url text DEFAULT '',
  programs_interested text[] NOT NULL DEFAULT '{}',
  desired_start_timeline text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE veteran_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a veteran application"
  ON veteran_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view applications"
  ON veteran_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

INSERT INTO storage.buckets (id, name, public)
VALUES ('veteran-uploads', 'veteran-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload veteran files"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'veteran-uploads');

CREATE POLICY "Anyone can read veteran uploads"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'veteran-uploads');/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - sender's full name
      - `email` (text) - sender's email address
      - `phone` (text, nullable) - sender's phone number
      - `subject` (text) - message subject
      - `message` (text) - message body
      - `created_at` (timestamptz) - when the message was sent

  2. Security
    - Enable RLS on `contact_messages` table
    - Add insert policy allowing anonymous users to submit contact messages
    - Add select policy for authenticated admin users only
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);/*
  # Create admin_users table and admin access policies

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `role` (text, default 'admin')
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `admin_users` table
    - Admin users can read their own admin record
    - Add admin SELECT policy on `veteran_applications`
    - Add admin UPDATE policy on `veteran_applications`
    - Add admin SELECT policy on `contact_messages`

  3. Helper Function
    - `is_admin()` function to check if the current user is an admin
*/

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

CREATE POLICY "Admins can read own admin record"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all veteran applications"
  ON public.veteran_applications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update veteran applications"
  ON public.veteran_applications
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can read all contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
/*
  # Create programs table

  1. New Tables
    - `programs`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier used in veteran applications
      - `name` (text) - Display name of the program
      - `subtitle` (text) - Short subtitle, e.g. "Unarmed D Certificate"
      - `duration` (text) - Duration description, e.g. "3 Days"
      - `price` (text) - Price display string, e.g. "$195"
      - `salary_range` (text) - Expected salary range, e.g. "$17 - $20 / hr"
      - `description` (text) - Full program description
      - `tier` (text) - Program tier: entry, mid, premium, coming-soon
      - `icon_name` (text) - Lucide icon name reference
      - `is_featured` (boolean) - Whether this is the featured/highlighted program
      - `is_coming_soon` (boolean) - Whether this program is not yet available
      - `is_active` (boolean) - Whether to show this program on the site
      - `sort_order` (integer) - Display ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `programs` table
    - Add SELECT policy for anonymous users (public read access for active programs)
    - Add full CRUD policies for authenticated admin users

  3. Seed Data
    - 6 initial programs matching the existing hardcoded data
*/

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  salary_range text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tier text NOT NULL DEFAULT 'entry',
  icon_name text NOT NULL DEFAULT 'Shield',
  is_featured boolean NOT NULL DEFAULT false,
  is_coming_soon boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON programs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert programs"
  ON programs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can update programs"
  ON programs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can delete programs"
  ON programs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

INSERT INTO programs (slug, name, subtitle, duration, price, salary_range, description, tier, icon_name, is_featured, is_coming_soon, sort_order)
VALUES
  ('security-basic', 'Security Basic', 'Unarmed D Certificate', '3 Days', '$195', '$17 - $20 / hr', 'Start your career in private security with foundational training and state certification.', 'entry', 'Shield', false, false, 1),
  ('armed-security', 'Security Armed', 'D and G Certificate', '7 Days', '$420', '$18 - $22 / hr', 'Armed security certification combining unarmed and firearms training for expanded opportunities.', 'entry', 'Shield', false, false, 2),
  ('security-advanced', 'Security Advanced', 'D, G + 2 ASP Courses', '9 Days', '$750', '$18 - $23 / hr', 'Comprehensive security package with advanced certifications for higher-paying positions.', 'mid', 'BadgeCheck', false, false, 3),
  ('executive-protection', 'Executive Protection', 'D, G Certificates', '10 - 12 Days', '$1,395', 'Up to $400 - $500 / day', 'Specialized close protection training for high-profile clients and executive details.', 'premium', 'Award', false, false, 4),
  ('all-in-one-ep', 'All-in-One Executive Protection Advanced', 'Complete Professional Package', '31 Days', '$8,650', 'Up to $600 / day', 'Our most comprehensive program. Full immersion training covering every aspect of executive protection.', 'premium', 'Award', true, false, 5),
  ('private-investigator', 'Private Investigator', 'Coming Soon', 'TBD', 'TBD', 'TBD', 'Private investigation training and licensing program currently in development.', 'coming-soon', 'Search', false, true, 6);
/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Person's name
      - `military_branch` (text) - Branch of service or class info
      - `role` (text, nullable) - Current job role/title
      - `quote` (text) - The testimonial text
      - `rating` (integer) - Star rating 1-5
      - `photo_url` (text, nullable) - Profile or story photo
      - `outcome` (text, nullable) - Short outcome summary
      - `story` (text, nullable) - Longer story text for success stories
      - `video_placeholder_url` (text, nullable) - Thumbnail image for video stories
      - `impact` (text, nullable) - Impact summary for success stories
      - `page` (text) - Which page: 'home' or 'impact'
      - `type` (text) - 'testimonial' or 'success_story'
      - `is_active` (boolean) - Whether to show on the site
      - `sort_order` (integer) - Display ordering
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `testimonials` table
    - Public SELECT for active testimonials
    - Admin-only INSERT, UPDATE, DELETE

  3. Seed Data
    - Home page: 3 success stories + 4 testimonials
    - Impact page: 3 success stories + 3 testimonials
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  military_branch text NOT NULL DEFAULT '',
  role text,
  quote text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  photo_url text,
  outcome text,
  story text,
  video_placeholder_url text,
  impact text,
  page text NOT NULL DEFAULT 'home',
  type text NOT NULL DEFAULT 'testimonial',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

-- Home page success stories
INSERT INTO testimonials (name, military_branch, role, quote, rating, photo_url, outcome, story, page, type, sort_order)
VALUES
  ('Marcus Johnson', 'U.S. Army Veteran', 'Executive Protection Specialist', '', 5,
   'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
   'Now earning $95k as Executive Protection Specialist',
   'After leaving the Army, I struggled to find my purpose. Project 22 gave me world-class training and connected me with an executive protection role earning $95,000 annually. I finally found a career that honors my military skills.',
   'home', 'success_story', 1),
  ('Sarah Mitchell', 'U.S. Marine Corps Veteran', 'Overseas Security Contractor', '', 5,
   'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
   'Secured overseas contract within 3 months of graduation',
   'The transition from military to civilian life was one of the hardest challenges I faced. Project 22 provided not just job training, but emotional support for me and my family. Within 3 months of graduating, I secured a high-paying overseas contract.',
   'home', 'success_story', 2),
  ('David Chen', 'U.S. Navy Veteran', 'Security Operations Manager', '', 5,
   'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=400',
   'Manages team of 15, rebuilt life and family relationships',
   'I went from feeling lost and hopeless to managing a team of 15 security professionals. Project 22 didn''t just train me for a job—they gave me back my confidence and sense of purpose. This program literally saved my life.',
   'home', 'success_story', 3);

-- Home page testimonials
INSERT INTO testimonials (name, military_branch, quote, rating, page, type, sort_order)
VALUES
  ('Robert Hayes', 'Army Ranger, Class of 2023',
   'Project 22 gave me more than a career—they gave me hope. The instructors understood what I was going through because they''d been there. The training was top-tier, and the job placement support was incredible.',
   5, 'home', 'testimonial', 1),
  ('Jennifer Torres', 'Air Force Veteran, Class of 2024',
   'I was skeptical at first, but this program exceeded every expectation. The holistic approach to wellness, combined with professional training, transformed my life. I''m now thriving in a career I love.',
   5, 'home', 'testimonial', 2),
  ('Michael Brown', 'Marine Corps Veteran, Class of 2023',
   'After years of struggling with PTSD and unemployment, Project 22 was my lifeline. They didn''t just teach me skills—they helped me heal. I''m now employed, stable, and finally have hope for the future.',
   5, 'home', 'testimonial', 3),
  ('Amanda Williams', 'Navy Veteran, Class of 2024',
   'The personal attention and support I received was unmatched. Every instructor cared about my success, not just during training but after graduation too. This program changes lives.',
   5, 'home', 'testimonial', 4);

-- Impact page testimonials
INSERT INTO testimonials (name, military_branch, role, quote, rating, photo_url, page, type, sort_order)
VALUES
  ('John M.', 'U.S. Army', 'Executive Protection Specialist',
   'Project 22 gave me a second chance at life. The training was world-class, and the support didn''t end after graduation. I now have a career I''m proud of and can provide for my family.',
   5, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
   'impact', 'testimonial', 1),
  ('Sarah K.', 'U.S. Marine Corps', 'Security Contractor',
   'After struggling to find my place after service, Project 22 showed me a clear path forward. The holistic approach addressed not just my career, but my overall wellness. Life-changing.',
   5, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
   'impact', 'testimonial', 2),
  ('Michael R.', 'U.S. Navy', 'Security Guard Supervisor',
   'The instructors were incredible - experienced professionals who truly cared about our success. Within weeks of completing the program, I landed a position earning more than I ever imagined.',
   5, 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
   'impact', 'testimonial', 3);

-- Impact page success stories
INSERT INTO testimonials (name, quote, video_placeholder_url, impact, page, type, sort_order)
VALUES
  ('From Homelessness to $90k Career',
   'Marine Corps veteran overcame housing instability to become a successful executive protection specialist',
   'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Now mentoring other veterans in the program',
   'impact', 'success_story', 1),
  ('Family Reunited Through Stability',
   'Army veteran secured stable employment, enabling family reunification after years of separation',
   'https://images.pexels.com/photos/6865169/pexels-photo-6865169.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Supporting wife and two children with newfound career',
   'impact', 'success_story', 2),
  ('Combat Medic to Security Leader',
   'Navy corpsman translated military skills into civilian success, now managing security teams',
   'https://images.pexels.com/photos/7876708/pexels-photo-7876708.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Promoted to supervisor within first year',
   'impact', 'success_story', 3);
/*
  # Add admin SELECT policies for programs and testimonials

  1. Security Changes
    - Add SELECT policy on `programs` for authenticated admin users to view ALL programs (including inactive)
    - Add SELECT policy on `testimonials` for authenticated admin users to view ALL testimonials (including inactive)
    - These complement the existing public SELECT policies that only show active items

  2. Notes
    - Admin users are identified by matching their auth email against the admin_users table
    - The public policies remain unchanged (anonymous/authenticated users still only see active items)
    - Admin policies use OR logic with existing policies so admins see everything
*/

CREATE POLICY "Admins can view all programs"
  ON programs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );
/*
  # Admin setup and policy fixes

  1. Security Changes
    - Add INSERT policy on `admin_users` that allows creating the first admin
      when no admin records exist (one-time setup)
    - Add SELECT policy on `admin_users` so authenticated users can check
      if any admins exist (count only, used for setup detection)

  2. Important Notes
    - The INSERT policy uses a subquery check: only allows insert when
      the admin_users table is empty AND the inserting user matches auth.uid()
    - Once the first admin is created, no further inserts are possible through
      this policy
*/

CREATE POLICY "Allow first admin setup when no admins exist"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND NOT EXISTS (SELECT 1 FROM public.admin_users)
  );

CREATE POLICY "Authenticated users can check admin count"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);
/*
  # Create admin_setup_needed() function

  1. New Functions
    - `admin_setup_needed()` - Returns true if no admin users exist, false otherwise
      - SECURITY DEFINER so it bypasses RLS
      - Callable by anon and authenticated roles
      - Only returns a boolean, never exposes table data

  2. Purpose
    - Allows the admin login page to detect whether setup is needed
      without requiring authentication
    - Previously, the SELECT RLS policies on admin_users only allowed
      authenticated users, so anonymous visitors always saw count=0
*/

CREATE OR REPLACE FUNCTION public.admin_setup_needed()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.admin_users);
$$;

GRANT EXECUTE ON FUNCTION public.admin_setup_needed() TO anon;
GRANT EXECUTE ON FUNCTION public.admin_setup_needed() TO authenticated;
/*
  # Admin user management - roles and policies

  1. New Functions
    - `is_super_admin()` - Returns true if current user has the 'super_admin' role

  2. Schema Changes
    - Upgrade all existing admin users to 'super_admin' role (they were created
      during initial setup and should have full privileges)

  3. Policy Updates
    - Super admins can insert new admin user records
    - Super admins can update any admin user record
    - Super admins can delete other admin user records (not themselves)

  4. Important Notes
    - The existing "Allow first admin setup when no admins exist" INSERT policy
      remains for initial bootstrap
    - The new INSERT policy allows super admins to add additional admins after setup
    - Delete policy prevents self-deletion to ensure at least one super admin remains
*/

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

UPDATE public.admin_users
SET role = 'super_admin'
WHERE role = 'admin';

CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_super_admin()
  );

CREATE POLICY "Super admins can update admin users"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete other admin users"
  ON public.admin_users
  FOR DELETE
  TO authenticated
  USING (
    public.is_super_admin()
    AND id != auth.uid()
  );
/*
  # Add authenticated role policies for storage and veteran applications

  1. Storage Changes
    - Add INSERT policy on `storage.objects` for `authenticated` role on `veteran-uploads` bucket
    - Add SELECT policy on `storage.objects` for `authenticated` role on `veteran-uploads` bucket

  2. Table Changes
    - Add INSERT policy on `veteran_applications` for `authenticated` role

  3. Notes
    - Existing `anon` policies remain unchanged
    - Fixes 400 error when authenticated users (e.g. admins) submit the veteran application form
*/

CREATE POLICY "Authenticated users can upload veteran files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'veteran-uploads');

CREATE POLICY "Authenticated users can read veteran uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'veteran-uploads');

CREATE POLICY "Authenticated users can submit veteran applications"
  ON public.veteran_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
/*
  # Fix security and performance issues

  1. Indexes
    - Add index on `donations.donor_id` (FK)
    - Add index on `donations.veteran_id` (FK)
    - Add index on `sponsorships.donor_id` (FK)
    - Add index on `sponsorships.veteran_id` (FK)
    - Add index on `veteran_progress.veteran_id` (FK)

  2. Functions
    - Recreate `is_admin()` with immutable search_path and optimized auth call
    - Recreate `is_super_admin()` with immutable search_path and optimized auth call
    - Recreate `admin_setup_needed()` as SECURITY DEFINER with immutable search_path

  3. Policy changes (programs)
    - Split public SELECT into separate anon / authenticated policies
    - Rewrite admin policies using `(select public.is_admin())` for per-row optimization

  4. Policy changes (testimonials)
    - Same restructure as programs

  5. Policy changes (veteran_applications)
    - Remove redundant permissive SELECT policies, keep single admin-only policy
    - Merge two INSERT policies into one with basic field validation
    - Optimize UPDATE policy auth call

  6. Policy changes (contact_messages)
    - Remove redundant permissive SELECT policy, keep admin-only
    - Add field validation to INSERT policy

  7. Policy changes (admin_users)
    - Remove overly broad `Authenticated users can check admin count` (USING true)
    - Combine SELECT into single policy: own record OR super admin
    - Combine INSERT into single policy: first-time setup OR super admin
    - Optimize DELETE and UPDATE policies with `(select ...)` pattern

  8. Notes
    - `admin_setup_needed()` is now SECURITY DEFINER so it can check
      admin existence without needing a broad SELECT policy on admin_users
    - All `auth.uid()` and `auth.jwt()` calls in policies wrapped with
      `(select ...)` to avoid per-row re-evaluation
    - No data is modified or deleted by this migration
*/

-- ============================================================
-- 1. Add indexes on unindexed foreign keys
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_veteran_id ON public.donations(veteran_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_donor_id ON public.sponsorships(donor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_veteran_id ON public.sponsorships(veteran_id);
CREATE INDEX IF NOT EXISTS idx_veteran_progress_veteran_id ON public.veteran_progress(veteran_id);


-- ============================================================
-- 2. Recreate functions with fixed search_path
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = (select auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = (select auth.uid()) AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.admin_setup_needed()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.admin_users);
$$;


-- ============================================================
-- 3. Recreate programs policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can delete programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can insert programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can update programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can view all programs" ON public.programs;
DROP POLICY IF EXISTS "Anyone can view active programs" ON public.programs;

CREATE POLICY "Anon can view active programs"
  ON public.programs FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view programs"
  ON public.programs FOR SELECT TO authenticated
  USING (is_active = true OR (select public.is_admin()));

CREATE POLICY "Admins can insert programs"
  ON public.programs FOR INSERT TO authenticated
  WITH CHECK ((select public.is_admin()));

CREATE POLICY "Admins can update programs"
  ON public.programs FOR UPDATE TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

CREATE POLICY "Admins can delete programs"
  ON public.programs FOR DELETE TO authenticated
  USING ((select public.is_admin()));


-- ============================================================
-- 4. Recreate testimonials policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;

CREATE POLICY "Anon can view active testimonials"
  ON public.testimonials FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view testimonials"
  ON public.testimonials FOR SELECT TO authenticated
  USING (is_active = true OR (select public.is_admin()));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK ((select public.is_admin()));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated
  USING ((select public.is_admin()));


-- ============================================================
-- 5. Recreate veteran_applications policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all veteran applications" ON public.veteran_applications;
DROP POLICY IF EXISTS "Authenticated users can view applications" ON public.veteran_applications;
DROP POLICY IF EXISTS "Anyone can submit a veteran application" ON public.veteran_applications;
DROP POLICY IF EXISTS "Authenticated users can submit veteran applications" ON public.veteran_applications;
DROP POLICY IF EXISTS "Admins can update veteran applications" ON public.veteran_applications;

CREATE POLICY "Admins can view veteran applications"
  ON public.veteran_applications FOR SELECT TO authenticated
  USING ((select public.is_admin()));

CREATE POLICY "Anyone can submit a veteran application"
  ON public.veteran_applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) > 0 AND
    length(trim(email)) > 0 AND
    length(trim(phone)) > 0 AND
    military_branch IS NOT NULL
  );

CREATE POLICY "Admins can update veteran applications"
  ON public.veteran_applications FOR UPDATE TO authenticated
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));


-- ============================================================
-- 6. Recreate contact_messages policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING ((select public.is_admin()));

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND
    length(trim(email)) > 0 AND
    length(trim(subject)) > 0 AND
    length(trim(message)) > 0
  );


-- ============================================================
-- 7. Recreate admin_users policies
-- ============================================================

DROP POLICY IF EXISTS "Admins can read own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated users can check admin count" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin setup when no admins exist" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete other admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admin users" ON public.admin_users;

CREATE POLICY "Admins can read admin users"
  ON public.admin_users FOR SELECT TO authenticated
  USING ((select auth.uid()) = id OR (select public.is_super_admin()));

CREATE POLICY "Admins can insert admin users"
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (
    ((select auth.uid()) = id AND (select public.admin_setup_needed()))
    OR (select public.is_super_admin())
  );

CREATE POLICY "Super admins can update admin users"
  ON public.admin_users FOR UPDATE TO authenticated
  USING ((select public.is_super_admin()))
  WITH CHECK ((select public.is_super_admin()));

CREATE POLICY "Super admins can delete other admin users"
  ON public.admin_users FOR DELETE TO authenticated
  USING ((select public.is_super_admin()) AND id <> (select auth.uid()));
/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
      - Includes `user_id` (references `auth.users`)
      - Stores Stripe `customer_id`
      - Implements soft delete

    - `stripe_subscriptions`: Manages subscription data
      - Tracks subscription status, periods, and payment details
      - Links to `stripe_customers` via `customer_id`
      - Custom enum type for subscription status
      - Implements soft delete

    - `stripe_orders`: Stores order/purchase information
      - Records checkout sessions and payment intents
      - Tracks payment amounts and status
      - Custom enum type for order status
      - Implements soft delete

  2. Views
    - `stripe_user_subscriptions`: Secure view for user subscription data
      - Joins customers and subscriptions
      - Filtered by authenticated user

    - `stripe_user_orders`: Secure view for user order history
      - Joins customers and orders
      - Filtered by authenticated user

  3. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE TYPE stripe_subscription_status AS ENUM (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- View for user subscriptions
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- View for user orders
CREATE VIEW stripe_user_orders WITH (security_invoker) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
      - Includes `user_id` (references `auth.users`)
      - Stores Stripe `customer_id`
      - Implements soft delete

    - `stripe_subscriptions`: Manages subscription data
      - Tracks subscription status, periods, and payment details
      - Links to `stripe_customers` via `customer_id`
      - Custom enum type for subscription status
      - Implements soft delete

    - `stripe_orders`: Stores order/purchase information
      - Records checkout sessions and payment intents
      - Tracks payment amounts and status
      - Custom enum type for order status
      - Implements soft delete

  2. Views
    - `stripe_user_subscriptions`: Secure view for user subscription data
      - Joins customers and subscriptions
      - Filtered by authenticated user

    - `stripe_user_orders`: Secure view for user order history
      - Joins customers and orders
      - Filtered by authenticated user

  3. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE TYPE stripe_subscription_status AS ENUM (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- View for user subscriptions
CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- View for user orders
CREATE VIEW stripe_user_orders WITH (security_invoker) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;/*
  # Expand service background to include First Responders

  ## Overview
  This migration expands the military_branch CHECK constraints to include
  first responder categories (Law Enforcement, Fire Department, EMS/EMT,
  Dispatch, Corrections), enabling the platform to serve both veterans
  and first responders.

  ## Changes

  ### Modified Tables
  - `veterans` - Expanded `military_branch` CHECK constraint to include first responder categories
  - `veteran_applications` - Expanded `military_branch` CHECK constraint to include first responder categories

  ## Security
  - No changes to RLS policies
  - No changes to table structure or columns
  - Constraint expansion only (non-destructive)

  ## Notes
  1. Existing data is unaffected as we are only adding new allowed values
  2. The column name `military_branch` is retained at the database level for backwards compatibility
  3. Frontend labels will display "Service Background" to encompass both military and first responder backgrounds
*/

-- Expand CHECK constraint on veterans table
ALTER TABLE veterans DROP CONSTRAINT IF EXISTS veterans_military_branch_check;
ALTER TABLE veterans ADD CONSTRAINT veterans_military_branch_check
  CHECK (military_branch IN (
    'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force',
    'Law Enforcement', 'Fire Department', 'EMS/EMT', 'Dispatch', 'Corrections'
  ));

-- Expand CHECK constraint on veteran_applications table
ALTER TABLE veteran_applications DROP CONSTRAINT IF EXISTS veteran_applications_military_branch_check;
ALTER TABLE veteran_applications ADD CONSTRAINT veteran_applications_military_branch_check
  CHECK (military_branch IN (
    'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force',
    'Law Enforcement', 'Fire Department', 'EMS/EMT', 'Dispatch', 'Corrections'
  ));
/*
  # Create Partners Table

  1. New Tables
    - `partners`
      - `id` (uuid, primary key)
      - `name` (text) - Partner organization name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Brief description of partner services
      - `logo_url` (text, nullable) - Path to partner logo image
      - `website_url` (text, nullable) - External website link
      - `category` (text) - Partner type: 'training' or 'wellness'
      - `services_provided` (text) - Summary of what the partner provides
      - `is_active` (boolean) - Whether the partner is currently displayed
      - `sort_order` (integer) - Display ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `partners` table
    - Public SELECT policy for active partners (no auth required for reading)
    - Admin-only INSERT, UPDATE, DELETE policies

  3. Seed Data
    - ESS Academy (training)
    - Fourth Watch (training)
    - KSA (training)
    - A Place for the Family (wellness)
*/

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  logo_url text,
  website_url text,
  category text NOT NULL DEFAULT 'training',
  services_provided text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT partners_category_check CHECK (category IN ('training', 'wellness'))
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners"
  ON partners
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert partners"
  ON partners
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update partners"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete partners"
  ON partners
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

INSERT INTO partners (name, slug, description, logo_url, website_url, category, services_provided, sort_order)
VALUES
  (
    'ESS Academy',
    'ess-academy',
    'ESS Academy is a premier security training institution providing comprehensive programs in executive protection, security operations, and professional development for veterans and first responders transitioning into the private security industry.',
    '/ESS_Academy_Logo_Verticle_2.jpg',
    NULL,
    'training',
    'Executive Protection Training, Security Operations, Professional Certification Programs',
    1
  ),
  (
    'Fourth Watch',
    'fourth-watch',
    'Fourth Watch provides specialized security training and operational readiness programs designed to prepare veterans and first responders for high-level security career opportunities.',
    NULL,
    NULL,
    'training',
    'Security Training, Operational Readiness, Advanced Tactical Programs',
    2
  ),
  (
    'KSA',
    'ksa',
    'KSA delivers expert-level training in security and protective services, equipping participants with the skills and certifications needed to excel in the security industry.',
    NULL,
    NULL,
    'training',
    'Security Certification, Protective Services Training, Career Advancement Programs',
    3
  ),
  (
    'A Place for the Family',
    'a-place-for-the-family',
    'A Place for the Family provides spiritual wellness and family support services, helping veterans and first responders strengthen their faith, rebuild family connections, and find holistic healing beyond career training.',
    NULL,
    NULL,
    'wellness',
    'Spiritual Wellness, Family Counseling, Faith-Based Support, Holistic Healing',
    4
  );
/*
  # Add Todd Dubois and Ronnie Jackson testimonials to Impact page

  1. Changes
    - Deactivate existing placeholder testimonials on the impact page (John M., Sarah K., Michael R.)
    - Insert Todd Dubois as an impact page graduate testimonial
    - Insert Ronnie Jackson as an impact page graduate testimonial

  2. Notes
    - Todd and Ronnie's home page success_story records remain unchanged
    - New records use type = 'testimonial' to appear in the Graduate Testimonials section
    - Stories are stored in the `story` column for long-form content
*/

UPDATE testimonials
SET is_active = false
WHERE page = 'impact'
  AND type = 'testimonial'
  AND name IN ('John M.', 'Sarah K.', 'Michael R.');

INSERT INTO testimonials (name, type, page, quote, story, photo_url, military_branch, role, rating, sort_order, is_active)
VALUES
(
  'Todd Dubois',
  'testimonial',
  'impact',
  'ESS helped me find my footing again. They understand that transition isn''t just about employment—it''s about identity, faith and character.',
  'I spent over 20 years as a Marine special operator. The military wasn''t just my career—it was my identity, my purpose, and my community. So when it came time to transition, I wasn''t just stepping into a new job… I was stepping into the unknown.

Like many veterans, I wondered: Who am I without the uniform? Does what I''ve done even matter out here?

Some Marines I trusted pointed me to ESS. They told me it was a solid program, professionally run, and worth my time. That was enough for me to take a chance—but what I found there went far beyond training.

Yes, ESS gave me the skills and knowledge to succeed in the security field. They helped me understand the industry, the risks, and how to grow within it. They gave me real opportunities—mentorship, internships, and exposure to leadership, operations, and executive protection.

But the most important thing they gave me wasn''t tactical—it was personal.

ESS helped me find my footing again.

They understand that transition isn''t just about employment—it''s about identity, faith and character. It''s about rediscovering purpose. They created an environment that reinforced values I had lived by for decades, while helping me see how those values still matter in a new chapter of life. They helped quiet the doubt, the uncertainty, and that sense of loss that so many of us carry when we hang up the uniform.

They didn''t just prepare me for a career—they helped me rebuild a sense of direction, spiritually and emotionally.

Today, I continue to work with ESS, supporting both their academic and operational efforts. I''m still serving—just in a different way.

That''s why programs like Project-22 matter. Sponsoring a student isn''t just helping someone get a job—it''s giving them a path forward. It''s giving them purpose again.

And for many of us, that makes all the difference.',
  '/Todd_2.jpg',
  'U.S. Military Veteran',
  'EA Instructor, Joint Special Operations University',
  5,
  1,
  true
),
(
  'Ronnie Jackson',
  'testimonial',
  'impact',
  'Project 22 and ESS has truly been an alignment with God''s promise for me, and I am blessed to be a product of the training.',
  'My journey was not by chance — it was aligned. I was seeking an environment that not only sharpened my professional abilities in the security industry but also aligned with my faith and purpose. Project 22 and ESS presented itself as that space where discipline, structure, and spiritual growth all come together.

My experience while training and working with ESS through Project 22 has been transformational. The training is not just about skill development — it''s about mindset, leadership, and operating with purpose. Project 22 emphasizes being a vessel, using your gifts to serve others, and maintaining a higher standard in everything you do. That foundation has had a lasting impact on how I approach both my career and my life.

Today, I am in a strong place professionally, continuing to grow and expand within the security industry while leading with intention and vision. Emotionally, I am more grounded and focused. Spiritually, I am aligned — confident that I am walking in purpose and using my gifts to be a light in this industry.

Project 22 and ESS has truly been an alignment with God''s promise for me, and I am blessed to be a product of the training.',
  '/Ronnie_Jackson.webp',
  'U.S. Military Veteran',
  'Security Industry Professional',
  5,
  2,
  true
);
/*
  # Enhance veteran_progress for journey timeline

  1. Schema Changes to `veteran_progress`
    - `sort_order` (integer, default 0) - sequential position of milestone (1-8)
    - `status` (text, default 'upcoming') - milestone status: completed, in_progress, or upcoming
    - `completed_at` (timestamptz, nullable) - when the milestone was achieved

  2. Security
    - Add admin INSERT policy on `veteran_progress`
    - Add admin UPDATE policy on `veteran_progress`
    - Add admin DELETE policy on `veteran_progress`

  3. Seed Data
    - Insert 8 milestones per veteran at varying stages of progress
    - Marcus T. (Army): 4 completed, milestone 5 in progress
    - Sarah K. (Navy): 6 completed, milestone 7 in progress
    - Carlos R. (Marines): 2 completed, milestone 3 in progress
*/

-- Add new columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veteran_progress' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE veteran_progress ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veteran_progress' AND column_name = 'status'
  ) THEN
    ALTER TABLE veteran_progress ADD COLUMN status text DEFAULT 'upcoming'
      CHECK (status IN ('completed', 'in_progress', 'upcoming'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veteran_progress' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE veteran_progress ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Admin RLS policies
CREATE POLICY "Admins can insert veteran progress"
  ON veteran_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update veteran progress"
  ON veteran_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete veteran progress"
  ON veteran_progress FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Seed milestones for Marcus T. (Army) - 4 completed, #5 in progress
INSERT INTO veteran_progress (veteran_id, milestone, description, completion_percentage, sort_order, status, completed_at) VALUES
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Application Approved', 'Application reviewed and accepted into Project 22 program.', 100, 1, 'completed', '2025-09-15T10:00:00Z'),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Funding Secured', 'Sponsorship funding goal reached through donor contributions.', 100, 2, 'completed', '2025-10-02T14:30:00Z'),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Training Started', 'Enrolled and began coursework in the EP Certification program.', 100, 3, 'completed', '2025-10-20T08:00:00Z'),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Certifications Earned', 'Obtained required industry certifications for the program.', 100, 4, 'completed', '2025-12-18T16:00:00Z'),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Job Placement', 'Actively interviewing with partner companies for career placement.', 60, 5, 'in_progress', NULL),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Mentorship Phase', 'Ongoing mentorship with industry professionals for career growth.', 0, 6, 'upcoming', NULL),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Career Established', 'Secured stable employment in the chosen career field.', 0, 7, 'upcoming', NULL),
  ('d38c9505-2dff-4429-af8f-caf9c67044ff', 'Success Story', 'Completed the full program journey and giving back to the community.', 0, 8, 'upcoming', NULL);

-- Seed milestones for Sarah K. (Navy) - 6 completed, #7 in progress
INSERT INTO veteran_progress (veteran_id, milestone, description, completion_percentage, sort_order, status, completed_at) VALUES
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Application Approved', 'Application reviewed and accepted into Project 22 program.', 100, 1, 'completed', '2025-06-10T09:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Funding Secured', 'Sponsorship funding fully secured from generous donors.', 100, 2, 'completed', '2025-06-28T11:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Training Started', 'Started intensive cybersecurity training program.', 100, 3, 'completed', '2025-07-15T08:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Certifications Earned', 'Earned CompTIA Security+ and network security certifications.', 100, 4, 'completed', '2025-09-20T15:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Job Placement', 'Placed with a leading cybersecurity firm as a junior analyst.', 100, 5, 'completed', '2025-10-05T10:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Mentorship Phase', 'Working closely with senior analyst mentor for career development.', 100, 6, 'completed', '2025-12-01T09:00:00Z'),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Career Established', 'Transitioning into a permanent full-time cybersecurity role.', 45, 7, 'in_progress', NULL),
  ('1f9c9d84-edcd-4f0d-b872-e91c36d74ada', 'Success Story', 'Completed the full program journey and giving back to the community.', 0, 8, 'upcoming', NULL);

-- Seed milestones for Carlos R. (Marines) - 2 completed, #3 in progress
INSERT INTO veteran_progress (veteran_id, milestone, description, completion_percentage, sort_order, status, completed_at) VALUES
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Application Approved', 'Application reviewed and accepted into Project 22 program.', 100, 1, 'completed', '2026-01-08T10:00:00Z'),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Funding Secured', 'Donations from sponsors fully covered training costs.', 100, 2, 'completed', '2026-01-25T14:00:00Z'),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Training Started', 'Currently enrolled in the executive protection training course.', 35, 3, 'in_progress', NULL),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Certifications Earned', 'Industry certifications to be obtained upon course completion.', 0, 4, 'upcoming', NULL),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Job Placement', 'Career placement with partner security firms after training.', 0, 5, 'upcoming', NULL),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Mentorship Phase', 'Ongoing mentorship with industry professionals for career growth.', 0, 6, 'upcoming', NULL),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Career Established', 'Secured stable employment in the chosen career field.', 0, 7, 'upcoming', NULL),
  ('50c639af-8bf3-414d-b520-5e966933714b', 'Success Story', 'Completed the full program journey and giving back to the community.', 0, 8, 'upcoming', NULL);
/*
  # Update All-in-One program duration

  1. Modified Tables
    - `programs`
      - Changed `duration` from '31 Days' to '24 Days' for the All-in-One Executive Protection Advanced program
*/

UPDATE programs
SET duration = '24 Days'
WHERE slug = 'all-in-one-ep';
/*
  # Add Fellowship of Believers Partner

  1. New Data
    - Insert "Fellowship of Believers" into `partners` table
      - Category: wellness (faith-based support)
      - Logo: /Fellowship.png
      - Sort order: 5 (after existing partners)

  2. No schema changes required
*/

INSERT INTO partners (name, slug, description, logo_url, website_url, category, services_provided, sort_order)
VALUES (
  'Fellowship of Believers',
  'fellowship-of-believers',
  'Fellowship of Believers is a faith community dedicated to walking alongside veterans and first responders through spiritual mentorship, community fellowship, and compassionate support during their transition journey.',
  '/Fellowship.png',
  NULL,
  'wellness',
  'Spiritual Mentorship, Community Fellowship, Faith-Based Counseling, Peer Support Groups',
  5
);/*
  # Update Fellowship of Believers & Add Community Category

  1. Schema Changes
    - Expand `partners.category` CHECK constraint to allow 'community' in addition to 'training' and 'wellness'

  2. Data Changes
    - Update "Fellowship of Believers" partner record:
      - `category` changed from 'wellness' to 'community'
      - `description` updated to reflect role as local Tarpon Springs church supporting trainees
      - `services_provided` updated with specific offerings (housing, facility, family ministry)
      - `website_url` set to https://www.wearefellowshipchurch.com/

  3. Notes
    - No tables dropped or columns removed
    - Existing training and wellness partners are unaffected
*/

ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_category_check;
ALTER TABLE partners ADD CONSTRAINT partners_category_check CHECK (category IN ('training', 'wellness', 'community'));

UPDATE partners
SET
  category = 'community',
  description = 'Fellowship of Believers is a local church in Tarpon Springs, Florida, that serves as a home base for veterans and first responders while they complete their training programs. The congregation opens its doors to provide temporary housing coordination, facility access for meetings and gatherings, family ministry to keep participants connected with loved ones back home, community meals, and a welcoming faith community that embraces trainees as their own.',
  services_provided = 'Host Family & Housing Coordination, Facility Access for Meetings & Gatherings, Family Ministry & Connection Support, Community Meals & Fellowship, Spiritual Mentorship & Prayer Support, Local Community Integration',
  website_url = 'https://www.wearefellowshipchurch.com/',
  updated_at = now()
WHERE slug = 'fellowship-of-believers';
/*
  # Create alumni_registrations table

  1. New Tables
    - `alumni_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `military_branch` (text, required)
      - `graduation_year` (text, required)
      - `job_title` (text, optional)
      - `employer` (text, optional)
      - `interests` (text array, mentoring/networking/events)
      - `message` (text, optional)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `alumni_registrations` table
    - Add INSERT policy for authenticated and anonymous users (public form)
    - Add SELECT policy for admin users only
*/

CREATE TABLE IF NOT EXISTS alumni_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  military_branch text NOT NULL,
  graduation_year text NOT NULL,
  job_title text DEFAULT '',
  employer text DEFAULT '',
  interests text[] DEFAULT '{}',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alumni_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit alumni registration"
  ON alumni_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view alumni registrations"
  ON alumni_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
/*
  # Create Program Courses Table and Activate Investigator Pathway

  1. New Tables
    - `program_courses`
      - `id` (uuid, primary key)
      - `program_id` (uuid, FK to programs)
      - `name` (text) - course name
      - `description` (text) - short course description
      - `duration` (text) - e.g. "8 hrs"
      - `price` (text) - e.g. "$200"
      - `format` (text) - "Online" or "In Person"
      - `sort_order` (integer) - display order
      - `is_active` (boolean) - visibility flag
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `programs` - Updates the Private Investigator row:
      - Sets `is_coming_soon` to false
      - Updates tier, subtitle, duration, price, salary_range, description

  3. Seed Data
    - 4 courses for the Investigator Pathway:
      1. CC Intern Course (40 hrs, Online, $400)
      2. Investigator Tradecraft Basics and Today's Techniques (8 hrs, In Person, $175)
      3. Introduction into OSINT (8 hrs, Online, $200)
      4. Introduction into TSCM (Bug Sweeps) (8 hrs, In Person, $200)

  4. Security
    - Enable RLS on `program_courses`
    - Public read policy for active courses
    - Admin full CRUD policy
*/

CREATE TABLE IF NOT EXISTS program_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'In Person',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_program_courses_program_id ON program_courses(program_id);

ALTER TABLE program_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses"
  ON program_courses
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can insert courses"
  ON program_courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update courses"
  ON program_courses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete courses"
  ON program_courses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

UPDATE programs
SET
  is_coming_soon = false,
  tier = 'mid',
  subtitle = 'Investigator Pathway',
  name = 'Private Investigator',
  duration = '64 hrs (4 Courses)',
  price = '$975',
  salary_range = '$45,000 - $85,000 / year',
  description = 'Comprehensive investigator training covering OSINT intelligence gathering, surveillance tradecraft, TSCM counter-surveillance techniques, and CC Intern certification. Available as individual courses or a discounted full pathway bundle.',
  icon_name = 'Search',
  updated_at = now()
WHERE slug = 'private-investigator';

INSERT INTO program_courses (program_id, name, description, duration, price, format, sort_order)
SELECT
  id,
  'CC Intern Course',
  'Foundational certification covering the legal, ethical, and practical essentials of private investigation work.',
  '40 hrs',
  '$400',
  'Online',
  1
FROM programs WHERE slug = 'private-investigator';

INSERT INTO program_courses (program_id, name, description, duration, price, format, sort_order)
SELECT
  id,
  'Investigator Tradecraft Basics and Today''s Techniques',
  'Hands-on training in modern surveillance methods, interview techniques, and field investigation procedures.',
  '8 hrs',
  '$175',
  'In Person',
  2
FROM programs WHERE slug = 'private-investigator';

INSERT INTO program_courses (program_id, name, description, duration, price, format, sort_order)
SELECT
  id,
  'Introduction into OSINT',
  'Learn open-source intelligence gathering, digital footprint analysis, and online research methodologies.',
  '8 hrs',
  '$200',
  'Online',
  3
FROM programs WHERE slug = 'private-investigator';

INSERT INTO program_courses (program_id, name, description, duration, price, format, sort_order)
SELECT
  id,
  'Introduction into TSCM (Bug Sweeps)',
  'Technical surveillance countermeasures training including electronic sweep equipment operation and detection techniques.',
  '8 hrs',
  '$200',
  'In Person',
  4
FROM programs WHERE slug = 'private-investigator';
/*
  # Create donor sponsors table

  1. New Tables
    - `donor_sponsors`
      - `id` (uuid, primary key)
      - `name` (text) - Donor or organization name
      - `logo_url` (text, nullable) - URL to the donor's logo image
      - `website_url` (text, nullable) - Link to the donor's website
      - `tier` (text) - Recognition tier: gold, silver, bronze, supporter
      - `is_active` (boolean) - Whether to display this donor
      - `sort_order` (integer) - Display ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `donor_sponsors` table
    - Public read access for active donors (needed for website display)
    - Admin-only write access for insert, update, delete
*/

CREATE TABLE IF NOT EXISTS donor_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  tier text NOT NULL DEFAULT 'supporter' CHECK (tier = ANY (ARRAY['gold', 'silver', 'bronze', 'supporter'])),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE donor_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active donor sponsors"
  ON donor_sponsors
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert donor sponsors"
  ON donor_sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update donor sponsors"
  ON donor_sponsors
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete donor sponsors"
  ON donor_sponsors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
/*
  # Fix donor_sponsors RLS select policies

  1. Problem
    - The existing "Anyone can view active donor sponsors" policy targets the public/anon role
    - Authenticated admin users cannot SELECT from this table at all
    - This causes inserts to appear to succeed but return no data (`.select()` after `.insert()` fails)
    - Admin panel shows no donors because the admin user cannot read them back

  2. Changes
    - Drop the overly restrictive public-only SELECT policy
    - Add a new public SELECT policy scoped to active donors (for the website)
    - Add a new admin SELECT policy that allows admins to see all donors (including inactive)

  3. Security
    - Public visitors can only see active donors
    - Admins can see all donors for management purposes
*/

DROP POLICY IF EXISTS "Anyone can view active donor sponsors" ON donor_sponsors;

CREATE POLICY "Public can view active donor sponsors"
  ON donor_sponsors
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all donor sponsors"
  ON donor_sponsors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
/*
  # Add State Guard to military branch options

  1. Changes
    - Add 'State Guard' as an allowed value in the `military_branch` check constraint
      on the `veterans` table
    - Add 'State Guard' as an allowed value in the `military_branch` check constraint
      on the `veteran_applications` table

  2. Notes
    - Florida State Guard and other state defense forces use this branch designation
    - Existing data is not affected
*/

ALTER TABLE veterans DROP CONSTRAINT IF EXISTS veterans_military_branch_check;
ALTER TABLE veterans ADD CONSTRAINT veterans_military_branch_check
  CHECK (military_branch = ANY (ARRAY[
    'Army'::text, 'Navy'::text, 'Air Force'::text, 'Marines'::text,
    'Coast Guard'::text, 'Space Force'::text, 'Law Enforcement'::text,
    'Fire Department'::text, 'EMS/EMT'::text, 'Dispatch'::text,
    'Corrections'::text, 'State Guard'::text
  ]));

ALTER TABLE veteran_applications DROP CONSTRAINT IF EXISTS veteran_applications_military_branch_check;
ALTER TABLE veteran_applications ADD CONSTRAINT veteran_applications_military_branch_check
  CHECK (military_branch = ANY (ARRAY[
    'Army'::text, 'Navy'::text, 'Air Force'::text, 'Marines'::text,
    'Coast Guard'::text, 'Space Force'::text, 'Law Enforcement'::text,
    'Fire Department'::text, 'EMS/EMT'::text, 'Dispatch'::text,
    'Corrections'::text, 'State Guard'::text
  ]));
/*
  # Add veteran donor recognition function

  1. New Functions
    - `get_veteran_donors(p_veteran_id uuid)` - Returns a sanitized list of
      successful donors (first name + last initial, amount, date) who have
      contributed to a specific veteran. Aggregates multiple donations from
      the same donor into a single row showing total contributed.

  2. Security
    - Function runs as SECURITY DEFINER so it can read from donations/donors
      tables while bypassing user-level RLS, BUT returns only non-sensitive
      fields (sanitized first name + last initial, amount, latest date).
    - EXECUTE granted to anon and authenticated roles so the hero profile
      page can display donor recognition publicly.

  3. Notes
    - Only `succeeded` donations are included
    - Donor full emails, phones, and full last names are never exposed
    - Anonymous option: donors whose `full_name` is empty are returned as
      "Anonymous"
*/

CREATE OR REPLACE FUNCTION public.get_veteran_donors(p_veteran_id uuid)
RETURNS TABLE (
  donor_display_name text,
  total_amount numeric,
  latest_donation_at timestamptz,
  is_monthly boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN d.full_name IS NULL OR btrim(d.full_name) = '' THEN 'Anonymous'
      WHEN position(' ' in btrim(d.full_name)) = 0 THEN btrim(d.full_name)
      ELSE
        split_part(btrim(d.full_name), ' ', 1)
        || ' '
        || upper(left(split_part(btrim(d.full_name), ' ', array_length(string_to_array(btrim(d.full_name), ' '), 1)), 1))
        || '.'
    END AS donor_display_name,
    SUM(don.amount)::numeric AS total_amount,
    MAX(don.created_at) AS latest_donation_at,
    bool_or(COALESCE(don.is_recurring, false)) AS is_monthly
  FROM public.donations don
  JOIN public.donors d ON d.id = don.donor_id
  WHERE don.veteran_id = p_veteran_id
    AND don.status = 'succeeded'
  GROUP BY donor_display_name
  ORDER BY total_amount DESC, latest_donation_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_veteran_donors(uuid) TO anon, authenticated;
/*
  # Link donations to veterans, add atomic funding helper, backfill Jake→Nick

  1. Schema Changes
    - `sponsorships` table: add unique constraint on (donor_id, veteran_id)
      so the webhook can upsert a donor's sponsorship of a given hero and
      safely increment their cumulative committed amount on recurring cycles.

  2. New Functions
    - `public.increment_veteran_raised(p_veteran_id uuid, p_amount numeric)`
      Atomically adds p_amount to veterans.sponsorship_amount_raised and
      flips is_sponsored=true when the running total meets or exceeds the
      veteran's sponsorship_amount_needed. SECURITY DEFINER; EXECUTE only
      for service_role (the webhook).

  3. Backfill
    - Jake Fassnacht's $22 donation (pi_3TMxyWEm5dlcFnN41xdhXG5E) is linked
      to Nick I. (55a50e02-5a4d-4bae-953d-937419427234). A sponsorship row
      is inserted and Nick's raised total is bumped via the new helper so
      the hero donor wall and the donor portal both reflect the gift.

  4. Security
    - No RLS changes; existing policies on donations/sponsorships/veterans
      remain in force. The new function bypasses RLS via SECURITY DEFINER
      but is restricted to service_role only.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sponsorships_donor_veteran_unique'
  ) THEN
    ALTER TABLE public.sponsorships
      ADD CONSTRAINT sponsorships_donor_veteran_unique UNIQUE (donor_id, veteran_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.increment_veteran_raised(
  p_veteran_id uuid,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.veterans
  SET
    sponsorship_amount_raised = COALESCE(sponsorship_amount_raised, 0) + p_amount,
    is_sponsored = (COALESCE(sponsorship_amount_raised, 0) + p_amount) >= sponsorship_amount_needed,
    updated_at = now()
  WHERE id = p_veteran_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_veteran_raised(uuid, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_veteran_raised(uuid, numeric) TO service_role;

DO $$
DECLARE
  v_nick uuid := '55a50e02-5a4d-4bae-953d-937419427234';
  v_jake uuid := '34caec4f-e87e-45f5-a378-a9e0bd140cee';
  v_amount numeric;
  v_donation_id uuid;
BEGIN
  SELECT id, amount INTO v_donation_id, v_amount
  FROM public.donations
  WHERE donor_id = v_jake
    AND stripe_payment_id = 'pi_3TMxyWEm5dlcFnN41xdhXG5E'
    AND veteran_id IS NULL
  LIMIT 1;

  IF v_donation_id IS NOT NULL THEN
    UPDATE public.donations
    SET veteran_id = v_nick
    WHERE id = v_donation_id;

    INSERT INTO public.sponsorships (donor_id, veteran_id, amount_committed, is_recurring, status, started_at)
    VALUES (v_jake, v_nick, v_amount, false, 'active', now())
    ON CONFLICT (donor_id, veteran_id)
    DO UPDATE SET amount_committed = public.sponsorships.amount_committed + EXCLUDED.amount_committed;

    PERFORM public.increment_veteran_raised(v_nick, v_amount);
  END IF;
END $$;
/*
  # Create email_logs table

  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key)
      - `email_type` (text) - type of email (contact, application, donation)
      - `recipient` (text) - email address the message was sent to
      - `subject` (text) - subject line
      - `status` (text) - 'sent' or 'failed'
      - `error_message` (text, nullable) - captured error if sending failed
      - `metadata` (jsonb) - additional context (donor name, amount, payment id, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `email_logs`
    - Only admins (rows in admin_users matching auth.uid()) can SELECT
    - No public insert/update/delete policies (service role bypasses RLS for inserts)
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type text NOT NULL DEFAULT '',
  recipient text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON email_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS email_logs_type_idx ON email_logs (email_type);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'email_logs' AND policyname = 'Admins can view email logs'
  ) THEN
    CREATE POLICY "Admins can view email logs"
      ON email_logs
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;
END $$;
/*
  # Hero Portal Journey Updates System

  1. Schema Changes
    - Add `user_id` column to `veterans` (nullable) so a hero auth account can be linked to their veteran profile
    - Add `email` column to `veterans` (nullable) used to claim invites

  2. New Tables
    - `hero_updates`
      - Rich-text journey posts authored either by the hero themselves or by an admin on their behalf
      - Hero-authored posts require moderation (status pending_review), admin posts publish directly
      - Fields: id, veteran_id, author_id, author_role, title, body, update_type, visibility, status,
                moderation_notes, submitted_at, reviewed_by, reviewed_at, published_at, created_at, updated_at
    - `hero_update_media`
      - Images and videos attached to updates (admin-created or admin-added to hero submissions)
      - Fields: id, update_id, media_type, storage_path, external_url, caption, display_order, created_at
    - `hero_invites`
      - One-time invite tokens emailed to heroes so they can register and be linked to their veteran row
      - Fields: id, token, veteran_id, email, expires_at, used_at, created_by, created_at
    - `hero_update_views`
      - Tracks which donors have read which updates
      - Fields: id, update_id, donor_id, viewed_at

  3. Storage
    - Create `hero-media` public bucket for journey images/videos

  4. Security (RLS)
    - Heroes can create drafts / submit updates but status is forced to pending_review when they submit
    - Heroes can read/edit only their own updates while they are in draft or rejected status
    - Admins can read/update all rows and publish
    - Donors/public can only read published updates for veterans they have donated to (or public visibility)
    - Public can read published updates with visibility = 'public'
*/

-- Link heroes to auth accounts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veterans' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE veterans ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_veterans_user_id ON veterans(user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veterans' AND column_name = 'email'
  ) THEN
    ALTER TABLE veterans ADD COLUMN email text;
  END IF;
END $$;

-- hero_updates
CREATE TABLE IF NOT EXISTS hero_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  veteran_id uuid NOT NULL REFERENCES veterans(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_role text NOT NULL DEFAULT 'hero' CHECK (author_role IN ('hero', 'admin')),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  update_type text NOT NULL DEFAULT 'general' CHECK (update_type IN ('general', 'milestone', 'training', 'gratitude', 'achievement')),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'sponsors_only', 'donors_only')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'published')),
  moderation_notes text NOT NULL DEFAULT '',
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_updates_veteran ON hero_updates(veteran_id);
CREATE INDEX IF NOT EXISTS idx_hero_updates_status ON hero_updates(status);
CREATE INDEX IF NOT EXISTS idx_hero_updates_author ON hero_updates(author_id);
CREATE INDEX IF NOT EXISTS idx_hero_updates_published_at ON hero_updates(published_at);

ALTER TABLE hero_updates ENABLE ROW LEVEL SECURITY;

-- Heroes can view their own updates
CREATE POLICY "Heroes view own updates"
  ON hero_updates FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM veterans v
      WHERE v.id = hero_updates.veteran_id AND v.user_id = (select auth.uid())
    )
  );

-- Admins can view all updates
CREATE POLICY "Admins view all updates"
  ON hero_updates FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid()))
  );

-- Donors can view published updates for veterans they have donated to
CREATE POLICY "Donors view published updates for donated veterans"
  ON hero_updates FOR SELECT TO authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM donations d
      WHERE d.donor_id = (select auth.uid())
        AND d.veteran_id = hero_updates.veteran_id
        AND d.status = 'succeeded'
    )
  );

-- Public can view published updates with public visibility
CREATE POLICY "Public view public published updates"
  ON hero_updates FOR SELECT TO anon, authenticated
  USING (status = 'published' AND visibility = 'public');

-- Heroes can insert updates (must belong to them; must be draft or pending_review)
CREATE POLICY "Heroes insert own updates"
  ON hero_updates FOR INSERT TO authenticated
  WITH CHECK (
    author_id = (select auth.uid())
    AND author_role = 'hero'
    AND status IN ('draft', 'pending_review')
    AND EXISTS (
      SELECT 1 FROM veterans v
      WHERE v.id = hero_updates.veteran_id AND v.user_id = (select auth.uid())
    )
  );

-- Admins can insert updates on behalf of heroes
CREATE POLICY "Admins insert updates"
  ON hero_updates FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid()))
  );

-- Heroes can update only their own drafts or rejected items, cannot set status to published/approved
CREATE POLICY "Heroes update own drafts"
  ON hero_updates FOR UPDATE TO authenticated
  USING (
    author_id = (select auth.uid())
    AND author_role = 'hero'
    AND status IN ('draft', 'rejected', 'pending_review')
  )
  WITH CHECK (
    author_id = (select auth.uid())
    AND author_role = 'hero'
    AND status IN ('draft', 'pending_review')
  );

-- Admins can update any update
CREATE POLICY "Admins update any update"
  ON hero_updates FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));

-- Heroes can delete their own drafts
CREATE POLICY "Heroes delete own drafts"
  ON hero_updates FOR DELETE TO authenticated
  USING (
    author_id = (select auth.uid())
    AND author_role = 'hero'
    AND status IN ('draft', 'rejected')
  );

-- Admins can delete any update
CREATE POLICY "Admins delete any update"
  ON hero_updates FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));

-- hero_update_media
CREATE TABLE IF NOT EXISTS hero_update_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL REFERENCES hero_updates(id) ON DELETE CASCADE,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'embed')),
  storage_path text NOT NULL DEFAULT '',
  external_url text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_update_media_update ON hero_update_media(update_id);

ALTER TABLE hero_update_media ENABLE ROW LEVEL SECURITY;

-- Anyone who can see the parent update can see the media
CREATE POLICY "Media visible when parent update visible to user"
  ON hero_update_media FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hero_updates hu
      WHERE hu.id = hero_update_media.update_id
        AND (
          (hu.status = 'published' AND hu.visibility = 'public')
          OR EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid()))
          OR EXISTS (
            SELECT 1 FROM veterans v
            WHERE v.id = hu.veteran_id AND v.user_id = (select auth.uid())
          )
          OR (
            hu.status = 'published'
            AND EXISTS (
              SELECT 1 FROM donations d
              WHERE d.donor_id = (select auth.uid())
                AND d.veteran_id = hu.veteran_id
                AND d.status = 'succeeded'
            )
          )
        )
    )
  );

-- Only admins can insert/update/delete media
CREATE POLICY "Admins manage media insert"
  ON hero_update_media FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));
CREATE POLICY "Admins manage media update"
  ON hero_update_media FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));
CREATE POLICY "Admins manage media delete"
  ON hero_update_media FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));

-- hero_invites
CREATE TABLE IF NOT EXISTS hero_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  veteran_id uuid NOT NULL REFERENCES veterans(id) ON DELETE CASCADE,
  email text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  used_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_invites_token ON hero_invites(token);
CREATE INDEX IF NOT EXISTS idx_hero_invites_veteran ON hero_invites(veteran_id);

ALTER TABLE hero_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view invites"
  ON hero_invites FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));
CREATE POLICY "Admins create invites"
  ON hero_invites FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));
CREATE POLICY "Admins update invites"
  ON hero_invites FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));
CREATE POLICY "Admins delete invites"
  ON hero_invites FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = (select auth.uid())));

-- hero_update_views
CREATE TABLE IF NOT EXISTS hero_update_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL REFERENCES hero_updates(id) ON DELETE CASCADE,
  donor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (update_id, donor_id)
);

CREATE INDEX IF NOT EXISTS idx_hero_update_views_donor ON hero_update_views(donor_id);

ALTER TABLE hero_update_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors view own view records"
  ON hero_update_views FOR SELECT TO authenticated
  USING (donor_id = (select auth.uid()));
CREATE POLICY "Donors insert own views"
  ON hero_update_views FOR INSERT TO authenticated
  WITH CHECK (donor_id = (select auth.uid()));

-- Storage bucket for hero media
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads of hero-media bucket objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read hero-media'
  ) THEN
    CREATE POLICY "Public read hero-media"
      ON storage.objects FOR SELECT TO anon, authenticated
      USING (bucket_id = 'hero-media');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins upload hero-media'
  ) THEN
    CREATE POLICY "Admins upload hero-media"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (
        bucket_id = 'hero-media'
        AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = (select auth.uid()))
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins update hero-media'
  ) THEN
    CREATE POLICY "Admins update hero-media"
      ON storage.objects FOR UPDATE TO authenticated
      USING (
        bucket_id = 'hero-media'
        AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = (select auth.uid()))
      )
      WITH CHECK (
        bucket_id = 'hero-media'
        AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = (select auth.uid()))
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins delete hero-media'
  ) THEN
    CREATE POLICY "Admins delete hero-media"
      ON storage.objects FOR DELETE TO authenticated
      USING (
        bucket_id = 'hero-media'
        AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = (select auth.uid()))
      );
  END IF;
END $$;
/*
  # Admin access to donors and donations

  1. Security
    - Add SELECT policy on `donors` so admins can view all donor records
    - Add SELECT policy on `donations` so admins can view all donation records

  2. Notes
    - Uses existing `is_admin()` helper function
    - Does not change existing owner-based policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'donors' AND policyname = 'Admins can view all donors'
  ) THEN
    CREATE POLICY "Admins can view all donors"
      ON donors FOR SELECT
      TO authenticated
      USING ((SELECT is_admin()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'donations' AND policyname = 'Admins can view all donations'
  ) THEN
    CREATE POLICY "Admins can view all donations"
      ON donations FOR SELECT
      TO authenticated
      USING ((SELECT is_admin()));
  END IF;
END $$;/*
  # Add city and state to veteran applications

  1. Changes
    - Adds `city` (text) column to `veteran_applications` for applicant's city
    - Adds `state` (text) column to `veteran_applications` for applicant's state

  2. Notes
    - Both columns default to empty string so existing rows remain valid
    - Safe to run multiple times
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veteran_applications' AND column_name = 'city'
  ) THEN
    ALTER TABLE veteran_applications ADD COLUMN city text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'veteran_applications' AND column_name = 'state'
  ) THEN
    ALTER TABLE veteran_applications ADD COLUMN state text DEFAULT '' NOT NULL;
  END IF;
END $$;/*
  # Raise hero-media bucket file size limit and allow video mime types

  1. Changes
    - Update the `hero-media` storage bucket to allow files up to 200MB
    - Explicitly allow common image and video mime types so video uploads
      (e.g., MP4, MOV, WebM) succeed from the admin journey editor.

  2. Notes
    - This only affects the storage bucket settings. No data is lost.
    - Existing upload RLS policies (admin-only insert) remain unchanged.
*/

UPDATE storage.buckets
SET
  file_size_limit = 209715200,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
    'video/ogg'
  ]
WHERE id = 'hero-media';

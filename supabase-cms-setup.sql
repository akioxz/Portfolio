-- ==========================================
-- DEV-LIBRARY HEADLESS CMS MIGRATION
-- ==========================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  eyebrow text NOT NULL,
  status text,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  image text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  role text NOT NULL,
  project text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Policies
CREATE POLICY "Allow public read access on projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on experience"
  ON public.experience
  FOR SELECT
  TO public
  USING (true);

-- 5. Insert Initial Data (Projects)
INSERT INTO public.projects (name, eyebrow, status, description, tags, specs, sort_order)
VALUES 
(
  'Atelier Carven',
  'FULL-STACK E-COMMERCE',
  null,
  'A luxury furniture e-commerce platform designed with an emphasis on minimalist aesthetics and seamless purchasing flows. Features a role-based architecture separating the customer storefront from a comprehensive admin dashboard. Powered by a Supabase RLS-secured data layer ensuring strict spec-compliance and data integrity across all user boundaries.',
  ARRAY['React Native', 'Expo', 'TypeScript', 'Supabase'],
  '[{"label": "Role", "value": "Full-Stack Dev"}, {"label": "Timeline", "value": "6 Weeks"}, {"label": "Platform", "value": "iOS / Android"}]'::jsonb,
  1
),
(
  'Quorin',
  'INVENTORY MANAGEMENT',
  null,
  'A robust PC parts e-commerce and inventory platform built for high-performance filtering and specification comparisons. Includes a dedicated category-based catalog, real-time stock synchronization, and a role-based admin suite for managing products. Backed by a high-availability Supabase database and Zustand for localized state management.',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'Zustand'],
  '[{"label": "Role", "value": "Frontend Lead"}, {"label": "Timeline", "value": "4 Weeks"}, {"label": "Platform", "value": "Web App"}]'::jsonb,
  2
);

-- 6. Insert Initial Data (Experience)
INSERT INTO public.experience (year, role, project, subtitle, description, tags, sort_order)
VALUES 
(
  '2026',
  'Full-Stack Developer',
  'Reson8',
  'Multi-System Podcast Platform',
  'Independently architected and built a 4-tier podcast platform spanning Next.js (admin), Vue 3 (public), PHP (editor), and Express.js (API). Implemented JWT auth, RESTful API design, and security middleware (CORS, Helmet, rate limiting, CSRF protection).',
  ARRAY['Next.js', 'Vue 3', 'PHP', 'Express.js', 'JWT'],
  1
),
(
  '2026',
  'Backend & Data Engineer',
  'SCSAGA',
  'Smart Campus Student Attendance & Gate Analytics',
  'Independently built a Flask-based analytics system integrated with Google BigQuery/GCP for real-time campus attendance and gate crowd-status tracking. Automated recurring data jobs via Windows Task Scheduler; designed crowd-status threshold logic and Looker Studio dashboards for stakeholders.',
  ARRAY['Flask', 'BigQuery', 'GCP', 'Looker Studio'],
  2
),
(
  '2026',
  'Data & BI Engineer',
  'Water Station Dashboard',
  'Sales Dashboard & ETL Pipeline',
  'Independently designed and implemented an ETL pipeline ingesting CSV sales data into Google BigQuery. Built unified SQL views to consolidate walk-in and delivery channels; developed a Looker Studio dashboard for real-time business reporting.',
  ARRAY['BigQuery', 'SQL', 'ETL', 'Looker Studio'],
  3
);

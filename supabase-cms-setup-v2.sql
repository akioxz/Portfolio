-- Full CMS Expansion: Certifications and Stack
-- Run this in the Supabase SQL Editor

-- 1. Create certifications table
CREATE TABLE certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  link text,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
CREATE POLICY "Allow public read-only access to certifications" ON certifications
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to certifications" ON certifications
  FOR ALL USING (auth.role() = 'service_role');


-- 2. Create stack table (Tech Stack / Skills)
CREATE TABLE stack (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL, -- e.g., 'Frontend', 'Backend', 'Tools', 'Database'
  icon text, -- Optional icon component name or URL
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE stack ENABLE ROW LEVEL SECURITY;

-- Create policies for stack
CREATE POLICY "Allow public read-only access to stack" ON stack
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to stack" ON stack
  FOR ALL USING (auth.role() = 'service_role');

-- 3. Insert initial placeholder data
INSERT INTO certifications (name, issuer, date, sort_order) VALUES
  ('AWS Certified Solutions Architect', 'Amazon Web Services', 'Aug 2024', 0),
  ('Meta Front-End Developer', 'Coursera', 'Jan 2024', 1);

INSERT INTO stack (name, category, sort_order) VALUES
  ('React', 'Frontend', 0),
  ('Next.js', 'Frontend', 1),
  ('TypeScript', 'Language', 2),
  ('Node.js', 'Backend', 3),
  ('Supabase', 'Backend', 4),
  ('Tailwind CSS', 'Frontend', 5);

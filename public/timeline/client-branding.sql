-- Client Branding Table
CREATE TABLE client_branding (
  client_id TEXT REFERENCES clients(id) PRIMARY KEY,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1976d2',
  secondary_color TEXT DEFAULT '#f57c00',
  accent_color TEXT DEFAULT '#388e3c',
  header_bg_color TEXT DEFAULT '#ffffff',
  custom_css TEXT,
  company_name TEXT,
  custom_domain TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles Table for Role-Based Access
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'project_lead', 'school_viewer')) NOT NULL,
  client_id TEXT REFERENCES clients(id),
  school_id TEXT REFERENCES schools(id),
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_client_id ON user_profiles(client_id);
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);

-- Enable Row Level Security
ALTER TABLE client_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for client_branding
CREATE POLICY "Enable read access for all users" ON client_branding
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for super admins" ON client_branding
  FOR INSERT WITH CHECK (true); -- You'll want to add proper auth checks

CREATE POLICY "Enable update for super admins and project leads" ON client_branding
  FOR UPDATE USING (true); -- You'll want to add proper auth checks

-- Policies for user_profiles
CREATE POLICY "Enable read access for all users" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable all operations for super admins" ON user_profiles
  FOR ALL USING (true); -- You'll want to add proper auth checks

-- Sample data for E-ACT branding
INSERT INTO client_branding (client_id, logo_url, primary_color, secondary_color, company_name)
VALUES (
  'client-1752835894451', -- Update with your actual E-ACT client ID
  'https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  '#1976d2',
  '#f57c00',
  'E-ACT Multi Academy Trust'
); 
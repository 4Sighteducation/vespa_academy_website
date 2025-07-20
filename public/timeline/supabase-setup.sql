-- VESPA Timeline Database Schema for Supabase

-- Create clients table
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  project TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

-- Create milestones table
CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phase TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT,
  progress INTEGER DEFAULT 0,
  description TEXT,
  vespa_deliverables TEXT[],
  school_deliverables TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create school_progress table (for E-ACT type clients)
CREATE TABLE school_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  school_id TEXT,
  milestone_id TEXT,
  status TEXT DEFAULT 'not-started',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_milestones_client_id ON milestones(client_id);
CREATE INDEX idx_school_progress_client_id ON school_progress(client_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
CREATE POLICY "Enable read access for all users" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON clients
  FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON milestones
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON milestones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON milestones
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON milestones
  FOR DELETE USING (true); 
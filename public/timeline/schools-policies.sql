-- Enable Row Level Security for schools tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_milestone_progress ENABLE ROW LEVEL SECURITY;

-- Policies for schools table
CREATE POLICY "Enable read access for all users" ON schools
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON schools
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON schools
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON schools
  FOR DELETE USING (true);

-- Policies for school_contacts table
CREATE POLICY "Enable read access for all users" ON school_contacts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON school_contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON school_contacts
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON school_contacts
  FOR DELETE USING (true);

-- Policies for school_milestone_progress table
CREATE POLICY "Enable read access for all users" ON school_milestone_progress
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON school_milestone_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON school_milestone_progress
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON school_milestone_progress
  FOR DELETE USING (true); 
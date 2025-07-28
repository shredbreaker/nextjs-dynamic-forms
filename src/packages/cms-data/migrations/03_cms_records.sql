-- Record
CREATE TABLE cms_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES cms_domains(id) ON DELETE CASCADE ON UPDATE CASCADE,
  values_preview JSONB DEFAULT NULL,
  meta JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_cms_records_domain_id ON cms_records(domain_id);
CREATE INDEX idx_cms_records_creator_id ON cms_records(creator_id);
ALTER TABLE cms_records DISABLE ROW LEVEL SECURITY;

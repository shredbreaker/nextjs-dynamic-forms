CREATE TABLE cms_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB DEFAULT NULL,
  description JSONB DEFAULT NULL,
  code VARCHAR(50) UNIQUE DEFAULT NULL, -- Unique identifier to use in code conditions
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta JSONB DEFAULT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,  -- Soft delete
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_cms_domains_creator_id ON cms_domains(creator_id);
CREATE INDEX idx_cms_domains_deleted_at ON cms_domains(deleted_at);
CREATE INDEX idx_cms_domains_is_active ON cms_domains(is_active);
CREATE INDEX idx_cms_domains_display_order ON cms_domains(display_order);
ALTER TABLE cms_domains DISABLE ROW LEVEL SECURITY;


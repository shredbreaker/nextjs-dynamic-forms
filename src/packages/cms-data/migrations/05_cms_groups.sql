CREATE TABLE cms_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES cms_domains(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name JSONB DEFAULT NULL,
  code VARCHAR(50) DEFAULT NULL,  -- Unique identifier per domain to use in code conditions
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  meta JSONB DEFAULT NULL,
  UNIQUE(domain_id, code)
);

CREATE INDEX idx_cms_groups_creator_id ON cms_groups(creator_id);
CREATE INDEX idx_cms_groups_domain_id ON cms_groups(domain_id);
CREATE INDEX idx_cms_groups_is_active ON cms_groups(is_active);
CREATE INDEX idx_cms_groups_display_order ON cms_groups(display_order);

ALTER TABLE cms_groups DISABLE ROW LEVEL SECURITY;

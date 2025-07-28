CREATE TABLE cms_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES cms_domains(id) ON DELETE CASCADE ON UPDATE CASCADE,
  group_id UUID DEFAULT NULL REFERENCES cms_groups(id) ON DELETE SET NULL ON UPDATE CASCADE,
  name JSONB DEFAULT NULL,
  description JSONB DEFAULT NULL,
  code VARCHAR(50) DEFAULT NULL,  -- Unique identifier per domain to use in code conditions
  is_locked BOOLEAN NOT NULL DEFAULT false,
  type VARCHAR(50) NOT NULL,  -- option | bool | num | text | size | etc.
  meta JSONB DEFAULT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE(domain_id, code)
);

CREATE INDEX idx_cms_properties_creator_id ON cms_properties(creator_id);
CREATE INDEX idx_cms_properties_domain_id ON cms_properties(domain_id);
CREATE INDEX idx_cms_properties_group_id ON cms_properties(group_id);
ALTER TABLE cms_properties DISABLE ROW LEVEL SECURITY;

-- Extended properties (options)
CREATE TABLE cms_property_options (
  option_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES cms_properties(id) ON DELETE CASCADE ON UPDATE CASCADE,
  code VARCHAR(50) DEFAULT NULL,  -- Unique identifier per domain to use in code conditions
  name JSONB DEFAULT NULL,
  display_order INT NOT NULL DEFAULT 0
);
ALTER TABLE cms_property_options DISABLE ROW LEVEL SECURITY;
CREATE INDEX idx_cms_property_options_property_id ON cms_property_options(property_id);


-- View for easier selection of all options for properties by domain
DROP VIEW IF EXISTS cms_domain_property_options;
CREATE VIEW cms_domain_property_options AS
SELECT 
  p.domain_id,
  t.property_id,
  t.option_id,
  t.name,
  t.code,
  t.display_order
FROM cms_properties p
INNER JOIN cms_property_options t ON p.id = t.property_id
ORDER BY t.display_order ASC;


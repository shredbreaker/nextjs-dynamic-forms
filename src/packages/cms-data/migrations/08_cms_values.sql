CREATE TABLE cms_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES cms_properties(id) ON DELETE CASCADE ON UPDATE CASCADE,
  record_id UUID NOT NULL REFERENCES cms_records(id) ON DELETE CASCADE ON UPDATE CASCADE,
  value_text JSONB DEFAULT NULL,
  value_bool BOOLEAN DEFAULT NULL, -- For bool
  value_number NUMERIC DEFAULT NULL, -- For int, float, size (sqm), price (raw/base currency)
  value_data JSONB DEFAULT NULL, -- Presentation (unit, currency, text, options, images, location)
  value_uuids UUID[] DEFAULT NULL, -- For options
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE(property_id, record_id)
);

-- Indexes
CREATE INDEX idx_cms_values_property_id ON cms_values(property_id);
CREATE INDEX idx_cms_values_record_id ON cms_values(record_id);
CREATE INDEX idx_cms_values_value_bool ON cms_values(value_bool);
CREATE INDEX idx_cms_values_value_number ON cms_values(value_number);
CREATE INDEX idx_cms_values_value_uuids ON cms_values USING GIN (value_uuids);

ALTER TABLE cms_values DISABLE ROW LEVEL SECURITY;

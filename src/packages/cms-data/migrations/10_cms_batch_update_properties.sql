-- Simple batch update function for properties and options
DROP FUNCTION IF EXISTS update_properties_batch;
CREATE OR REPLACE FUNCTION update_properties_batch(
  p_domain_id uuid,
  properties jsonb,
  all_options jsonb,
  deleted_properties jsonb DEFAULT '[]',
  deleted_options jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  id_mapping jsonb;
BEGIN
  -- Step 1: Handle properties (clean)
  SELECT upsert_properties_batch(p_domain_id, properties, deleted_properties) INTO id_mapping;
  
  -- Step 2: Handle options with simple mapping
  PERFORM upsert_options_batch_with_mapping(all_options, id_mapping, deleted_options);
  
  RETURN id_mapping;
END;
$$ LANGUAGE plpgsql;

-- Simple properties function
DROP FUNCTION IF EXISTS upsert_properties_batch;
CREATE OR REPLACE FUNCTION upsert_properties_batch(
  p_domain_id uuid,
  properties jsonb,
  deleted_property_ids jsonb DEFAULT '[]'
) RETURNS jsonb AS $$
DECLARE
  id_mapping jsonb := '{}';
BEGIN
  -- Delete properties first
  IF jsonb_array_length(deleted_property_ids) > 0 THEN
    DELETE FROM cms_properties WHERE id = ANY(
      SELECT (jsonb_array_elements_text(deleted_property_ids))::uuid
    ) AND domain_id = p_domain_id;
  END IF;

  -- Upsert properties
  INSERT INTO cms_properties (
    id, domain_id, group_id, name, description, code, is_locked, type, meta,
    display_order, is_required, is_private, creator_id
  )
  SELECT 
    CASE WHEN (prop ->> 'is_new')::boolean THEN gen_random_uuid()
         ELSE (prop ->> 'id')::uuid END as id,
    p_domain_id,
    NULLIF(prop ->> 'group_id', '')::uuid,
    CASE WHEN prop -> 'name' = 'null' THEN NULL ELSE prop -> 'name' END,
    CASE WHEN prop -> 'description' = 'null' THEN NULL ELSE prop -> 'description' END,
    NULLIF(prop ->> 'code', ''),
    COALESCE((prop ->> 'is_locked')::boolean, false),
    prop ->> 'type',
    CASE WHEN prop -> 'meta' = 'null' THEN NULL ELSE prop -> 'meta' END,
    COALESCE((prop ->> 'display_order')::integer, 0),
    COALESCE((prop ->> 'is_required')::boolean, false),
    COALESCE((prop ->> 'is_private')::boolean, false),
    (prop ->> 'creator_id')::uuid
  FROM jsonb_array_elements(properties) AS prop
  ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    code = EXCLUDED.code,
    is_locked = EXCLUDED.is_locked,
    type = EXCLUDED.type,
    meta = EXCLUDED.meta,
    display_order = EXCLUDED.display_order,
    is_required = EXCLUDED.is_required,
    is_private = EXCLUDED.is_private;

  RETURN id_mapping;
END;
$$ LANGUAGE plpgsql;

-- Simple options function with mapping
DROP FUNCTION IF EXISTS upsert_options_batch_with_mapping;
CREATE OR REPLACE FUNCTION upsert_options_batch_with_mapping(
  all_options jsonb,
  id_mapping jsonb,
  deleted_option_ids jsonb DEFAULT '[]'
) RETURNS void AS $$
BEGIN
  -- Delete options first
  IF jsonb_array_length(deleted_option_ids) > 0 THEN
    DELETE FROM cms_property_options WHERE option_id = ANY(
      SELECT (jsonb_array_elements_text(deleted_option_ids))::uuid
    );
  END IF;

  -- Upsert options
  INSERT INTO cms_property_options (option_id, property_id, name, display_order)
  SELECT 
    CASE WHEN (option ->> 'is_new')::boolean THEN gen_random_uuid()
         ELSE (option ->> 'option_id')::uuid END,
    -- Simple mapping lookup
    COALESCE(
      (id_mapping ->> (option ->> 'property_id'))::uuid,  -- Use mapped ID
      (option ->> 'property_id')::uuid                    -- Or original
    ) as property_id,
    CASE WHEN option -> 'name' = 'null' THEN NULL ELSE option -> 'name' END,
    COALESCE((option ->> 'display_order')::integer, 0)
  FROM jsonb_array_elements(all_options) AS option
  ON CONFLICT (option_id) DO UPDATE SET 
    name = EXCLUDED.name,
    property_id = EXCLUDED.property_id,
    display_order = EXCLUDED.display_order;
END;
$$ LANGUAGE plpgsql; 
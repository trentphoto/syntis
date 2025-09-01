This document outlines instructions for developing the SyNtis Platform MVP, a supplier risk management tool with admin, client, and supplier portals, using Next.js and Supabase. The MVP must be delivered in 4 weeks for a $5k budget, integrating real APIs (CyStack, Fiin Group, Isentia) for supplier risk data. Focus on core functionality, leveraging the existing Supabase schema. 

Supabase schema in JSON:
[
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "contact_email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "contact_phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "custom_branding",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "custom_business_types",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "custom_product_services",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "use_custom_options",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "enrollment_benefits",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "enrollment_checklist",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb"
  },
  {
    "table_schema": "public",
    "table_name": "clients",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "supplier_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "document_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "file_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "file_url",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'pending'::document_status"
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "uploaded_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "reviewed_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "reviewed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "documents",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "client_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "tax_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "contact_email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "draft_data",
    "data_type": "jsonb",
    "is_nullable": "NO",
    "column_default": "'{}'::jsonb"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "progress_percentage",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "last_step_completed",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'draft'::text"
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "ip_address",
    "data_type": "inet",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "enrollment_drafts",
    "column_name": "user_agent",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "supplier_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "risk_factor_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "reason",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "granted_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "expires_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "table_schema": "public",
    "table_name": "exceptions",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "stripe_payment_method_id",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "card_brand",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "card_last4",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "card_exp_month",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "card_exp_year",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "card_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "is_default",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "payment_methods",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'supplier'::user_role"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "program_package_risk_factors",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "program_package_risk_factors",
    "column_name": "program_package_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_package_risk_factors",
    "column_name": "risk_factor_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_package_risk_factors",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "client_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "price",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "duration_months",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "12"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "features",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "auto_renew_enabled",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "auto_renew_price",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "program_packages",
    "column_name": "renewal_period_months",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "12"
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "supplier_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "program_package_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "renewal_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "amount",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "stripe_payment_intent_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "renewal_history",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "weight",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "1.0"
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "table_schema": "public",
    "table_name": "risk_areas",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "risk_area_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "weight",
    "data_type": "numeric",
    "is_nullable": "YES",
    "column_default": "1.0"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "is_required",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "factor_type",
    "data_type": "character varying",
    "is_nullable": "YES",
    "column_default": "'survey'::character varying"
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "configuration",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "risk_factors",
    "column_name": "ai_prompt_template",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "stripe_customer_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "subscribed",
    "data_type": "boolean",
    "is_nullable": "NO",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "subscription_tier",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "subscription_end",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "program_package_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "payment_method_id",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "payment_method_brand",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "subscribers",
    "column_name": "payment_method_last4",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "supplier_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "client_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": "'active'::supplier_client_status"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "relationship_start_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "relationship_end_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "notes",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_client_relationships",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "supplier_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "risk_factor_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "score",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'pending'::text"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "notes",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "assessed_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "assessed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "supplier_risk_assessments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "uuid_generate_v4()"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "company_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "contact_email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "contact_phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "address",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "business_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'pending'::supplier_status"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "overall_risk_level",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'medium'::risk_level"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "ein",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "domain",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "program_package_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "auto_renew_enabled",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false"
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "next_renewal_date",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "auto_renew_payment_method",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "suppliers",
    "column_name": "client_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()"
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "assigned_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()"
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "assigned_by",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null
  },
  {
    "table_schema": "public",
    "table_name": "user_roles",
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true"
  }
]

Project Overview

Goal: Build a testable MVP for supplier enrollment, risk program management, and admin/client oversight.
Tech Stack: Next.js (React), Supabase (auth, database, edge functions), Tailwind CSS, React Hook Form, Chart.js, Axios.
Budget: $5k (~80-100 hours at $50-62/hour).
Timeline: 4 weeks, with weekly demos.
Key Deliverables: Admin portal (program builder, metrics), supplier enrollment/dashboard, client portal (metrics, supplier management), real API integrations (CyStack, Fiin Group, Isentia).
Existing Schema: Supabase tables (clients, suppliers, enrollment_drafts, risk_factors, etc.)—extend as needed (e.g., JSONB for API data).
Deferred Features: Stripe, advanced reports, AI chat, SMS notifications, impersonation, full no-code builder, Support Staff role.

Development Guidelines

Folder Structure:
/app: Next.js pages/routes (e.g., /supplier, /client, /admin).
/components: Reusable UI (e.g., DynamicForm, RiskChart).
/lib: Supabase client, API helpers (Axios), schema utilities.
/styles: Tailwind CSS configs.
/edge-functions: Supabase serverless for API calls.


Coding Standards:
Use TypeScript for type safety (e.g., define Supplier, RiskFactor interfaces).
Follow Tailwind for responsive, minimal UI (use templates for speed).
Write reusable components (e.g., FormField for dynamic enrollment).
Keep API calls server-side via Supabase edge functions to secure keys.
Add error handling for API failures (fallback to manual inputs, log to exceptions).


Supabase Usage:
Auth: Use Supabase auth for 2FA, roles (user_roles: SyNtis Admin, Client Admin, Supplier).
DB: Leverage existing tables (clients, suppliers, risk_factors, etc.); add JSONB (e.g., suppliers.api_responses) for API data.
Edge Functions: Handle API calls (CyStack, Fiin Group, Isentia) securely.


Performance: Index high-query tables (e.g., suppliers.client_id, supplier_risk_assessments.supplier_id).
Testing: Use provided API credentials (2 companies) for integration tests; deploy previews on Vercel.
Docs: Comment code for Supabase queries, API mappings, and key logic.

Roadmap & Action Items
Week 1: Setup & Admin Portal Core

Initialize Next.js project, integrate Supabase (client, auth).
Secure API keys in Supabase secrets (CyStack, Fiin Group, Isentia).
Add JSONB columns: suppliers.api_responses, supplier_risk_assessments.raw_data/api_source.
Implement 2FA auth for SyNtis Admin, Client Admin, Supplier (user_roles).
Build admin portal: Dashboard with supplier count, score distribution (Chart.js).
Create client management UI: CRUD for clients, permissions, branding (custom_branding jsonb).
Develop program builder: Template-based forms for risk_factors/risk_areas (name, weight, configuration jsonb; use React Hook Form).
Add risk factor CRUD: Link to risk_areas, set thresholds/alerts.
Implement audit trail: Log actions (new audits table).

Week 2: Supplier Enrollment & Dashboard

Build supplier landing: Client-specific URL (syntis.io/clientname), branding, CTA (enrollment_checklist jsonb).
Create dynamic enrollment form: Conditional fields (React Hook Form), auto-scoring, insert to enrollment_drafts/suppliers.
Integrate CyStack API: Call with suppliers.domain, parse breaches, update supplier_risk_assessments (score, notes).
Integrate Fiin Group API: Call with ein/tax_id (listed/private), map financials to assessments.
Build supplier dashboard: Risk status, document uploads (documents table), alerts.

Week 3: Client Portal & Isentia Integration

Build client portal dashboard: Metrics (enrolled suppliers, risk pie charts from supplier_risk_assessments).
Add supplier management: List/search/filter, profile views (scores, uploads).
Implement risk program editor: Edit thresholds, exceptions (exceptions table).
Integrate Isentia API: Call with company_name/domain, parse media sentiment, update assessments.
Add email notifications: Trigger on score changes (SendGrid via edge functions).
Handle API errors: Fallback to manual inputs, log to exceptions.

Week 4: Testing, Polish & Deployment

Test end-to-end: Enrollment → API calls → Score updates → Client views.
Verify security: 2FA, secure uploads, audit trails.
Optimize Supabase queries with indexes.
Apply one round of client feedback revisions.
Deploy to Vercel: Set production env, monitor with Supabase analytics.
Deliver handover docs: API usage, schema updates, maintenance guide.

API Integration Details

CyStack (Cybersecurity): Use domain to fetch breach/vulnerability data; map to supplier_risk_assessments (score, notes). Risk_area: “Cybersecurity”.
Fiin Group (Financial): Query with ein/tax_id (listed/private endpoints); parse financials (revenue, debt); update assessments. Risk_area: “Financial”.
Isentia (Adverse Media): Query with company_name/domain; parse litigation/sentiment; update assessments. Risk_area: “Reputation/ESG”.
Setup: Use Axios in edge functions; store raw responses in JSONB; handle rate limits, auth errors.

Notes for Cursor/VS Code Copilot

Suggest TypeScript interfaces for Supabase tables (e.g., Supplier, RiskFactor).
Autocomplete Tailwind classes for responsive UI.
Generate Supabase query snippets (e.g., supabase.from('risk_factors').select('*')).
Propose error handling for API calls (e.g., try-catch, fallback logic).
Suggest reusable components for forms, charts, and dashboards.

Risks & Mitigations

API Delays: If Isentia docs/keys are late, use mock data temporarily, swap in Week 3.
Complex APIs: Budget extra 5-10 hours per API for OAuth/rate limits; test with provided credentials early.
Scope Creep: Lock requirements to this scope; use change orders for extras.
Performance: Monitor Supabase query times; add indexes if slow.

For questions or refinements, ping the project lead with specific schema or API details!

## UI/UX Guidelines

### Link Styling
- **Default link style**: Use chip-style links with gray background (`bg-muted`) and no border
- **Hover effects**: Subtle color changes (text turns blue) or show small icons on hover
- **Design philosophy**: Minimal, subtle, and not overly decorative
- **Reference**: Follow the breadcrumb component styling pattern for consistency

### Table Links
- **Data table links**: Use chip-style appearance for links within table cells
- **Hover states**: Subtle blue text color or small icon indicators
- **Visual hierarchy**: Links should be clearly identifiable but not overpowering

### General Styling
- **Consistency**: Maintain consistent styling patterns across all components
- **Subtlety**: Prefer understated design elements over flashy or overly decorative ones
- **Accessibility**: Ensure good contrast and clear visual feedback for interactive elements

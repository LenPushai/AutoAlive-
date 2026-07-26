


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."dealers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "province" "text" DEFAULT 'Gauteng'::"text" NOT NULL,
    "logo_url" "text",
    "operating_hours" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."dealers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_timeline" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "details" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lead_timeline" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "vehicle_id" "uuid",
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text",
    "phone" "text" NOT NULL,
    "source" "text" NOT NULL,
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "notes" "text",
    "assigned_to" "uuid",
    "lost_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "consent_given" boolean DEFAULT false NOT NULL,
    "consent_timestamp" timestamp with time zone,
    CONSTRAINT "leads_source_check" CHECK (("source" = ANY (ARRAY['website'::"text", 'autotrader'::"text", 'carscoza'::"text", 'facebook'::"text", 'tiktok'::"text", 'instagram'::"text", 'walkin'::"text", 'googleads'::"text", 'other'::"text"]))),
    CONSTRAINT "leads_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'contacted'::"text", 'test_drive'::"text", 'negotiating'::"text", 'won'::"text", 'lost'::"text"])))
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sale_verifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "sale_id" "uuid" NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "vehicle_id" "uuid" NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "inventory_marked" boolean DEFAULT false NOT NULL,
    "inventory_marked_at" timestamp with time zone,
    "inventory_marked_by" "uuid",
    "marketplace_delisted" boolean DEFAULT false NOT NULL,
    "marketplace_delisted_at" timestamp with time zone,
    "crm_closed" boolean DEFAULT false NOT NULL,
    "crm_closed_at" timestamp with time zone,
    "crm_closed_by" "uuid",
    "delivery_confirmed" boolean DEFAULT false NOT NULL,
    "delivery_confirmed_at" timestamp with time zone,
    "delivery_photo_url" "text",
    "delivery_checklist" "jsonb",
    "reconciled" boolean DEFAULT false NOT NULL,
    "reconciled_at" timestamp with time zone,
    "reconciled_by" "uuid",
    "anomaly_flags" "text"[] DEFAULT '{}'::"text"[],
    "billing_amount" numeric(10,2) DEFAULT 1000.00 NOT NULL,
    "invoice_generated" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sale_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sales" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "vehicle_id" "uuid" NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "sale_price" numeric(12,2) NOT NULL,
    "sale_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "salesperson_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "role" "text" NOT NULL,
    "phone" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'manager'::"text", 'salesperson'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vehicles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "make" "text" NOT NULL,
    "model" "text" NOT NULL,
    "variant" "text",
    "year" integer NOT NULL,
    "price" numeric(12,2) NOT NULL,
    "mileage" integer DEFAULT 0 NOT NULL,
    "fuel_type" "text" NOT NULL,
    "transmission" "text" NOT NULL,
    "colour" "text" NOT NULL,
    "body_type" "text",
    "engine_size" "text",
    "vin" "text",
    "registration" "text",
    "status" "text" DEFAULT 'available'::"text" NOT NULL,
    "description" "text",
    "features" "text"[] DEFAULT '{}'::"text"[],
    "images" "text"[] DEFAULT '{}'::"text"[],
    "thumbnail" "text",
    "is_featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "vehicles_fuel_type_check" CHECK (("fuel_type" = ANY (ARRAY['petrol'::"text", 'diesel'::"text", 'hybrid'::"text", 'electric'::"text"]))),
    CONSTRAINT "vehicles_status_check" CHECK (("status" = ANY (ARRAY['available'::"text", 'reserved'::"text", 'sold'::"text"]))),
    CONSTRAINT "vehicles_transmission_check" CHECK (("transmission" = ANY (ARRAY['manual'::"text", 'automatic'::"text"])))
);


ALTER TABLE "public"."vehicles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."dealers"
    ADD CONSTRAINT "dealers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dealers"
    ADD CONSTRAINT "dealers_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."lead_timeline"
    ADD CONSTRAINT "lead_timeline_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_lead_timeline_lead" ON "public"."lead_timeline" USING "btree" ("lead_id");



CREATE INDEX "idx_leads_dealer" ON "public"."leads" USING "btree" ("dealer_id");



CREATE INDEX "idx_leads_status" ON "public"."leads" USING "btree" ("status");



CREATE INDEX "idx_leads_vehicle" ON "public"."leads" USING "btree" ("vehicle_id");



CREATE INDEX "idx_sales_dealer" ON "public"."sales" USING "btree" ("dealer_id");



CREATE INDEX "idx_vehicles_dealer" ON "public"."vehicles" USING "btree" ("dealer_id");



CREATE INDEX "idx_vehicles_make_model" ON "public"."vehicles" USING "btree" ("make", "model");



CREATE INDEX "idx_vehicles_status" ON "public"."vehicles" USING "btree" ("status");



CREATE INDEX "idx_verifications_dealer" ON "public"."sale_verifications" USING "btree" ("dealer_id");



CREATE INDEX "idx_verifications_sale" ON "public"."sale_verifications" USING "btree" ("sale_id");



CREATE OR REPLACE TRIGGER "leads_updated_at" BEFORE UPDATE ON "public"."leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "sale_verifications_updated_at" BEFORE UPDATE ON "public"."sale_verifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "vehicles_updated_at" BEFORE UPDATE ON "public"."vehicles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."lead_timeline"
    ADD CONSTRAINT "lead_timeline_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."lead_timeline"
    ADD CONSTRAINT "lead_timeline_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_crm_closed_by_fkey" FOREIGN KEY ("crm_closed_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_inventory_marked_by_fkey" FOREIGN KEY ("inventory_marked_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_reconciled_by_fkey" FOREIGN KEY ("reconciled_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sale_verifications"
    ADD CONSTRAINT "sale_verifications_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_salesperson_id_fkey" FOREIGN KEY ("salesperson_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id");



CREATE POLICY "Allow public lead insert" ON "public"."leads" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Public and anon can read vehicles" ON "public"."vehicles" FOR SELECT USING (true);



CREATE POLICY "Public can read vehicles" ON "public"."vehicles" FOR SELECT USING (true);



CREATE POLICY "Public can submit enquiries" ON "public"."leads" FOR INSERT WITH CHECK (("source" = 'website'::"text"));



CREATE POLICY "Public can view available vehicles" ON "public"."vehicles" FOR SELECT USING (("status" = 'available'::"text"));



CREATE POLICY "Public can view dealers" ON "public"."dealers" FOR SELECT USING (true);



CREATE POLICY "Users read own row" ON "public"."users" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "Users see own dealer leads" ON "public"."leads" USING (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))) WITH CHECK (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "Users see own dealer sales" ON "public"."sales" USING (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))) WITH CHECK (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "Users see own dealer vehicles" ON "public"."vehicles" USING (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))) WITH CHECK (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



CREATE POLICY "Users see own dealer verifications" ON "public"."sale_verifications" USING (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"())))) WITH CHECK (("dealer_id" = ( SELECT "users"."dealer_id"
   FROM "public"."users"
  WHERE ("users"."id" = "auth"."uid"()))));



ALTER TABLE "public"."dealers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lead_timeline" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sale_verifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vehicles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."dealers" TO "anon";
GRANT ALL ON TABLE "public"."dealers" TO "authenticated";
GRANT ALL ON TABLE "public"."dealers" TO "service_role";



GRANT ALL ON TABLE "public"."lead_timeline" TO "anon";
GRANT ALL ON TABLE "public"."lead_timeline" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_timeline" TO "service_role";



GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";



GRANT ALL ON TABLE "public"."sale_verifications" TO "anon";
GRANT ALL ON TABLE "public"."sale_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."sale_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."sales" TO "anon";
GRANT ALL ON TABLE "public"."sales" TO "authenticated";
GRANT ALL ON TABLE "public"."sales" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."vehicles" TO "anon";
GRANT ALL ON TABLE "public"."vehicles" TO "authenticated";
GRANT ALL ON TABLE "public"."vehicles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































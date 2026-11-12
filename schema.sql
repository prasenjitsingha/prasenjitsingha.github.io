-- ==============================================================================
-- PRASENJIT SINGHA: PROFESSIONAL CONSULTING PLATFORM
-- DATABASE SCHEMA & ROW-LEVEL SECURITY POLICIES (SUPABASE / POSTGRESQL 15+)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerated Status Types
DO $$ BEGIN
    CREATE TYPE enquiry_status_type AS ENUM (
        'NEW',
        'UNDER_REVIEW',
        'IN_DISCUSSION',
        'PROPOSAL_SUBMITTED',
        'ENGAGED',
        'DECLINED',
        'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sector_category_type AS ENUM (
        'PUBLIC_HEALTH',
        'MATERNAL_CHILD_HEALTH',
        'MOBILE_MEDICAL_UNITS',
        'CSR_SCHOOL_DEVELOPMENT',
        'CHILD_WELFARE_PROTECTION',
        'WOMEN_EMPOWERMENT',
        'LIVELIHOOD_DEVELOPMENT',
        'FARMER_PRODUCER_ORGANISATIONS',
        'WASH_WATER_SANITATION',
        'RURAL_DEVELOPMENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- MODULE 1: PROFESSIONAL & GENERAL ENQUIRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.professional_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('ENQ-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    contact_person VARCHAR(150) NOT NULL,
    organisation VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    enquiry_category VARCHAR(100) NOT NULL DEFAULT 'General Advisory',
    project_description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    expected_timeline VARCHAR(100),
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 2: EXECUTIVE RECRUITER & LEADERSHIP ENQUIRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.recruiter_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('REC-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    recruiter_name VARCHAR(150) NOT NULL,
    company_or_foundation VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    target_role VARCHAR(150) NOT NULL,
    role_location VARCHAR(150),
    role_type VARCHAR(50) DEFAULT 'Full-Time Leadership',
    message TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT true,
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 3: CONSULTANCY ASSIGNMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consultancy_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('CON-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    client_name VARCHAR(200) NOT NULL,
    client_type VARCHAR(100) NOT NULL, -- Corporate CSR, International NGO, Trust, Govt Institution
    domain sector_category_type NOT NULL,
    scope_of_work TEXT NOT NULL,
    target_states TEXT[] NOT NULL,
    start_date DATE,
    end_date DATE,
    deliverables JSONB DEFAULT '[]'::jsonb,
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 4: CSR FUNDING & INSTITUTIONAL PARTNERSHIPS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.funding_partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('FND-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    contact_person VARCHAR(150) NOT NULL,
    organisation_name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(80) NOT NULL, -- Registered NGO, Section 8, Trust, FPO, Society
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    has_12a_80g_csr1 BOOLEAN DEFAULT false,
    annual_budget_range VARCHAR(100),
    focus_sector sector_category_type NOT NULL,
    target_geography VARCHAR(200) NOT NULL,
    proposal_concept_summary TEXT NOT NULL,
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 5: SOCIAL IMPACT ASSESSMENT (SIA) REQUESTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.impact_assessment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sia_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('SIA-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    commissioning_body VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    study_type VARCHAR(100) NOT NULL, -- Baseline, Midline, Endline, CSR Mandatory Impact Assessment, Third-Party Evaluation
    project_domain sector_category_type NOT NULL,
    geographic_states TEXT[] NOT NULL,
    target_districts VARCHAR(255),
    estimated_sample_size INTEGER,
    expected_timeline VARCHAR(100),
    tor_summary TEXT NOT NULL,
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 6: TECHNICAL WRITING & DPR REQUESTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.technical_writing_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('DOC-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    contact_person VARCHAR(150) NOT NULL,
    organisation VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    service_required VARCHAR(100) NOT NULL, -- Detailed Project Report, Theory of Change, LogFrame, CSR Proposal, SOP
    sector sector_category_type NOT NULL,
    deadline_date DATE,
    requirements_brief TEXT NOT NULL,
    status enquiry_status_type NOT NULL DEFAULT 'NEW',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 7: KNOWLEDGE CENTRE ARTICLES & INSIGHTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    read_time VARCHAR(20) DEFAULT '6 min read',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    author_name VARCHAR(100) DEFAULT 'Prasenjit Singha',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- "Ask Prasenjit" Community Questions Table
CREATE TABLE IF NOT EXISTS public.knowledge_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_code VARCHAR(32) UNIQUE NOT NULL DEFAULT ('ASK-' || UPPER(SUBSTRING(uuid_generate_v4()::text FROM 1 FOR 8))),
    inquirer_name VARCHAR(150) NOT NULL,
    inquirer_email VARCHAR(255) NOT NULL,
    inquirer_role VARCHAR(100), -- Student, NGO Leader, CSR Officer, Researcher
    topic_category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT,
    is_public BOOLEAN DEFAULT false,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 8: PROJECT PORTFOLIO & CASE STUDIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    sector sector_category_type NOT NULL,
    state VARCHAR(100) NOT NULL,
    districts VARCHAR(255),
    corporate_partner VARCHAR(200),
    implementing_body VARCHAR(200) DEFAULT 'Bandhan-Konnagar',
    my_role VARCHAR(150) NOT NULL,
    objectives TEXT NOT NULL,
    implementation_strategy TEXT NOT NULL,
    key_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    beneficiaries_reached INTEGER,
    featured BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- MODULE 9: PROFESSIONAL DOCUMENTS & DOWNLOAD LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.professional_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_title VARCHAR(200) NOT NULL,
    document_type VARCHAR(80) NOT NULL, -- Executive CV, Research Brief, Case Study Whitepaper
    file_path VARCHAR(255) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    file_size_bytes BIGINT,
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.document_download_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.professional_documents(id) ON DELETE CASCADE,
    downloader_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- AUTOMATED TIMESTAMP UPDATE TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT unnest(ARRAY[
            'professional_enquiries',
            'recruiter_enquiries',
            'consultancy_assignments',
            'funding_partnerships',
            'impact_assessment_requests',
            'technical_writing_requests',
            'knowledge_articles',
            'project_portfolio',
            'professional_documents'
        ])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_update_timestamp ON %I;', tbl);
        EXECUTE format('CREATE TRIGGER trg_update_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Public can ONLY insert intake enquiries.
-- Zero public reading of private client data.
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.professional_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultancy_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_assessment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_writing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_download_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Submission (INSERT) Policies
CREATE POLICY "Public can submit professional enquiries" 
    ON public.professional_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can submit recruiter enquiries" 
    ON public.recruiter_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can submit funding partnerships" 
    ON public.funding_partnerships FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can submit impact assessment requests" 
    ON public.impact_assessment_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can submit technical writing requests" 
    ON public.technical_writing_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can submit questions via Ask Prasenjit" 
    ON public.knowledge_queries FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can record document download logs" 
    ON public.document_download_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 2. Public Read Policies (Published Content Only)
CREATE POLICY "Public can read published articles" 
    ON public.knowledge_articles FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "Public can read answered community questions" 
    ON public.knowledge_queries FOR SELECT TO anon, authenticated USING (is_public = true);

CREATE POLICY "Public can read published project portfolio" 
    ON public.project_portfolio FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view active documents metadata" 
    ON public.professional_documents FOR SELECT TO anon, authenticated USING (is_active = true);

-- 3. Administrator Full Access Policies (Role-Based)
-- Note: Replace 'admin' with your Supabase custom claims or service role
CREATE POLICY "Admin full access on professional_enquiries" 
    ON public.professional_enquiries FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on recruiter_enquiries" 
    ON public.recruiter_enquiries FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on consultancy_assignments" 
    ON public.consultancy_assignments FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on funding_partnerships" 
    ON public.funding_partnerships FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on impact_assessment_requests" 
    ON public.impact_assessment_requests FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on technical_writing_requests" 
    ON public.technical_writing_requests FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on knowledge_articles" 
    ON public.knowledge_articles FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on project_portfolio" 
    ON public.project_portfolio FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');

CREATE POLICY "Admin full access on professional_documents" 
    ON public.professional_documents FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' = 'prasenjit.singhaniya@gmail.com');


PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  legal_name TEXT,
  hei_id TEXT,
  short_name TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  established INTEGER,
  domain TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  accent_color TEXT NOT NULL DEFAULT '#1b3668',
  naac_grade TEXT NOT NULL DEFAULT '',
  approvals TEXT NOT NULL DEFAULT '[]',
  rating REAL NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  students_enrolled TEXT NOT NULL DEFAULT '',
  placement_partners TEXT NOT NULL DEFAULT '[]',
  highlights TEXT NOT NULL DEFAULT '[]',
  about TEXT NOT NULL DEFAULT '',
  hiring_partner_count TEXT NOT NULL DEFAULT '',
  profile_depth TEXT NOT NULL DEFAULT 'directory' CHECK (profile_depth IN ('directory', 'complete')),
  verification_source_url TEXT,
  verification_academic_session TEXT,
  verified_at TEXT,
  next_review_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Masters',
  duration_years REAL NOT NULL DEFAULT 2,
  semesters INTEGER NOT NULL DEFAULT 4,
  eligibility TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  specialisations TEXT NOT NULL DEFAULT '[]',
  curriculum TEXT NOT NULL DEFAULT '[]',
  careers TEXT NOT NULL DEFAULT '[]',
  average_salary_lpa TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS university_programs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  university_slug TEXT NOT NULL REFERENCES universities(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  program_slug TEXT NOT NULL REFERENCES programs(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  total_fee INTEGER,
  per_semester_fee INTEGER,
  emi_per_month INTEGER,
  official_programme_name TEXT,
  delivery_mode TEXT NOT NULL DEFAULT 'ONLINE' CHECK (delivery_mode IN ('ONLINE', 'ODL')),
  academic_session TEXT,
  entitlement_status TEXT NOT NULL DEFAULT 'unverified' CHECK (entitlement_status IN ('verified', 'unverified', 'expired', 'no-admission', 'debarred')),
  entitlement_source_url TEXT,
  university_programme_url TEXT,
  official_application_url TEXT,
  verified_at TEXT,
  next_review_at TEXT,
  fees_verified INTEGER NOT NULL DEFAULT 0 CHECK (fees_verified IN (0, 1)),
  per_semester_fee_verified INTEGER NOT NULL DEFAULT 0 CHECK (per_semester_fee_verified IN (0, 1)),
  emi_per_month_verified INTEGER NOT NULL DEFAULT 0 CHECK (emi_per_month_verified IN (0, 1)),
  fee_source_url TEXT,
  fee_verified_at TEXT,
  fee_next_review_at TEXT,
  fee_components TEXT NOT NULL DEFAULT '{}',
  refund_policy_url TEXT,
  duration_years REAL,
  semesters INTEGER,
  eligibility TEXT,
  exam_mode TEXT,
  curriculum TEXT,
  scholarship_summary TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (university_slug, program_slug, delivery_mode, academic_session)
);

CREATE TABLE IF NOT EXISTS specialisations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  program_slug TEXT REFERENCES programs(slug) ON DELETE SET NULL ON UPDATE CASCADE,
  category TEXT,
  summary TEXT,
  skills TEXT NOT NULL DEFAULT '[]',
  career_directions TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS offering_specialisations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  offering_id TEXT NOT NULL REFERENCES university_programs(id) ON DELETE CASCADE,
  specialisation_id TEXT NOT NULL REFERENCES specialisations(id) ON DELETE CASCADE,
  university_label TEXT,
  availability_status TEXT NOT NULL DEFAULT 'unverified' CHECK (availability_status IN ('verified', 'unverified', 'withdrawn')),
  academic_session TEXT,
  source_url TEXT,
  verified_at TEXT,
  next_review_at TEXT,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (offering_id, specialisation_id, academic_session)
);

CREATE TABLE IF NOT EXISTS claim_evidence (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  rendered_claim TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  university_slug TEXT REFERENCES universities(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  program_slug TEXT REFERENCES programs(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  offering_id TEXT REFERENCES university_programs(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_date TEXT,
  academic_session TEXT,
  methodology TEXT,
  verified_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  university_slug TEXT,
  program_slug TEXT,
  source_path TEXT,
  message TEXT,
  contact_channels TEXT NOT NULL DEFAULT '[]',
  consent_given INTEGER NOT NULL CHECK (consent_given = 1),
  consent_version TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  share_with_university INTEGER NOT NULL DEFAULT 0 CHECK (share_with_university IN (0, 1)),
  university_share_consent_at TEXT,
  university_share_consent_version TEXT,
  university_share_consent_text TEXT,
  qualification TEXT,
  goal TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'enrolled', 'lost')),
  internal_notes TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lead_intake_rate_limits (
  bucket_hash TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_attempt_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS catalogue_import_batches (
  import_id TEXT PRIMARY KEY,
  dataset_id TEXT NOT NULL,
  merged_on TEXT,
  source_file_sha256 TEXT NOT NULL,
  import_status TEXT NOT NULL DEFAULT 'staging' CHECK (import_status IN ('staging', 'ready', 'failed')),
  statistics TEXT NOT NULL DEFAULT '{}',
  acceptance_invariants TEXT NOT NULL DEFAULT '{}',
  ready_at TEXT
);

CREATE TABLE IF NOT EXISTS catalogue_research_records (
  import_id TEXT NOT NULL REFERENCES catalogue_import_batches(import_id) ON DELETE CASCADE,
  course_row_id TEXT NOT NULL,
  canonical_university_slug TEXT,
  university_display_name TEXT NOT NULL,
  state_ut TEXT,
  course TEXT NOT NULL,
  specialisation TEXT,
  import_bucket TEXT NOT NULL,
  catalogue_candidate INTEGER NOT NULL DEFAULT 0,
  reference_session TEXT,
  checked_on TEXT,
  evidence_status TEXT,
  publication_ready TEXT,
  catalogue_evidence_url TEXT,
  programme_source_url_current TEXT,
  fee_source_url TEXT,
  full_course_fee_inr REAL,
  fee_evidence_status TEXT,
  raw_record TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (import_id, course_row_id)
);

CREATE INDEX IF NOT EXISTS universities_public_idx ON universities (published, sort_order);
CREATE INDEX IF NOT EXISTS programs_public_idx ON programs (published, sort_order);
CREATE INDEX IF NOT EXISTS university_programs_public_idx ON university_programs (published, university_slug, program_slug, sort_order);
CREATE INDEX IF NOT EXISTS offering_specialisations_public_idx ON offering_specialisations (published, availability_status, offering_id);
CREATE INDEX IF NOT EXISTS claims_public_idx ON claim_evidence (published, verified_at, expires_at);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_created_idx ON leads (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS rate_limit_last_attempt_idx ON lead_intake_rate_limits (last_attempt_at);
CREATE INDEX IF NOT EXISTS catalogue_research_queue_idx ON catalogue_research_records (import_id, import_bucket, university_display_name, course);
CREATE UNIQUE INDEX IF NOT EXISTS catalogue_ready_dataset_idx ON catalogue_import_batches (dataset_id) WHERE import_status = 'ready';

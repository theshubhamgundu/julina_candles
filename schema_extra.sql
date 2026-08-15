-- ─── Additional tables referenced by the API ───

-- Shippers (for delivery partner login)
CREATE TABLE IF NOT EXISTS public.shippers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  auth_token TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT shippers_pkey PRIMARY KEY (id)
);

-- Trust Highlights (homepage trust badges)
CREATE TABLE IF NOT EXISTS public.trust_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trust_highlights_pkey PRIMARY KEY (id)
);

-- Company Values (about page)
CREATE TABLE IF NOT EXISTS public.company_values (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT company_values_pkey PRIMARY KEY (id)
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  photo TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);

-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  photo TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);

-- Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  photo TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);

-- Blogs
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  excerpt TEXT,
  photo TEXT,
  author VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT blogs_pkey PRIMARY KEY (id)
);

-- Recipes
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  photo TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT recipes_pkey PRIMARY KEY (id)
);

-- ─── RLS Policies for new tables (public read) ───
ALTER TABLE public.shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Public read for CMS tables
CREATE POLICY "Public Read trust_highlights" ON public.trust_highlights FOR SELECT USING (true);
CREATE POLICY "Public Read company_values" ON public.company_values FOR SELECT USING (true);
CREATE POLICY "Public Read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public Read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public Read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public Read recipes" ON public.recipes FOR SELECT USING (true);

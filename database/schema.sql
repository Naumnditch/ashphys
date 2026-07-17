-- AshPhys Platform Database Schema (PostgreSQL)
-- For Supabase
-- Created: July 18, 2026

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE chapter_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE answer_type AS ENUM ('multiple_choice', 'numeric', 'free_text', 'graph', 'equation');
CREATE TYPE quiz_type AS ENUM ('checkpoint', 'comprehensive', 'practice');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE sim_type AS ENUM ('graph_builder', 'force_diagram', 'circuit', 'field_visualizer', 'collision', 'energy', 'electric_field', 'wave');

-- ============================================
-- CORE USERS & ORGANIZATION
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  meb_code VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  teacher_id UUID,
  school_id UUID REFERENCES schools(id),
  capacity INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role NOT NULL DEFAULT 'student',
  status user_status NOT NULL DEFAULT 'active',
  school_id UUID REFERENCES schools(id),
  section_id UUID REFERENCES sections(id),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE sections ADD CONSTRAINT fk_sections_teacher FOREIGN KEY (teacher_id) REFERENCES users(id);

-- ============================================
-- COURSES & CURRICULUM
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50),
  version VARCHAR(20),
  created_by UUID REFERENCES users(id),
  status chapter_status DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  unit_igcse_code VARCHAR(10),
  unit_meb_code VARCHAR(20),
  learning_objectives TEXT,
  week_start INT,
  week_end INT,
  release_date TIMESTAMP DEFAULT NOW(),
  status chapter_status DEFAULT 'published',
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, chapter_number)
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  topic_name VARCHAR(255) NOT NULL,
  description TEXT,
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  lesson_type VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  content_url TEXT,
  content_markdown TEXT,
  duration_minutes INT,
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PROBLEMS & QUIZZES
-- ============================================

CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  problem_number INT,
  question_text TEXT NOT NULL,
  question_markdown TEXT,
  question_image_url TEXT,
  difficulty_level INT DEFAULT 1,
  answer_type answer_type DEFAULT 'multiple_choice',
  answer_correct TEXT,
  explanation TEXT,
  points INT DEFAULT 1,
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problem_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_letter VARCHAR(1),
  is_correct BOOLEAN DEFAULT FALSE,
  "order" INT
);

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  quiz_type quiz_type DEFAULT 'checkpoint',
  description TEXT,
  passing_score INT DEFAULT 70,
  time_limit_minutes INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  "order" INT,
  UNIQUE (quiz_id, problem_id)
);

-- ============================================
-- STUDENT PROGRESS & SUBMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  completion_percent INT DEFAULT 0,
  started_at TIMESTAMP,
  last_accessed_at TIMESTAMP,
  finished_at TIMESTAMP,
  status progress_status DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, chapter_id)
);

CREATE TABLE IF NOT EXISTS problem_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  submitted_answer TEXT,
  is_correct BOOLEAN,
  points_earned INT DEFAULT 0,
  attempts INT DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT NOW(),
  time_spent_seconds INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT,
  passed BOOLEAN,
  started_at TIMESTAMP,
  completed_at TIMESTAMP DEFAULT NOW(),
  time_spent_seconds INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SIMULATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sim_type sim_type,
  url_path VARCHAR(255),
  difficulty_level INT DEFAULT 1,
  learning_objectives TEXT,
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulation_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  interaction_data JSONB,
  screenshot_url TEXT,
  time_spent_seconds INT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Q&A & DISCUSSION
-- ============================================

CREATE TABLE IF NOT EXISTS qa_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id),
  section_id UUID REFERENCES sections(id),
  student_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  likes INT DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  solved_by_reply_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qa_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES qa_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  likes INT DEFAULT 0,
  is_teacher_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS (FUTURE MONETIZATION)
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier DEFAULT 'free',
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  iyzico_subscription_id VARCHAR(255),
  iyzico_customer_id VARCHAR(255),
  status subscription_status DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id)
);

CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  payment_method VARCHAR(50),
  status VARCHAR(50),
  iyzico_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ANALYTICS & CACHING
-- ============================================

CREATE TABLE IF NOT EXISTS teacher_dashboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  metric_type VARCHAR(100),
  metric_value JSONB,
  refreshed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(teacher_id, section_id, metric_type)
);

-- ============================================
-- INDEXES (Performance)
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_section_id ON users(section_id);
CREATE INDEX idx_chapters_course_id ON chapters(course_id);
CREATE INDEX idx_problems_chapter_id ON problems(chapter_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_chapter ON student_progress(chapter_id);
CREATE INDEX idx_problem_submissions_student ON problem_submissions(student_id);
CREATE INDEX idx_quiz_submissions_student ON quiz_submissions(student_id);
CREATE INDEX idx_qa_threads_chapter ON qa_threads(chapter_id);
CREATE INDEX idx_qa_threads_student ON qa_threads(student_id);
CREATE INDEX idx_subscriptions_student ON subscriptions(student_id);
CREATE INDEX idx_simulation_interactions_student ON simulation_interactions(student_id);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Al-Jazari International School, Istanbul
INSERT INTO schools (name, location, country, meb_code) 
VALUES ('Al-Jazari International School of Science & Technology', 'Esenyurt, Istanbul', 'Turkey', 'TR-AIJSST-001')
ON CONFLICT DO NOTHING;

-- Cambridge IGCSE Physics 0625 Course
INSERT INTO courses (title, description, code, version)
VALUES (
  'Cambridge IGCSE Physics 0625',
  'Complete Physics curriculum for IGCSE examination aligned with Turkish MEB standards',
  '0625',
  '2026-27'
)
ON CONFLICT DO NOTHING;

-- End of schema

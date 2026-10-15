-- Minimal snapshot of the live tables the 2026-10-14 migrations build on,
-- taken from the Supabase project on 2026-10-14 (columns, defaults, keys,
-- checks and foreign keys between these tables only). Used ONLY by the
-- database tests (lib/dashboard/__tests__/dashboardDb.test.ts) to stand up
-- an empty test database. Never run this against production.

CREATE TYPE user_role AS ENUM ('student','teacher','admin');
CREATE TYPE user_status AS ENUM ('active','inactive','suspended');
CREATE TYPE chapter_status AS ENUM ('draft','published','archived');
CREATE TYPE answer_type AS ENUM ('multiple_choice','numeric','free_text','graph','equation');
CREATE TABLE IF NOT EXISTS users (id uuid DEFAULT gen_random_uuid() NOT NULL, email character varying(255) NOT NULL, password_hash character varying(255), first_name character varying(100), last_name character varying(100), role user_role DEFAULT 'student'::user_role NOT NULL, status user_status DEFAULT 'active'::user_status NOT NULL, school_id uuid, section_id uuid, avatar_url text, bio text, created_at timestamp without time zone DEFAULT now(), updated_at timestamp without time zone DEFAULT now(), application_message text, school_name character varying(255), email_notifications boolean DEFAULT true NOT NULL, unsubscribe_token text DEFAULT replace((gen_random_uuid())::text, '-'::text, ''::text) NOT NULL, unsubscribed_at timestamp with time zone);
CREATE TABLE IF NOT EXISTS courses (id uuid DEFAULT gen_random_uuid() NOT NULL, title character varying(255) NOT NULL, description text, code character varying(50), version character varying(20), created_by uuid, status chapter_status DEFAULT 'published'::chapter_status, created_at timestamp without time zone DEFAULT now(), updated_at timestamp without time zone DEFAULT now());
CREATE TABLE IF NOT EXISTS chapters (id uuid DEFAULT gen_random_uuid() NOT NULL, course_id uuid NOT NULL, chapter_number integer NOT NULL, title character varying(255) NOT NULL, description text, unit_igcse_code character varying(10), unit_meb_code character varying(20), learning_objectives text, week_start integer, week_end integer, release_date timestamp without time zone DEFAULT now(), status chapter_status DEFAULT 'published'::chapter_status, "order" integer, created_at timestamp without time zone DEFAULT now(), updated_at timestamp without time zone DEFAULT now());
CREATE TABLE IF NOT EXISTS topics (id uuid DEFAULT gen_random_uuid() NOT NULL, chapter_id uuid NOT NULL, topic_name character varying(255) NOT NULL, description text, "order" integer, created_at timestamp without time zone DEFAULT now(), required_tier integer DEFAULT 0 NOT NULL, curriculum_ids text[] DEFAULT ARRAY['igcse'::text] NOT NULL, topic_code character varying(50), as_topic_code character varying(50), a_level_topic_code character varying(50), ib_topic_code character varying(50), syllabus_reference text);
CREATE TABLE IF NOT EXISTS problems (id uuid DEFAULT gen_random_uuid() NOT NULL, chapter_id uuid NOT NULL, problem_number integer, question_text text NOT NULL, question_markdown text, question_image_url text, difficulty_level integer DEFAULT 1, answer_type answer_type DEFAULT 'multiple_choice'::answer_type, answer_correct text, explanation text, points integer DEFAULT 1, "order" integer, created_at timestamp without time zone DEFAULT now(), updated_at timestamp without time zone DEFAULT now(), topic_id uuid, answer_unit text, answer_unit_required boolean DEFAULT false NOT NULL, answer_tolerance numeric, answer_sign_sensitive boolean DEFAULT false NOT NULL, answer_alternates text[], solution_id uuid, curriculum_id character varying(20) DEFAULT 'igcse'::character varying NOT NULL, topic_code character varying(50), syllabus_cite text);
CREATE TABLE IF NOT EXISTS practice_sessions (id uuid DEFAULT gen_random_uuid() NOT NULL, student_id uuid NOT NULL, topic_id uuid, started_at timestamp with time zone DEFAULT now() NOT NULL, ended_at timestamp with time zone, last_activity_at timestamp with time zone DEFAULT now() NOT NULL, questions_attempted integer DEFAULT 0 NOT NULL, questions_correct integer DEFAULT 0 NOT NULL, mastery_achieved boolean DEFAULT false NOT NULL);
CREATE TABLE IF NOT EXISTS practice_attempts (id uuid DEFAULT gen_random_uuid() NOT NULL, student_id uuid NOT NULL, problem_id uuid NOT NULL, topic_id uuid, chapter_id uuid, session_id uuid, attempt_number integer DEFAULT 1 NOT NULL, raw_answer text, normalized_answer text, is_correct boolean NOT NULL, grading_method text, grade_reason text, tolerance_used numeric, hint_used boolean DEFAULT false NOT NULL, time_spent_ms integer, regraded_at timestamp with time zone, created_at timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE IF NOT EXISTS video_requests (id uuid DEFAULT gen_random_uuid() NOT NULL, student_id uuid NOT NULL, chapter_id uuid, topic_id uuid, description text NOT NULL, screenshot_path text, status text DEFAULT 'open'::text NOT NULL, youtube_url text, admin_note text, created_at timestamp with time zone DEFAULT now() NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE chapters ADD CONSTRAINT chapters_course_id_chapter_number_key UNIQUE (course_id, chapter_number);
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE chapters ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);
ALTER TABLE courses ADD CONSTRAINT courses_pkey PRIMARY KEY (id);
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_pkey PRIMARY KEY (id);
ALTER TABLE practice_sessions ADD CONSTRAINT practice_sessions_pkey PRIMARY KEY (id);
ALTER TABLE problems ADD CONSTRAINT problems_pkey PRIMARY KEY (id);
ALTER TABLE topics ADD CONSTRAINT topics_pkey PRIMARY KEY (id);
ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE video_requests ADD CONSTRAINT video_requests_pkey PRIMARY KEY (id);
ALTER TABLE chapters ADD CONSTRAINT chapters_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE courses ADD CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_session_id_fkey FOREIGN KEY (session_id) REFERENCES practice_sessions(id) ON DELETE SET NULL;
ALTER TABLE practice_sessions ADD CONSTRAINT practice_sessions_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE practice_sessions ADD CONSTRAINT practice_sessions_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL;
ALTER TABLE problems ADD CONSTRAINT problems_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE;
ALTER TABLE problems ADD CONSTRAINT problems_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id);
ALTER TABLE topics ADD CONSTRAINT topics_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE;
ALTER TABLE video_requests ADD CONSTRAINT video_requests_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL;
ALTER TABLE video_requests ADD CONSTRAINT video_requests_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL;
ALTER TABLE video_requests ADD CONSTRAINT video_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_grade_reason_check CHECK ((grade_reason = ANY (ARRAY['match'::text, 'wrong-value'::text, 'wrong-unit'::text, 'unparseable'::text, 'close'::text])));
ALTER TABLE practice_attempts ADD CONSTRAINT practice_attempts_grading_method_check CHECK ((grading_method = ANY (ARRAY['numeric'::text, 'mcq'::text, 'text'::text])));
ALTER TABLE problems ADD CONSTRAINT problems_curriculum_id_valid CHECK (((curriculum_id)::text = ANY ((ARRAY['igcse'::character varying, 'as'::character varying, 'a-level'::character varying, 'ib'::character varying])::text[])));
ALTER TABLE topics ADD CONSTRAINT topics_curriculum_ids_valid CHECK (((cardinality(curriculum_ids) > 0) AND (curriculum_ids <@ ARRAY['igcse'::text, 'as'::text, 'a-level'::text, 'ib'::text])));
ALTER TABLE video_requests ADD CONSTRAINT video_requests_status_check CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'fulfilled'::text, 'declined'::text])));

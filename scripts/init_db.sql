-- Drop pre-existent dbs
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.admins;
DROP TABLE IF EXISTS public.events;

-- Create tables

CREATE TABLE public.users (	
	-- Access and credentials
	id					VARCHAR(36)					NOT NULL	PRIMARY KEY,
	email				VARCHAR(40)					NOT NULL,
	password			VARCHAR(60),
	fb_id				VARCHAR(32),
	banned				BOOLEAN						NOT NULL	DEFAULT FALSE,

	-- Profile info
	first_name			VARCHAR(20)					NOT NULL,
	last_name			VARCHAR(20)					NOT NULL,
	signup_date			TIMESTAMP WITH TIME ZONE	NOT NULL	DEFAULT CURRENT_TIMESTAMP(2),
	city				VARCHAR(20),
	country				VARCHAR(20),
	interests			VARCHAR(20) ARRAY[64],
	profile_pic_url		VARCHAR(255),

	-- Uniques
	UNIQUE(email),

	-- Constraints
	CONSTRAINT chk_credentials CHECK ((password IS NOT NULL and fb_id IS NULL) or (password IS NULL and fb_id IS NOT NULL))
);

CREATE TABLE public.admins (
	-- Name				Type
	id					VARCHAR(36)					NOT NULL	PRIMARY KEY,
	email				VARCHAR(40)					NOT NULL,
	password			VARCHAR(60)					NOT NULL,
	signup_date			TIMESTAMP WITH TIME ZONE	NOT NULL	DEFAULT CURRENT_TIMESTAMP(2),

	UNIQUE(email)
);

CREATE TABLE public.events (
	-- Name				Type
	-- id    				SERIAL									PRIMARY KEY,
	date				TIMESTAMP WITH TIME ZONE	NOT NULL	DEFAULT CURRENT_TIMESTAMP(2),
	event				VARCHAR(20)					NOT NULL
);

-- Insert admin

INSERT INTO public.admins (id, email, password)
VALUES
	(
		'f84683c1-2d00-47a6-9335-df0dd2718aee',
		'admin@admin.com',
		'$2b$10$Vg1ZosjDBfxF4zfHly2QjuLh2AX/tqOOXLtHOxy8eJGzhG29pFkXy'
	);

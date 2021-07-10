-- Drop pre-existent dbs
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.admins;

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

-- Insert values

INSERT INTO public.users
	(id, email, password, first_name, last_name)
	VALUES
	(
		'ca718a21-a126-484f-bc50-145126a6f75b',
		'user@user.com',
		'$2b$10$R3YT8/4SxWGfajHg6lSJ3eLw2ASxqeO8kOhtN2t3h2RzBUln3YjEa',
		'user',
		'user'
	);

INSERT INTO public.users
	(id, email, password, banned, first_name, last_name)
	VALUES
	(
		'f5c43d00-91d7-4ff8-9ecb-8087e67a5ffd',
        'banned@banned.com',
        '$2b$10$e2NjtP9UJRYHj8wAxqYZae6Vkvlql1tCg5G4iupleOiiY7ybWu4L6',
		TRUE,
		'banned',
		'banned'
	);

INSERT INTO public.admins (id, email, password)
VALUES
	(
		'f84683c1-2d00-47a6-9335-df0dd2718aee',
		'admin@admin.com',
		'$2b$10$Vg1ZosjDBfxF4zfHly2QjuLh2AX/tqOOXLtHOxy8eJGzhG29pFkXy'
	);

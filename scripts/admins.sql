-- Create user table

DROP TABLE IF EXISTS public.admins;

CREATE TABLE public.admins (
	-- Name				Type
	id					VARCHAR(36)					NOT NULL	PRIMARY KEY,
	email				VARCHAR(40)					NOT NULL,
	password			VARCHAR(60)					NOT NULL,
	signup_date			TIMESTAMP WITH TIME ZONE	NOT NULL	DEFAULT CURRENT_TIMESTAMP(2),

	UNIQUE(email)
);
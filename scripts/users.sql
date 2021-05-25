-- Create user table

DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
	-- Name				Type
	email				VARCHAR(40)					NOT NULL	PRIMARY KEY,
	first_name			VARCHAR(20)					NOT NULL,
	last_name			VARCHAR(20)					NOT NULL,
	pass				VARCHAR(20)					NOT NULL,
	profile_pic_url		VARCHAR(255),
	signup_date			TIMESTAMP WITH TIME ZONE	NOT NULL	DEFAULT CURRENT_TIMESTAMP(2)
);

ALTER TABLE public.users
    OWNER to postgres;
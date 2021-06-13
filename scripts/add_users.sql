-- Add user example
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

-- Banned user for testing
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
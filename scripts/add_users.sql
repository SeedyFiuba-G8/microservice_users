-- Add user example

INSERT INTO public.users
	(id, email, password, first_name, last_name, profile_pic_url)
	VALUES
	(
		'123e4567-e89b-12d3-a456-426614174000',
		'memis@pomofot.ar',
		'memis123pomo321fot',
		'memis',
		'pomofot',
		'imgur.img/jsdkf.png'
	),
	(
		'9bb37345-41ad-471e-adc3-980fd05e5b6f',
		'facu@arana.com',
		'unapassword',
		'facundo',
		'arana',
		'imgur.img/hola.png'
	);
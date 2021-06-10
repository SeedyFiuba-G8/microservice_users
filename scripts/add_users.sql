-- Add user example

INSERT INTO public.users
	(id, email, password, first_name, last_name, profile_pic_url)
	VALUES
	(
		'123e4567-e89b-12d3-a456-426614174000',
		'memis@pomofot.ar',
		'$2b$10$kSakto1QTzIr.WTIQ2ieaOdJRD/l8oq.lcp9Z3Y..IA6ZGuHcAT/u',
		'memis',
		'pomofot',
		'imgur.img/jsdkf.png'
	),
	(
		'9bb37345-41ad-471e-adc3-980fd05e5b6f',
		'facu@arana.com',
		'$2b$10$kSakto1QTzIr.WTIQk8eaOdJRD/l8oq.lcp9Z3Y..IA6ZGuHcAT/u',
		'facundo',
		'arana',
		'imgur.img/hola.png'
	);
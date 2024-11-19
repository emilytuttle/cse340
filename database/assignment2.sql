-- Tony Stark insert statement

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
)



-- Tony Stark Update Statement

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com' 




-- Tony Stark Delete Statement

DELETE FROM public.account WHERE account_email = 'tony@starkent.com' 





-- Description Update Statement

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10




-- The select query using a JOIN SQL statement 

SELECT
    inv_make,
    inv_model,
    classification_name
FROM
    public.inventory i
INNER JOIN public.classification c
ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

-- The inv_image and inv_thumbnail update query

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
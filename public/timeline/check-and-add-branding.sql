-- First, check what clients exist in your database
SELECT id, name, project FROM clients;

-- Look for the E-ACT client ID in the results above
-- It might be something like 'client-1234567890' or similar

-- Once you identify the correct E-ACT client ID, use this query
-- (Replace 'YOUR-ACTUAL-CLIENT-ID' with the real ID from above)
/*
INSERT INTO client_branding (
    client_id, 
    logo_url, 
    primary_color, 
    secondary_color
) VALUES (
    'YOUR-ACTUAL-CLIENT-ID',  -- Replace this!
    'https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    '#003366',
    '#ff6600'
) ON CONFLICT (client_id) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color;
*/

-- Alternative: If E-ACT doesn't exist, create it first
/*
INSERT INTO clients (id, name, project) 
VALUES ('client-' || EXTRACT(EPOCH FROM NOW())::text, 'E-ACT', 'E-ACT Multi Academy Trust 2025-2026')
RETURNING id;
*/ 
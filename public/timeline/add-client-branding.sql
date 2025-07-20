-- Check if E-ACT branding already exists
SELECT * FROM client_branding WHERE client_id = 'client-1752835894451';

-- If the above returns no rows, run this to add E-ACT branding:
INSERT INTO client_branding (
    client_id, 
    logo_url, 
    primary_color, 
    secondary_color,
    company_name
) VALUES (
    'client-1752835894451',
    'https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    '#003366',  -- Navy blue
    '#ff6600',  -- Orange
    'E-ACT Multi Academy Trust'
) ON CONFLICT (client_id) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    company_name = EXCLUDED.company_name;

-- Verify it was added
SELECT * FROM client_branding; 
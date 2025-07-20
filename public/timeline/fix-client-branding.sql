-- First, check what columns exist in client_branding table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'client_branding';

-- If company_name column is missing, add it:
ALTER TABLE client_branding 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Now insert the E-ACT branding data (without company_name first)
INSERT INTO client_branding (
    client_id, 
    logo_url, 
    primary_color, 
    secondary_color
) VALUES (
    'client-1752835894451',
    'https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    '#003366',
    '#ff6600'
) ON CONFLICT (client_id) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color;

-- Then update with company name if the column was added
UPDATE client_branding 
SET company_name = 'E-ACT Multi Academy Trust'
WHERE client_id = 'client-1752835894451';

-- Verify the data
SELECT * FROM client_branding WHERE client_id = 'client-1752835894451'; 
-- Add branding for E-ACT using the correct client ID
INSERT INTO client_branding (
    client_id, 
    logo_url, 
    primary_color, 
    secondary_color
) VALUES (
    'client-eact-2025',
    'https://tse4.mm.bing.net/th/id/OIP.wCRZNZZat5R5cxhtl5Z2IwHaD7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    '#003366',  -- Navy blue
    '#ff6600'   -- Orange
) ON CONFLICT (client_id) DO UPDATE SET
    logo_url = EXCLUDED.logo_url,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color;

-- Verify it was added
SELECT * FROM client_branding WHERE client_id = 'client-eact-2025'; 
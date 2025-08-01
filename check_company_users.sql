-- Verificar se os usuários estão na tabela company_users
SELECT * FROM company_users;

-- Verificar a relação completa
SELECT 
    p.id as profile_id,
    p.name,
    p.email,
    p.company_id,
    cu.id as company_user_id,
    cu.user_id,
    cu.role,
    cu.position,
    cu.created_at as company_user_created_at,
    c.name as company_name
FROM profiles p
LEFT JOIN company_users cu ON p.id = cu.user_id
LEFT JOIN companies c ON p.company_id = c.id
ORDER BY p.created_at DESC; 
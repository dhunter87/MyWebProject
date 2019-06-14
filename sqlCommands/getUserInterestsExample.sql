SELECT visitsToCategory, category.name, USER.name
FROM interest
INNER JOIN category ON interest.category_id = category.category_id
INNER JOIN user ON interest.user_id = user.user_id
WHERE user.user_id = 1	
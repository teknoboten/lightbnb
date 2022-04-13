SELECT properties.id, title, cost_per_night, AVG(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews on properties.id = property_id
WHERE city LIKE '%ancouver%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;


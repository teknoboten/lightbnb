SELECT COUNT(reservations.*) as total_reservations, properties.city 
FROM reservations
JOIN properties ON properties.id = property_id
GROUP BY properties.city
ORDER BY COUNT(reservations.*) DESC;
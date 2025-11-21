-- Seed data for Human Notice Board
-- Run this in the Supabase SQL Editor to populate your board with initial content.

-- NOTE: This script assumes you have at least one user signed up in your application.
-- It will assign these posts to the first user found in your database.

WITH first_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO notices (user_id, category, title, body, location_city, location_desc, location_lat, location_lng, is_time_sensitive)
SELECT
  id,
  category,
  title,
  body,
  location_city,
  location_desc,
  location_lat,
  location_lng,
  is_time_sensitive
FROM first_user, (VALUES
  (
    'question',
    NULL,
    'Is anyone else hearing drilling at 3am near Soi 24? It''s keeping me up. I thought construction was banned at night.',
    'Bangkok',
    'Soi 24',
    13.7291,
    100.5693,
    true
  ),
  (
    'alert',
    NULL,
    'Avoid Sukhumvit road near Asoke. Major traffic jam due to police stop. Better take the MRT.',
    'Bangkok',
    'Asoke Intersection',
    13.7370, 100.5604,
    true
  ),
  (
    'help',
    'Lost Cat',
    'My orange tabby ''Mochi'' got out last night. He has a blue collar. Last seen near the 7-11 on the corner. Please let me know if you see him!',
    'Bangkok',
    'Near 7-11',
    13.7468, 100.5349,
    true
  ),
  (
    'market',
    'Free Moving Boxes',
    'I just moved in and have about 10 large cardboard boxes. Clean and folded. DM me if you want them, otherwise recycling them tomorrow.',
    'Bangkok',
    'Condo Lobby',
    13.7200, 100.5500,
    false
  ),
  (
    'personals',
    NULL,
    'To the girl reading Murakami at Roots Coffee this morning: I wanted to say hi but didn''t want to interrupt. Your vibe was cool.',
    'Bangkok',
    'Roots Coffee',
    13.7300, 100.5800,
    false
  ),
  (
    'musings',
    NULL,
    'The sunset today was incredible. Just wanted to say that. Hope everyone had a good day.',
    'Bangkok',
    'Rooftop',
    13.7400, 100.5600,
    false
  ),
  (
    'alert',
    'Water Outage',
    'Just a heads up, the building management said water will be off tomorrow from 10am-2pm for maintenance.',
    'Bangkok',
    'Building A',
    13.7500, 100.5400,
    true
  ),
  (
    'question',
    NULL,
    'Best place for late night khao man gai? The one I usually go to is closed.',
    'Bangkok',
    'Thong Lo',
    13.7330, 100.5820,
    false
  ),
  (
    'appreciation',
    NULL,
    'Huge thanks to the stranger who helped me carry my groceries when the bag ripped. You made my day.',
    'Bangkok',
    'Phrom Phong',
    13.7300, 100.5680,
    false
  )
) AS t(category, title, body, location_city, location_desc, location_lat, location_lng, is_time_sensitive);

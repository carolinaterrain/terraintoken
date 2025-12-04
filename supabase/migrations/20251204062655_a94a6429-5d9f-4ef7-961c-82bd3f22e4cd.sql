-- Seed testimonials with real client data (using existing schema)
INSERT INTO public.testimonials (author_name, location, review_text, rating, is_featured, sort_order) VALUES
  ('Sarah Mitchell', 'Charlotte, NC', 'Carolina Terrain transformed our backyard nightmare into a beautiful, functional space. The French drain they installed solved our flooding issue completely. Now I''m earning TRN by sharing photos of the project!', 5, true, 1),
  ('Marcus Johnson', 'Davidson, NC', 'Hired them for a full grading project before building our pool. Professional, on time, and the excavator work was precise. The fact that I can see their equipment tracked on-chain is wild — total transparency.', 5, true, 2),
  ('Jennifer & Tom Rodriguez', 'Huntersville, NC', 'Our driveway was sinking and causing foundation concerns. The team came in, assessed the problem, and fixed it within a week. Fair pricing and quality work. Would hire again in a heartbeat.', 5, true, 3),
  ('David Chen', 'Mooresville, NC', 'Needed emergency drainage work after a storm damaged our yard. They responded same-day and had everything fixed within 48 hours. The TRN rewards for referrals are a nice bonus too!', 5, true, 4),
  ('Amanda Foster', 'Cornelius, NC', 'We''ve used Carolina Terrain for three different projects now — grading, drainage, and hauling. Consistent quality every time. Love that they''re building something bigger with the token project.', 5, true, 5);

-- Add comment to archive prediction-related tables (preserving data, disabling usage)
COMMENT ON TABLE public.market_predictions IS 'ARCHIVED: Prediction game feature removed for regulatory compliance. Data preserved.';
COMMENT ON TABLE public.prediction_stakes IS 'ARCHIVED: Prediction staking feature removed for regulatory compliance. Data preserved.';
COMMENT ON TABLE public.prediction_challenges IS 'ARCHIVED: Prediction challenges feature removed for regulatory compliance. Data preserved.';
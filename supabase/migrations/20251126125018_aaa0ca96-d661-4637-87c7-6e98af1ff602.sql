-- Phase 2: Seed Marketplace & Shop Data

-- 2.1 Seed marketplace_items with sample listings
INSERT INTO marketplace_items (title, description, item_type, price_trn, seller_wallet, image_url, is_featured, status, metadata) VALUES
-- NFT Listings
('Certified Goblin Badge NFT', 'Exclusive NFT badge proving you''re a true TRN Goblin. Grants access to exclusive Discord channels and early feature access.', 'nft', 5000, 'GoblinTerritory1234567890', '/goblin-certified.png', true, 'active', '{"rarity": "rare", "benefits": ["Discord access", "Early features"]}'),
('Diamond Hands Achievement', 'NFT commemorating your unwavering TRN commitment. Shows your longest hold streak and total TRN accumulated.', 'nft', 10000, 'GoblinTerritory1234567890', '/goblin-banner.png', true, 'active', '{"rarity": "legendary", "traits": ["Hold streak", "Achievement date"]}'),
('Terrain Token Founder Edition', 'Limited edition founder NFT. Only 100 minted. Includes lifetime premium features and governance voting power.', 'nft', 50000, 'GoblinTerritory1234567890', '/terrain-mascot.png', true, 'active', '{"rarity": "legendary", "supply": 100, "benefits": ["Lifetime premium", "Governance rights"]}'),
('Weekly Winner Trophy', 'NFT trophy for top prediction challenge performers. Updated weekly with your win stats.', 'nft', 2500, 'GoblinTerritory1234567890', '/trn-coin.png', false, 'active', '{"rarity": "common", "dynamic": true}'),

-- Service Listings
('Premium Terrain Analysis Report', 'Comprehensive site analysis including drainage assessment, grading recommendations, and cost estimates for your property.', 'service', 25000, 'CarolinaTerrainPro', '/carolina-terrain-work-1.png', true, 'active', '{"deliveryTime": "3-5 business days", "includes": ["Drainage report", "Grading plan", "Cost estimate"]}'),
('1-Hour Consultation Call', 'Direct consultation with Carolina Terrain experts. Discuss your project, get expert advice, and planning guidance.', 'service', 7500, 'CarolinaTerrainPro', '/carolina-terrain-work-2.png', false, 'active', '{"deliveryTime": "Schedule within 48 hours", "format": "Video call"}'),
('Custom Land Clearing Quote', 'Detailed quote for land clearing services. Site-specific pricing based on your property specifications.', 'service', 5000, 'CarolinaTerrainPro', '/carolina-terrain-work-3.png', false, 'active', '{"deliveryTime": "24 hours", "refundable": true}'),
('Priority Service Booking', 'Skip the waitlist and get priority scheduling for any Carolina Terrain service. Valid for 90 days.', 'service', 15000, 'CarolinaTerrainPro', '/carolina-terrain-work-4.png', true, 'active', '{"validity": "90 days", "includes": ["Priority scheduling", "Dedicated coordinator"]}'),

-- Content Listings
('TRN Trading Masterclass', 'Complete video course covering technical analysis, risk management, and TRN market dynamics. 12 modules, 6+ hours.', 'content', 8000, 'TRNEducation', '/goblin-with-coin.png', true, 'active', '{"format": "Video", "duration": "6 hours", "modules": 12}'),
('Predictio Strategy Guide', 'PDF guide with proven strategies for the prediction game. Includes historical data analysis and winning patterns.', 'content', 3000, 'TRNEducation', '/trn-coin.png', false, 'active', '{"format": "PDF", "pages": 45, "updated": "Monthly"}'),
('Drainage Design Templates', 'Professional CAD templates for common drainage solutions. Includes 20+ customizable designs.', 'content', 12000, 'DesignPro', '/goblin-drainage.png', false, 'active', '{"format": "CAD files", "count": 20, "license": "Commercial use allowed"}'),
('TRN Governance Playbook', 'Comprehensive guide to participating in TRN governance. Includes proposal templates and voting strategies.', 'content', 2000, 'CommunityGuides', '/terrain-mascot.png', false, 'active', '{"format": "PDF + Templates", "pages": 30}')
ON CONFLICT (id) DO NOTHING;

-- 2.2 Seed mystery_boxes with 3 tiers
INSERT INTO mystery_boxes (box_tier, trn_cost, possible_rewards, rarity_weights, available_count, is_active) VALUES
('Bronze', 500, 
 '[
   {"type": "trn", "min": 100, "max": 1000, "rarity": "common"},
   {"type": "energy", "amount": 5, "rarity": "common"},
   {"type": "discount_code", "percent": 10, "rarity": "uncommon"},
   {"type": "nft_badge", "name": "Bronze Collector", "rarity": "rare"}
 ]'::jsonb,
 '{"common": 70, "uncommon": 25, "rare": 5}'::jsonb,
 1000, true),

('Silver', 2500,
 '[
   {"type": "trn", "min": 1000, "max": 5000, "rarity": "common"},
   {"type": "energy", "amount": 25, "rarity": "uncommon"},
   {"type": "discount_code", "percent": 25, "rarity": "uncommon"},
   {"type": "nft_badge", "name": "Silver Champion", "rarity": "rare"},
   {"type": "marketplace_credit", "amount": 5000, "rarity": "rare"}
 ]'::jsonb,
 '{"common": 50, "uncommon": 35, "rare": 15}'::jsonb,
 500, true),

('Gold', 10000,
 '[
   {"type": "trn", "min": 5000, "max": 25000, "rarity": "uncommon"},
   {"type": "energy", "amount": 100, "rarity": "uncommon"},
   {"type": "discount_code", "percent": 50, "rarity": "rare"},
   {"type": "nft_badge", "name": "Golden Legend", "rarity": "legendary"},
   {"type": "marketplace_credit", "amount": 25000, "rarity": "rare"},
   {"type": "service_credit", "value": 50000, "rarity": "legendary"},
   {"type": "season_pass", "tier": "premium", "rarity": "legendary"}
 ]'::jsonb,
 '{"common": 20, "uncommon": 40, "rare": 30, "legendary": 10}'::jsonb,
 100, true)
ON CONFLICT (id) DO NOTHING;

-- 2.3 Seed sample token_burns records
INSERT INTO token_burns (burn_amount, burn_source, metadata, created_at) VALUES
(125, 'marketplace_fee', '{"item_id": "sample-1", "buyer": "Buyer123", "fee_type": "platform"}', NOW() - INTERVAL '7 days'),
(1250, 'marketplace_fee', '{"item_id": "sample-2", "buyer": "Buyer456", "fee_type": "platform"}', NOW() - INTERVAL '6 days'),
(2500, 'energy_purchase', '{"package": "mega", "buyer": "Energizer789"}', NOW() - INTERVAL '5 days'),
(500, 'prediction_stake', '{"prediction_id": "pred-123", "user": "Predictor111"}', NOW() - INTERVAL '4 days'),
(5000, 'marketplace_fee', '{"item_id": "sample-3", "buyer": "Whale999", "fee_type": "platform"}', NOW() - INTERVAL '3 days'),
(1000, 'energy_purchase', '{"package": "power", "buyer": "Trader444"}', NOW() - INTERVAL '2 days'),
(250, 'prediction_stake', '{"prediction_id": "pred-456", "user": "Predictor222"}', NOW() - INTERVAL '1 day'),
(750, 'mystery_box', '{"box_tier": "silver", "user": "Lucky777"}', NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;
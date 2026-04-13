-- Insert sample tags
INSERT INTO tags (name, color) VALUES
  ('VIP', '#FFD700'),
  ('Frequent', '#4169E1'),
  ('New', '#90EE90'),
  ('Corporate', '#FF8C00'),
  ('Warranty', '#DC143C')
ON CONFLICT (name) DO NOTHING;

-- Insert sample client
INSERT INTO clients (first_name, last_name, company, type, email, primary_phone, language, status)
VALUES
  ('Kevin', 'Konate', NULL, 'Regular', 'kevin.konate@email.com', '(819) 701-7358', 'fr', 'Active')
ON CONFLICT DO NOTHING;

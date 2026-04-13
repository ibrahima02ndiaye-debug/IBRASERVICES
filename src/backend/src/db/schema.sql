CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  language VARCHAR(5) DEFAULT 'EN',
  type VARCHAR(20) DEFAULT 'Regular',
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_profit DECIMAL(12, 2) DEFAULT 0,
  total_payments DECIMAL(12, 2) DEFAULT 0,
  outstanding_balance DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  year INTEGER,
  make VARCHAR(100),
  model VARCHAR(100),
  vin VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_tags (
  client_id VARCHAR(36) REFERENCES clients(id) ON DELETE CASCADE,
  tag_id VARCHAR(36) REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, tag_id)
);

CREATE TABLE IF NOT EXISTS repair_orders (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  vehicle_id VARCHAR(36) REFERENCES vehicles(id),
  status VARCHAR(20) DEFAULT 'open',
  total_amount DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deferred_services (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT,
  amount DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  repair_order_id VARCHAR(36) REFERENCES repair_orders(id),
  amount DECIMAL(12, 2),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_language ON clients(language);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_vehicles_client_id ON vehicles(client_id);
CREATE INDEX idx_repair_orders_client_id ON repair_orders(client_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_orders_updated_at BEFORE UPDATE ON repair_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deferred_services_updated_at BEFORE UPDATE ON deferred_services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
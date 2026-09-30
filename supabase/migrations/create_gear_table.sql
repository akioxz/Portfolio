-- Create gear table for PC specs, peripherals, and equipment
CREATE TABLE IF NOT EXISTS gear (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  image_url TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE gear ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON gear
  FOR SELECT USING (true);

-- PC Specs
INSERT INTO gear (name, category, description, image_url, sort_order) VALUES
  ('AMD Ryzen 5 7600X', 'pc', 'High-performance Zen 4 processor for modern gaming.', '/gear/ryzen5.png', 1),
  ('Gigabyte RTX 4060 ICE EAGLE OC 8GB', 'pc', 'Factory-overclocked dual-fan GPU with ray tracing.', 'https://static.gigabyte.com/StaticFile/Image/Global/ca46ef321ac872a92db97cd434c951b6/ProductRemoveBg/39542', 2),
  ('T-Force Delta 16GB (1x16GB) RGB DDR5 6000MHz', 'pc', 'High-speed DDR5 memory with customizable lighting.', '/gear/tforce-ram.png', 3),
  ('Kingston 1TB SNV2S Gen4 NVMe', 'pc', 'Fast PCIe Gen4 storage for rapid system loads.', 'https://cdn.pcworth.com/products/ssd/ecomm/1120/images/kingston-nv2-nvme-1tb-gen-4-1748940680683EB788C8762.png', 4);

-- Display
INSERT INTO gear (name, category, description, image_url, sort_order) VALUES
  ('24" Nvision EG24SW PRO', 'display', 'Fast 180Hz IPS monitor for competitive play.', '/gear/nvision-monitor.png', 5);

-- Keyboards
INSERT INTO gear (name, category, description, image_url, sort_order) VALUES
  ('AULA F87', 'keyboards', 'TKL mechanical keyboard with premium acoustics.', '/gear/aula-f87.png', 6),
  ('AULA F75', 'keyboards', 'Compact 75% wireless gasket-mounted keyboard.', '/gear/aula-f75.png', 7),
  ('DAREU Flex 75', 'keyboards', 'Hot-swappable 75% custom mechanical keyboard.', 'https://dareu.com/cdn/shop/files/05a4da2f7554b0880e3ce37b4c722e8b.png', 8);

-- Mouse
INSERT INTO gear (name, category, description, image_url, sort_order) VALUES
  ('Hawk 1 Garuda', 'mouse', 'Ultra-lightweight wireless performance mouse.', '/gear/hawk1-garuda.png', 9),
  ('ATK Shark X11 Pro V2', 'mouse', 'Ergonomic wireless mouse with high-end tracking.', '/gear/atk-shark.png', 10);

-- Audio
INSERT INTO gear (name, category, description, image_url, sort_order) VALUES
  ('MAONO PD100X', 'audio', 'Dynamic XLR/USB microphone with RGB lighting.', '/gear/maono-pd100x.png', 11),
  ('Truthear Gate', 'audio', 'Precision-tuned in-ear monitors for clear audio.', '/gear/truthear-gate.jpg', 12);

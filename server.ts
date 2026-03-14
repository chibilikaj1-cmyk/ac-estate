import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

console.log("Initializing database...");
let db: any;
try {
  db = new Database("realestate.db");
  console.log("Database connection established.");
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}

// Initialize Database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER,
      location TEXT,
      type TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      area INTEGER,
      image_url TEXT,
      featured BOOLEAN DEFAULT 0,
      virtual_tour_url TEXT,
      total_units INTEGER DEFAULT 1,
      available_units INTEGER DEFAULT 1,
      project TEXT DEFAULT 'AC Estate 1'
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER,
      property_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, property_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      user_id INTEGER,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(property_id) REFERENCES properties(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      tenant_name TEXT,
      issue_description TEXT,
      priority TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      author TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS property_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      image_url TEXT,
      FOREIGN KEY(property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS hero_slideshow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    );
  `);

  // Seed initial settings
  const heroImage = db.prepare("SELECT * FROM settings WHERE key = ?").get("hero_image_url");
  if (!heroImage) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("hero_image_url", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80");
  }

  // Seed initial slideshow images if empty
  const slideshowCount = db.prepare("SELECT count(*) as count FROM hero_slideshow").get() as { count: number };
  if (slideshowCount.count === 0) {
    const images = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&w=1920&q=80"
    ];
    const stmt = db.prepare("INSERT INTO hero_slideshow (image_url, display_order) VALUES (?, ?)");
    images.forEach((url, i) => stmt.run(url, i));
  }

  // Migration: Add project column if missing
  try {
    db.exec("ALTER TABLE properties ADD COLUMN project TEXT DEFAULT 'AC Estate 1'");
  } catch (e) {
    // Column likely already exists
  }

  // Migration: Add user_id to applications if missing
  try {
    db.exec("ALTER TABLE applications ADD COLUMN user_id INTEGER REFERENCES users(id)");
    console.log("Added user_id column to applications table.");
  } catch (e) {
    // Column likely already exists
  }

  console.log("Database tables initialized.");
} catch (error) {
  console.error("Failed to initialize database tables:", error);
  process.exit(1);
}

// Seed data
try {
  db.exec("DELETE FROM properties");
  const insertProperty = db.prepare(`
    INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured, virtual_tour_url, total_units, available_units, project)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const properties = [
    ["Unit 101", "Spacious 2-bedroom apartment in AC Estate 1.", 2500, "Makeni S Rd, Lusaka", "Apartment", 2, 2, 1100, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", 1, "https://example.com/tour-ac1", 1, 1, "AC Estate 1"],
    ["Unit 102", "Modern 3-bedroom apartment in AC Estate 1.", 3200, "Makeni S Rd, Lusaka", "Apartment", 3, 2, 1350, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", 1, "https://example.com/tour-ac1-102", 1, 1, "AC Estate 1"],
    ["Unit 201", "Luxury 2-bedroom villa in AC Estate 2.", 3500, "Makeni S Rd, Lusaka", "Villa", 2, 2, 1200, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", 1, "https://example.com/tour-ac2-201", 1, 1, "AC Estate 2"],
    ["Unit 202", "Spacious 4-bedroom house in AC Estate 2.", 4500, "Makeni S Rd, Lusaka", "House", 4, 3, 2200, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", 1, "https://example.com/tour-ac2-202", 1, 1, "AC Estate 2"]
  ];

  for (const p of properties) {
    insertProperty.run(...p);
  }
  console.log("Property data seeded.");

  const blogCount = db.prepare("SELECT count(*) as count FROM blog_posts").get() as { count: number };
  if (blogCount.count === 0) {
    const insertBlog = db.prepare(`
      INSERT INTO blog_posts (title, content, author, image_url)
      VALUES (?, ?, ?, ?)
    `);
    insertBlog.run("Market Trends 2026", "The real estate market is seeing a shift towards sustainable living...", "Jane Doe", "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80");
    insertBlog.run("Home Buying Tips", "First-time home buyer? Here are the top 5 things you need to know...", "John Smith", "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80");
    console.log("Blog data seeded.");
  }

  const adminUser = db.prepare("SELECT * FROM users WHERE email = ?").get("admin@acestate.com");
  const newAdminPassword = process.env.VITE_OWNER_PASSWORD || "ArneOlsen2026!";
  const hashedNewPassword = await bcrypt.hash(newAdminPassword, 10);

  if (!adminUser) {
    db.prepare("INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)").run("admin@acestate.com", hashedNewPassword, "ARNE OLSEN", "admin");
    console.log(`Admin user created: admin@acestate.com / ${newAdminPassword}`);
  } else {
    // Force update password to match VITE_OWNER_PASSWORD or default
    db.prepare("UPDATE users SET password = ? WHERE email = ?").run(hashedNewPassword, "admin@acestate.com");
    console.log(`Admin user password updated to match VITE_OWNER_PASSWORD or default.`);
  }
} catch (error) {
  console.error("Failed to seed database:", error);
  process.exit(1);
}

async function startServer() {
  console.log("Starting server...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(UPLOADS_DIR));
  console.log("Express initialized.");

  // Multer setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ error: "Invalid token" });
    }
  };

  app.get("/health", (req, res) => {
    res.json({ status: "alive", version: "1.0.1" });
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, full_name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)").run(email, hashedPassword, full_name);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, email, full_name, role FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Favorites Routes
  app.get("/api/favorites", authenticateToken, (req: any, res) => {
    const favorites = db.prepare(`
      SELECT p.* FROM properties p
      JOIN favorites f ON p.id = f.property_id
      WHERE f.user_id = ?
    `).all(req.user.id);
    res.json(favorites);
  });

  app.post("/api/favorites/:propertyId", authenticateToken, (req: any, res) => {
    try {
      db.prepare("INSERT INTO favorites (user_id, property_id) VALUES (?, ?)").run(req.user.id, req.params.propertyId);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Already in favorites or invalid property" });
    }
  });

  app.delete("/api/favorites/:propertyId", authenticateToken, (req: any, res) => {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND property_id = ?").run(req.user.id, req.params.propertyId);
    res.json({ success: true });
  });

  // Update applications to link to user if logged in
  app.post("/api/applications", (req, res) => {
    const { property_id, user_id, full_name, email, phone, message } = req.body;
    const info = db.prepare(`
      INSERT INTO applications (property_id, user_id, full_name, email, phone, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(property_id, user_id || null, full_name, email, phone, message);
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.get("/api/my-applications", authenticateToken, (req: any, res) => {
    const applications = db.prepare(`
      SELECT a.*, p.title as property_title 
      FROM applications a
      JOIN properties p ON a.property_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `).all(req.user.id);
    res.json(applications);
  });

  // API Routes
  app.get("/api/properties", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties").all() as any[];
    const propertiesWithImages = properties.map(p => {
      const images = db.prepare("SELECT image_url FROM property_images WHERE property_id = ?").all(p.id) as any[];
      return { ...p, images: images.map(img => img.image_url) };
    });
    res.json(propertiesWithImages);
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id) as any;
    if (property) {
      const images = db.prepare("SELECT image_url FROM property_images WHERE property_id = ?").all(property.id) as any[];
      property.images = images.map(img => img.image_url);
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });

  app.post("/api/properties", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can create properties" });
    }
    const { title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured, virtual_tour_url, total_units, available_units, project, images } = req.body;
    const info = db.prepare(`
      INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured, virtual_tour_url, total_units, available_units, project)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured || 0, virtual_tour_url, total_units || 1, available_units || 1, project || 'AC Estate 1');
    
    const propertyId = info.lastInsertRowid;
    if (images && Array.isArray(images)) {
      const stmt = db.prepare("INSERT INTO property_images (property_id, image_url) VALUES (?, ?)");
      for (const img of images) {
        if (img) stmt.run(propertyId, img);
      }
    }
    
    res.status(201).json({ id: propertyId });
  });

  app.put("/api/properties/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can update properties" });
    }
    const { title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured, virtual_tour_url, total_units, available_units, project, images } = req.body;
    db.prepare(`
      UPDATE properties 
      SET title = ?, description = ?, price = ?, location = ?, type = ?, bedrooms = ?, bathrooms = ?, area = ?, image_url = ?, featured = ?, virtual_tour_url = ?, total_units = ?, available_units = ?, project = ?
      WHERE id = ?
    `).run(title, description, price, location, type, bedrooms, bathrooms, area, image_url, featured, virtual_tour_url, total_units, available_units, project, req.params.id);
    
    if (images && Array.isArray(images)) {
      db.prepare("DELETE FROM property_images WHERE property_id = ?").run(req.params.id);
      const stmt = db.prepare("INSERT INTO property_images (property_id, image_url) VALUES (?, ?)");
      for (const img of images) {
        if (img) stmt.run(req.params.id, img);
      }
    }
    
    res.json({ success: true });
  });

  app.delete("/api/properties/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can delete properties" });
    }
    db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Settings Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsMap = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsMap);
  });

  app.put("/api/settings/:key", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can update settings" });
    }
    const { value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(req.params.key, value);
    res.json({ success: true });
  });

  // Hero Slideshow Routes
  app.get("/api/hero-slideshow", (req, res) => {
    const images = db.prepare("SELECT * FROM hero_slideshow ORDER BY display_order ASC").all();
    res.json(images);
  });

  app.post("/api/hero-slideshow", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can manage slideshow" });
    }
    const { image_url, display_order } = req.body;
    const info = db.prepare("INSERT INTO hero_slideshow (image_url, display_order) VALUES (?, ?)").run(image_url, display_order || 0);
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.delete("/api/hero-slideshow/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can manage slideshow" });
    }
    db.prepare("DELETE FROM hero_slideshow WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Upload Route
  app.post("/api/upload", authenticateToken, upload.single("file"), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  app.post("/api/properties/:id/take-unit", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can manage units" });
    }
    const property = db.prepare("SELECT available_units FROM properties WHERE id = ?").get(req.params.id) as { available_units: number };
    if (property && property.available_units > 0) {
      db.prepare("UPDATE properties SET available_units = available_units - 1 WHERE id = ?").run(req.params.id);
      res.json({ success: true, available_units: property.available_units - 1 });
    } else {
      res.status(400).json({ error: "No units available" });
    }
  });

  app.post("/api/properties/:id/release-unit", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can manage units" });
    }
    const property = db.prepare("SELECT available_units, total_units FROM properties WHERE id = ?").get(req.params.id) as { available_units: number, total_units: number };
    if (property && property.available_units < property.total_units) {
      db.prepare("UPDATE properties SET available_units = available_units + 1 WHERE id = ?").run(req.params.id);
      res.json({ success: true, available_units: property.available_units + 1 });
    } else {
      res.status(400).json({ error: "All units are already available" });
    }
  });

  app.post("/api/maintenance", (req, res) => {
    const { property_id, tenant_name, issue_description, priority } = req.body;
    const info = db.prepare(`
      INSERT INTO maintenance_requests (property_id, tenant_name, issue_description, priority)
      VALUES (?, ?, ?, ?)
    `).run(property_id, tenant_name, issue_description, priority);
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.get("/api/blog", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      console.log("Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware initialized successfully.");
    } catch (viteError) {
      console.error("Failed to initialize Vite middleware:", viteError);
      // Fallback for when Vite fails
      app.get("/", (req, res) => {
        res.status(500).send("Vite initialization failed. Please check server logs.");
      });
    }
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

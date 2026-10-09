// import pg from 'pg';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';

// dotenv.config();

// const { Pool } = pg;

// // PostgreSQL Connection configuration
// const dbConfig = {
//   host: process.env.PGHOST || 'localhost',
//   port: parseInt(process.env.PGPORT || '5432', 10),
//   user: process.env.PGUSER || 'postgres',
//   password: process.env.PGPASSWORD || '',
//   database: process.env.PGDATABASE || 'cems',
// };

// export let pool = new Pool(dbConfig);

// // Helper function to execute queries safely
// export const query = (text, params) => pool.query(text, params);

// // Formatters to ensure 100% compatibility with frontend
// export function formatUser(row) {
//   if (!row) return null;
//   return {
//     _id: String(row.id),
//     id: row.id,
//     name: row.name,
//     email: row.email,
//     role: row.role,
//     department: row.department,
//     studentId: row.student_id || '',
//     createdAt: row.created_at,
//   };
// }

// export function formatEvent(row) {
//   if (!row) return null;
//   return {
//     _id: String(row.id),
//     id: row.id,
//     title: row.title,
//     description: row.description,
//     category: row.category,
//     date: row.date,
//     time: row.time,
//     venue: row.venue,
//     registrationDeadline: row.registration_deadline,
//     capacity: row.capacity,
//     registeredCount: row.registered_count || 0,
//     coordinator: row.coordinator_id
//       ? {
//           _id: String(row.coordinator_id),
//           id: row.coordinator_id,
//           name: row.coordinator_name || '',
//           email: row.coordinator_email || '',
//           department: row.coordinator_dept || '',
//         }
//       : null,
//     image: row.image,
//     createdAt: row.created_at,
//   };
// }

// export async function initDb() {
//   console.log(`[DB] Connecting to PostgreSQL at ${dbConfig.host}:${dbConfig.port}...`);

//   if (!dbConfig.password) {
//     console.warn('\n[!] NOTICE: PGPASSWORD in backend/.env is currently empty.');
//     console.warn('[!] Please open backend/.env and set your PostgreSQL password:');
//     console.warn('[!] PGPASSWORD=your_actual_postgres_password\n');
//   }

//   // Step 1: Ensure database exists
//   try {
//     const adminPool = new Pool({
//       ...dbConfig,
//       database: 'postgres', // Connect to default postgres DB first to check/create 'cems'
//     });
//     const checkDb = await adminPool.query(
//       "SELECT 1 FROM pg_database WHERE datname = $1",
//       [dbConfig.database]
//     );
//     if (checkDb.rowCount === 0) {
//       console.log(`[DB] Database "${dbConfig.database}" does not exist. Creating it...`);
//       await adminPool.query(`CREATE DATABASE "${dbConfig.database}"`);
//       console.log(`[DB] Database "${dbConfig.database}" created.`);
//     }
//     await adminPool.end();
//   } catch (err) {
//     console.log(`[DB] Setup note: ${err.message}`);
//   }

//   // Close previous pool if active
//   if (pool) {
//     try {
//       await pool.end();
//     } catch {}
//   }

//   // Step 2: Connect to target database (with automatic fallback to 'postgres' DB)
//   let targetDb = dbConfig.database;
//   try {
//     pool = new Pool({ ...dbConfig, database: targetDb });
//     await pool.query('SELECT 1');
//   } catch (err) {
//     if (err.code === '3D000') {
//       console.log(`[DB] Database "${targetDb}" not found. Falling back to default "postgres" database...`);
//       targetDb = 'postgres';
//       pool = new Pool({ ...dbConfig, database: targetDb });
//       await pool.query('SELECT 1');
//     } else {
//       throw err;
//     }
//   }

//   // Step 3: Create Tables
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       role VARCHAR(50) DEFAULT 'student',
//       department VARCHAR(255) NOT NULL,
//       student_id VARCHAR(100) DEFAULT '',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS events (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(255) NOT NULL,
//       description TEXT NOT NULL,
//       category VARCHAR(50) NOT NULL,
//       date TIMESTAMP NOT NULL,
//       time VARCHAR(100) NOT NULL,
//       venue VARCHAR(255) NOT NULL,
//       registration_deadline TIMESTAMP NOT NULL,
//       capacity INT NOT NULL,
//       registered_count INT DEFAULT 0,
//       coordinator_id INT REFERENCES users(id) ON DELETE SET NULL,
//       image TEXT,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS registrations (
//       id SERIAL PRIMARY KEY,
//       student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//       event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
//       status VARCHAR(50) DEFAULT 'registered',
//       registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(student_id, event_id)
//     );
//   `);

//   console.log('[DB] PostgreSQL tables verified (users, events, registrations).');

//   // Step 4: Seed Demo Data if users table is empty
//   const countRes = await pool.query('SELECT COUNT(*) FROM users');
//   const userCount = parseInt(countRes.rows[0].count, 10);

//   if (userCount === 0) {
//     console.log('[DB] Database is empty. Seeding initial demo accounts and events...');
//     await seedDemoData();
//   } else {
//     console.log(`[DB] Found ${userCount} existing users in database.`);
//   }
// }

// async function seedDemoData() {
//   const hashedPassword = await bcrypt.hash('Password@123', 10);

//   const adminRes = await pool.query(
//     `INSERT INTO users (name, email, password, role, department)
//      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
//     ['Campus Admin', 'admin@campus.edu', hashedPassword, 'admin', 'Administration']
//   );

//   const facultyRes = await pool.query(
//     `INSERT INTO users (name, email, password, role, department)
//      VALUES ($1, $2, $3, $4, $5) RETURNING id`,
//     ['Dr. Sarah Jenkins', 'faculty@campus.edu', hashedPassword, 'faculty', 'Computer Science']
//   );

//   const studentRes = await pool.query(
//     `INSERT INTO users (name, email, password, role, department, student_id)
//      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
//     ['Alex Johnson', 'student@campus.edu', hashedPassword, 'student', 'Computer Science', 'CS-2026-042']
//   );

//   const facultyId = facultyRes.rows[0].id;

//   const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
//   const in10Days = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
//   const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

//   await pool.query(
//     `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
//      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//     [
//       'National Campus Hackathon 2026',
//       'A 24-hour sprint to build innovative software solutions with industry mentors.',
//       'technical',
//       in14Days,
//       '09:00 AM - 09:00 PM',
//       'Innovation Center - Lab A',
//       in10Days,
//       60,
//       facultyId,
//       'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
//     ]
//   );

//   await pool.query(
//     `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
//      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//     [
//       'Spring Harmony: Music & Dance Gala',
//       'The annual cultural festival with band showcases and dance competitions.',
//       'cultural',
//       in7Days,
//       '05:00 PM - 10:00 PM',
//       'University Main Auditorium',
//       in5Days,
//       150,
//       facultyId,
//       'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60',
//     ]
//   );

//   await pool.query(
//     `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
//      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
//     [
//       'Inter-College T20 Cricket Tournament',
//       'Knock-out tournament for campus cricket teams. Medals and trophies.',
//       'sports',
//       in14Days,
//       '08:00 AM - 05:00 PM',
//       'Campus Sports Ground',
//       in10Days,
//       40,
//       facultyId,
//       'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60',
//     ]
//   );

//   console.log('[DB] Demo data seeded successfully into PostgreSQL!');
// }



import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

// Supabase Cloud vs Local PostgreSQL configuration
const poolConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase Cloud
  }
  : {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'cems',
  };

export let pool = new Pool(poolConfig);

// Helper function to execute queries safely
export const query = (text, params) => pool.query(text, params);

// Formatters to ensure 100% compatibility with frontend
export function formatUser(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    studentId: row.student_id || '',
    createdAt: row.created_at,
  };
}

export function formatEvent(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    date: row.date,
    time: row.time,
    venue: row.venue,
    registrationDeadline: row.registration_deadline,
    capacity: row.capacity,
    registeredCount: row.registered_count || 0,
    coordinator: row.coordinator_id
      ? {
        _id: String(row.coordinator_id),
        id: row.coordinator_id,
        name: row.coordinator_name || '',
        email: row.coordinator_email || '',
        department: row.coordinator_dept || '',
      }
      : null,
    image: row.image,
    createdAt: row.created_at,
  };
}

export async function initDb() {
  console.log('[DB] Connecting to PostgreSQL / Supabase...');

  // Step 1: Create Tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      department VARCHAR(255) NOT NULL,
      student_id VARCHAR(100) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      date TIMESTAMP NOT NULL,
      time VARCHAR(100) NOT NULL,
      venue VARCHAR(255) NOT NULL,
      registration_deadline TIMESTAMP NOT NULL,
      capacity INT NOT NULL,
      registered_count INT DEFAULT 0,
      coordinator_id INT REFERENCES users(id) ON DELETE SET NULL,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'registered',
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, event_id)
    );
  `);

  console.log('[DB] PostgreSQL / Supabase tables verified (users, events, registrations).');

  // Step 2: Seed Demo Data if users table is empty
  const countRes = await pool.query('SELECT COUNT(*) FROM users');
  const userCount = parseInt(countRes.rows[0].count, 10);

  if (userCount === 0) {
    console.log('[DB] Database is empty. Seeding initial demo accounts and events into Supabase...');
    await seedDemoData();
  } else {
    console.log(`[DB] Found ${userCount} existing users in database.`);
  }
}

async function seedDemoData() {
  const hashedPassword = await bcrypt.hash('Password@123', 10);

  const adminRes = await pool.query(
    `INSERT INTO users (name, email, password, role, department)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    ['Campus Admin', 'admin@campus.edu', hashedPassword, 'admin', 'Administration']
  );

  const facultyRes = await pool.query(
    `INSERT INTO users (name, email, password, role, department)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    ['Dr. Sarah Jenkins', 'faculty@campus.edu', hashedPassword, 'faculty', 'Computer Science']
  );

  const studentRes = await pool.query(
    `INSERT INTO users (name, email, password, role, department, student_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    ['Alex Johnson', 'student@campus.edu', hashedPassword, 'student', 'Computer Science', 'CS-2026-042']
  );

  const facultyId = facultyRes.rows[0].id;

  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const in10Days = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      'National Campus Hackathon 2026',
      'A 24-hour sprint to build innovative software solutions with industry mentors.',
      'technical',
      in14Days,
      '09:00 AM - 09:00 PM',
      'Innovation Center - Lab A',
      in10Days,
      60,
      facultyId,
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    ]
  );

  await pool.query(
    `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      'Spring Harmony: Music & Dance Gala',
      'The annual cultural festival with band showcases and dance competitions.',
      'cultural',
      in7Days,
      '05:00 PM - 10:00 PM',
      'University Main Auditorium',
      in5Days,
      150,
      facultyId,
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60',
    ]
  );

  await pool.query(
    `INSERT INTO events (title, description, category, date, time, venue, registration_deadline, capacity, coordinator_id, image)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      'Inter-College T20 Cricket Tournament',
      'Knock-out tournament for campus cricket teams. Medals and trophies.',
      'sports',
      in14Days,
      '08:00 AM - 05:00 PM',
      'Campus Sports Ground',
      in10Days,
      40,
      facultyId,
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=60',
    ]
  );

  console.log('[DB] Demo data seeded successfully into Supabase!');
}
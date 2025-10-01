import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",   // username phpMyAdmin kamu
  password: "",   // password phpMyAdmin (kosong kalau default XAMPP)
  database: "teman_tani_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database teman_tani_db");
});

export default db;

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'geomoment_v4.db';
let dbInstance = null; 

export const openDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbInstance;
};

export const initDatabase = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS moments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        photo_path TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      );
    `);
    console.log("Database & Tabel 'moments' V3 siap tempur!");
  } catch (error) {
    console.error("Gagal menginisialisasi database:", error);
  }
};

export const insertMoment = async (title, content, date, photoPath, latitude, longitude) => {
  const db = await openDatabase();
  try {
  
    const result = await db.runAsync(
      `INSERT INTO moments (title, content, date, photo_path, latitude, longitude) 
       VALUES ($title, $content, $date, $photo, $lat, $lon);`,
      {
        $title: title,
        $content: content,
        $date: date,
        $photo: photoPath,
        $lat: latitude,
        $lon: longitude
      }
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Gagal menyimpan momen:", error);
    throw error;
  }
};

export const getAllMoments = async () => {
  const db = await openDatabase();
  try {
    return await db.getAllAsync('SELECT * FROM moments ORDER BY id DESC;');
  } catch (error) {
    console.error("Gagal mengambil data momen:", error);
    throw error;
  }
};


export const updateMoment = async (id, title, content, photoPath, latitude, longitude) => {
  const db = await openDatabase();
  try {
    await db.runAsync(
      `UPDATE moments 
       SET title = $title, content = $content, photo_path = $photo, latitude = $lat, longitude = $lon
       WHERE id = $id;`,
      {
        $id: id,
        $title: title,
        $content: content,
        $photo: photoPath,
        $lat: latitude,
        $lon: longitude
      }
    );
    console.log(`Momen ${id} berhasil diperbarui.`);
  } catch (error) {
    console.error("Gagal memperbarui momen:", error);
    throw error;
  }
};

export const deleteMoment = async (id) => {
  const db = await openDatabase();
  try {
    await db.runAsync('DELETE FROM moments WHERE id = $id;', { $id: id });
    console.log(`Momen ${id} dihapus.`);
  } catch (error) {
    console.error("Gagal menghapus:", error);
    throw error;
  }
};

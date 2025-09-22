import knex from 'knex';
import config from './knexfile.js';

const db = knex(config.development);

db.raw('SELECT 1+1 AS result')
  .then(res => {
    console.log("✅ Kết nối DB thành công:", res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Lỗi kết nối DB:", err.message);
    process.exit(1);
  });

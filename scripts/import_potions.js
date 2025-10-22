#!/usr/bin/env node
// 将 DB/Stditems/药水.json 导入到指定的 SQLite 数据库的 StdItems 表
// 用法: node scripts/import_potions.js --db "C:\path\to\data.db" [--file DB/Stditems/药水.json]

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

function usage() {
  console.log('用法: node scripts/import_potions.js --db "C:\\path\\to\\data.db" [--file DB/Stditems/药水.json]');
  process.exit(1);
}

const argv = require('minimist')(process.argv.slice(2));
const dbPath = argv.db || argv.d;
if (!dbPath) usage();
const jsonFile = argv.file || argv.f || path.join(__dirname, '..', 'DB', 'Stditems', '药水.json');

if (!fs.existsSync(jsonFile)) {
  console.error('找不到 JSON 文件:', jsonFile);
  process.exit(2);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
} catch (e) {
  console.error('读取或解析 JSON 失败:', e.message);
  process.exit(3);
}

// 打开数据库
const db = new Database(dbPath);

// 根据仓库里的 CREATE TABLE StdItems 结构，我们只填充常见字段；
// 对不存在的字段使用 NULL。这里列出脚本会写入的列（可根据需要扩展）。
const columns = [
  'Name','Stdmode','Shape','Weight','Anicount','Source','Reserved','Looks','DuraMax',
  'Ac','Ac2','Mac','Mac2','Dc','Dc2','Mc','Mc2','Sc','Sc2','Need','NeedLevel','Price','Stock',
  'Color','OverLap','HP','MP','Light','Horse','Element','Expand1','Expand2','Expand3','Expand4','Expand5',
  'InsuranceCurrency','InsuranceGold'
  // 其余元素和字段可按需追加
];

// 准备 INSERT 与 UPDATE 语句
const placeholders = columns.map(()=>'?').join(', ');
const insertSql = `INSERT INTO StdItems (${columns.join(',')}) VALUES (${placeholders})`;
const insertStmt = db.prepare(insertSql);

// 为 UPDATE 构建 SET 子句（按 columns）
const setClause = columns.map(col => `${col} = ?`).join(', ');
const updateSql = `UPDATE StdItems SET ${setClause} WHERE Name = ? AND Stdmode = ?`;
const updateStmt = db.prepare(updateSql);

const upsertMany = db.transaction((rows) => {
  for (const r of rows) {
    const vals = columns.map(col => {
      switch (col.toLowerCase()) {
        case 'name': return r.name ?? null;
        case 'stdmode': return r.stdmode ?? null;
        case 'looks': return r.looks ?? null;
        case 'duramax': return r.duraMax ?? r.duramax ?? null;
        case 'hp': return r.hp ?? null;
        case 'mp': return r.mp ?? null;
        default:
          const key = Object.keys(r).find(k=>k.toLowerCase()===col.toLowerCase());
          return key ? r[key] : null;
      }
    });

    // 先尝试 UPDATE：columns 的值 + WHERE 参数（Name, Stdmode）
    const updateParams = vals.concat([ (r.name ?? null), (r.stdmode ?? null) ]);
    const info = updateStmt.run(updateParams);
    if (info.changes === 0) {
      // 若未更新任何行则执行 INSERT
      insertStmt.run(vals);
    }
  }
});

try {
  upsertMany(data);
  console.log('导入完成，已处理', data.length, '条记录（插入或更新）。');
} catch (e) {
  console.error('导入失败:', e.message);
  process.exit(4);
} finally {
  db.close();
}

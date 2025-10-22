#!/usr/bin/env node
// 创建 SQLite 数据库并建立三张表：Magic, StdItems, Monster
// 使用方法：node scripts/create_db.js --db "C:\path\to\game.db" [--gbk]
// --gbk : 把文本字段以 GBK 编码后作为 BLOB 存入（注意：SQLite 本身仍使用 UTF-8/UTF-16，无法把数据库编码设为 GBK）

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const argv = require('minimist')(process.argv.slice(2));

function usage() {
  console.log('用法: node scripts/create_db.js --db "C:\\path\\to\\game.db" [--force]');
  console.log('--force: 若文件已存在则覆盖（默认不覆盖）');
  process.exit(1);
}

const dbPath = argv.db || argv.d;
if (!dbPath) usage();
const force = !!argv.force;

if (fs.existsSync(dbPath) && !force) {
  console.error('数据库文件已存在。若要覆盖请使用 --force。路径：', dbPath);
  process.exit(2);
}

// 确保目录存在
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

if (fs.existsSync(dbPath) && force) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Note: SQLite internal TEXT encoding is UTF-8/UTF-16; SQLite 不支持 GBK 作为 PRAGMA encoding 的值.
// 我们仍然创建含 TEXT 列的表，但当 --gbk 时，建议应用以 BLOB 形式写入 GBK bytes（读取时需解码）。

// 构建 CREATE TABLE 语句，MagID 和 Idx 定义为自增主键
const createMagic = `CREATE TABLE IF NOT EXISTS Magic (
    MagID        INTEGER PRIMARY KEY AUTOINCREMENT,
    MagName      TEXT,
    EffectType   INTEGER,
    Effect       INTEGER,
    Spell        INTEGER,
    Power        INTEGER,
    MaxPower     INTEGER,
    DefSpell     INTEGER,
    DefPower     INTEGER,
    DefMaxPower  INTEGER,
    Job          INTEGER,
    NeedL1       INTEGER,
    L1Train      INTEGER,
    NeedL2       INTEGER,
    L2Train      INTEGER,
    NeedL3       INTEGER,
    L3Train      INTEGER,
    Delay        INTEGER,
    Descr        TEXT,
    NeedL4       INTEGER,
    L4Train      INTEGER,
    NeedL5       INTEGER,
    L5Train      INTEGER,
    NeedL6       INTEGER,
    L6Train      INTEGER,
    NeedL7       INTEGER,
    L7Train      INTEGER,
    NeedL8       INTEGER,
    L8Train      INTEGER,
    NeedL9       INTEGER,
    L9Train      INTEGER,
    NeedL10      INTEGER,
    L10Train     INTEGER,
    NeedL11      INTEGER,
    L11Train     INTEGER,
    NeedL12      INTEGER,
    L12Train     INTEGER,
    NeedL13      INTEGER,
    L13Train     INTEGER,
    NeedL14      INTEGER,
    L14Train     INTEGER,
    NeedL15      INTEGER,
    L15Train     INTEGER,
    MaxTrainLv   INTEGER,
    CanUpgrade   INTEGER,
    MaxUpgradeLv INTEGER
);`;

const createStdItems = `CREATE TABLE IF NOT EXISTS StdItems (
    Idx               INTEGER PRIMARY KEY AUTOINCREMENT,
    Name              TEXT,
    Stdmode           INTEGER,
    Shape             INTEGER,
    Weight            INTEGER,
    Anicount          INTEGER,
    Source            INTEGER,
    Reserved          INTEGER,
    Looks             INTEGER,
    DuraMax           INTEGER,
    Ac                INTEGER,
    Ac2               INTEGER,
    Mac               INTEGER,
    Mac2              INTEGER,
    Dc                INTEGER,
    Dc2               INTEGER,
    Mc                INTEGER,
    Mc2               INTEGER,
    Sc                INTEGER,
    Sc2               INTEGER,
    Need              INTEGER,
    NeedLevel         INTEGER,
    Price             INTEGER,
    Stock             INTEGER,
    Color             INTEGER,
    OverLap           INTEGER,
    HP                INTEGER,
    MP                INTEGER,
    Light             INTEGER,
    Horse             INTEGER,
    Element           INTEGER,
    Expand1           INTEGER,
    Expand2           INTEGER,
    Expand3           INTEGER,
    Expand4           INTEGER,
    Expand5           INTEGER,
    InsuranceCurrency INTEGER,
    InsuranceGold     INTEGER,
    Element1          INTEGER,
    Element2          INTEGER,
    Element3          INTEGER,
    Element4          INTEGER,
    Element5          INTEGER,
    Element6          INTEGER,
    Element7          INTEGER,
    Element8          INTEGER,
    Element9          INTEGER,
    Element10         INTEGER,
    Element11         INTEGER,
    Element12         INTEGER,
    Element13         INTEGER,
    Element14         INTEGER,
    Element15         INTEGER,
    Element16         INTEGER,
    Element17         INTEGER,
    Element18         INTEGER,
    Element19         INTEGER,
    Element20         INTEGER,
    UniqueItem        INTEGER,
    ItemType          INTEGER,
    ItemSet           INTEGER,
    Smite             INTEGER,
    Droprate          INTEGER,
    Igndef            INTEGER,
    DamAdd            INTEGER,
    DamReb            INTEGER,
    DcReDu            INTEGER,
    McReDu            INTEGER,
    ExpAdd            INTEGER,
    Bind              INTEGER,
    Shine             INTEGER,
    Reference         INTEGER
);`;

const createMonster = `CREATE TABLE IF NOT EXISTS Monster (
    Name        TEXT,
    Race        INTEGER,
    RaceImg     INTEGER,
    Appr        INTEGER,
    Lvl         INTEGER,
    Undead      INTEGER,
    CoolEye     INTEGER,
    Exp         INTEGER,
    HP          INTEGER,
    MP          INTEGER,
    AC          INTEGER,
    MAC         INTEGER,
    DC          INTEGER,
    DCMAX       INTEGER,
    MC          INTEGER,
    SC          INTEGER,
    SPEED       INTEGER,
    HIT         INTEGER,
    WALK_SPD    INTEGER,
    WalkStep    INTEGER,
    WaLkWait    INTEGER,
    ATTACK_SPD  INTEGER,
    EXPLOREITEM INTEGER,
    INLEVEL     INTEGER,
    IPEXP       INTEGER
);`;

try {
  db.exec('BEGIN');
  db.exec(createMagic);
  db.exec(createStdItems);
  db.exec(createMonster);
  db.exec('COMMIT');
  console.log('数据库创建成功:', dbPath);
} catch (e) {
  db.exec('ROLLBACK');
  console.error('创建数据库或表时出错:', e.message);
  process.exit(3);
} finally {
  db.close();
}

// 脚本结束：不包含 GBK 专用逻辑或示例。

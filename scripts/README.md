此脚本用于将 `DB/Stditems/药水.json` 导入到指定的 SQLite 数据库表 `StdItems`。

依赖：

安装依赖（PowerShell）:

```powershell
cd .\scripts
npm init -y ; npm install better-sqlite3 minimist
```

运行示例（PowerShell）：

```powershell
# 使用默认 JSON 文件路径
node .\import_potions.js --db "C:\path\to\your.db"

# 指定 JSON 文件
node .\import_potions.js --db "C:\path\to\your.db" --file "..\DB\Stditems\药水.json"
```

注意：脚本简单映射了一些常用字段（Idx/Name/Stdmode/Looks/DuraMax/HP/MP）；如果你的 `StdItems` 表包含更多必需字段，请告诉我我会扩展映射，并可添加事务回滚与备份选项。

创建数据库脚本
-----------------
还提供了 `create_db.js`，用于在指定路径创建 SQLite 数据库并建立三张表（Magic、StdItems、Monster），其中 `MagID` 与 `Idx` 被定义为自增主键。

用法（PowerShell）：
```powershell
# 创建数据库（若文件存在请使用 --force 覆盖）
node .\create_db.js --db "C:\path\to\game.db"

# 如果需要以 GBK 字节存储文本（写入时需以 BLOB 形式写入 GBK bytes），使用 --gbk
node .\create_db.js --db "C:\path\to\game.db" --gbk
```

说明：SQLite 内部编码仍为 UTF-8/UTF-16，无法将数据库本身设为 GBK。`--gbk` 会提示你在插入数据时将字符串编码为 GBK 并以 BLOB 写入，读取时需手动解码。

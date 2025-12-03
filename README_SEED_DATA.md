# 如何填充 Tasks 和 Info Cards 数据

## 问题
如果 "Nhiệm vụ" (Tasks) 和 "Thông tin" (Info Cards) 区域显示为空，说明数据库表还没有被填充数据。

## 解决步骤

### 方法 1: 在 Supabase Dashboard 执行 SQL

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择您的项目
3. 点击左侧菜单的 **"SQL Editor"**
4. 点击 **"New Query"**
5. 复制 `database_seed_tasks_info.sql` 文件的全部内容
6. 粘贴到 SQL Editor
7. 点击 **"Run"** 或按 `Cmd/Ctrl + Enter`
8. 等待执行完成（应该看到 "Success" 消息）

### 方法 2: 使用 Supabase CLI（如果已安装）

```bash
supabase db execute -f database_seed_tasks_info.sql
```

## 验证数据已插入

执行 SQL 后，您应该看到：
- ✅ `tasks` 表有 8 条记录
- ✅ `info_cards` 表有 10 条记录

在 Supabase Dashboard 中：
1. 点击 **"Table Editor"**
2. 选择 `tasks` 表，应该看到 8 行数据
3. 选择 `info_cards` 表，应该看到 10 行数据

## 刷新应用

执行 SQL 后：
1. 刷新浏览器页面（硬刷新：`Cmd + Shift + R`）
2. "Nhiệm vụ" 区域应该显示 8 个任务
3. "Thông tin" 区域应该显示 10 张信息卡片

## 如果仍然为空

如果执行 SQL 后仍然显示为空，请检查：

1. **环境变量**：确保 `.env.local` 中有正确的 Supabase 连接信息
2. **表名**：确保表名是 `tasks` 和 `info_cards`（不是 `task` 或 `info_card`）
3. **浏览器控制台**：打开开发者工具（F12），查看是否有错误信息
4. **API 响应**：访问 `http://localhost:3001/api/tasks` 和 `http://localhost:3001/api/info` 查看返回的数据


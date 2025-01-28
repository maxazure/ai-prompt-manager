# AI Prompt Manager

基于 Next.js 和 Supabase 构建的 AI 提示管理工具，用于存储和管理各类 AI 对话提示。

## 功能特点

- 📝 提示的增删改查
- 🏷️ 分类管理
- 💾 数据导入导出
- 🔍 快速搜索
- 🎨 美观的用户界面

## 技术栈

- Next.js 14
- TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui

## 开始使用

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd ai-prompt-manager
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 到 `.env.local` 并填写你的 Supabase 配置：
```bash
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

4. 启动开发服务器
```bash
npm run dev
```

### 数据库设置

在 Supabase 中创建以下表结构：

```sql
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 使用说明

1. **添加提示**
   - 点击 "Add New Prompt" 按钮
   - 填写标题、类别和内容
   - 点击保存

2. **编辑提示**
   - 点击列表中的提示进行编辑
   - 修改完成后点击保存

3. **删除提示**
   - 点击提示旁的删除按钮

4. **导入/导出**
   - 使用导入/导出功能备份或迁移数据

## 贡献指南

欢迎提交 Pull Request 或创建 Issue。

## 许可证

MIT
# 極簡部落格

一個使用 Nanoc 構建的極簡風格部落格，專注於內容和閱讀體驗。

## 特色

- 🎨 **極簡設計**：清晰、優雅的介面設計
- 📱 **響應式**：在各種設備上都有良好的體驗
- ⚡ **快速載入**：靜態網站，載入速度極快
- 📝 **Markdown 支援**：使用 Markdown 撰寫文章
- 🏷️ **標籤系統**：文章分類和標籤功能
- 🚀 **Vercel 部署**：一鍵部署到 Vercel

## 技術架構

- **Nanoc**：靜態網站生成器
- **Kramdown**：Markdown 處理器
- **Rouge**：語法高亮
- **CSS Grid & Flexbox**：現代化佈局
- **Inter 字體**：優秀的閱讀體驗

## 本地開發

### 前置需求

- Ruby 2.7 或更高版本
- Bundler

### 安裝步驟

1. 克隆專案：
```bash
git clone <your-repo-url>
cd minimal-blog
```

2. 安裝依賴：
```bash
bundle install
```

3. 本地預覽：
```bash
bundle exec nanoc view
```

網站將在 `http://localhost:3000` 運行。

### 建置網站

```bash
bundle exec nanoc
```

建置後的檔案將在 `output/` 目錄中。

## 撰寫文章

1. 在 `content/posts/` 目錄中創建新的 `.md` 檔案
2. 使用以下格式的 Front Matter：

```markdown
---
title: "文章標題"
date: 2024-01-15
slug: "article-slug"
tags: ["標籤1", "標籤2"]
excerpt: "文章摘要"
---

# 文章內容

在這裡撰寫你的文章內容...
```

## 部署到 Vercel

### 方法一：通過 Vercel CLI

1. 安裝 Vercel CLI：
```bash
npm i -g vercel
```

2. 登入 Vercel：
```bash
vercel login
```

3. 部署：
```bash
npm run deploy
```

### 方法二：通過 Git 整合

1. 將專案推送到 GitHub
2. 在 Vercel 控制台中連接你的 GitHub 倉庫
3. Vercel 會自動檢測並部署你的網站

## 自訂設定

### 修改網站資訊

編輯 `nanoc.yaml` 檔案中的 `base_url` 設定：

```yaml
base_url: https://your-blog.vercel.app
```

### 修改樣式

主要的 CSS 檔案位於 `content/styles/main.css`，你可以：

- 修改 CSS 變數來改變色彩主題
- 調整字體和間距
- 添加新的樣式規則

### 添加新頁面

在 `content/` 目錄中創建新的 `.md` 或 `.html` 檔案即可。

## 目錄結構

```
.
├── content/           # 網站內容
│   ├── posts/        # 部落格文章
│   ├── styles/       # CSS 樣式
│   ├── index.html    # 首頁
│   └── about.md      # 關於頁面
├── layouts/          # 頁面佈局
│   ├── default.html  # 預設佈局
│   └── post.html     # 文章佈局
├── lib/              # Ruby 輔助函數
├── output/           # 建置輸出目錄
├── Gemfile           # Ruby 依賴
├── nanoc.yaml        # Nanoc 配置
├── Rules             # 建置規則
├── vercel.json       # Vercel 配置
└── package.json      # Node.js 配置
```

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！

---

享受寫作的樂趣！ ✨ 
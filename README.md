# Elias Sun 的極簡部落格

一個專注於內容的極簡風格個人部落格，使用 Nanoc 靜態網站生成器構建。

## ✨ 特色

- **極簡設計**：專注於內容，去除不必要的視覺元素
- **Markdown 寫作**：使用 Markdown 格式輕鬆撰寫文章
- **自動構建**：從 Markdown 自動生成靜態 HTML
- **響應式設計**：完美適配桌面、平板和手機
- **快速載入**：靜態網站，載入速度快
- **SEO 友好**：優化的 HTML 結構和 meta 標籤

## 🛠️ 技術架構

- **靜態網站生成器**：Nanoc 4.12
- **Markdown 處理**：Kramdown
- **語法高亮**：Rouge
- **部署平台**：Vercel
- **字體**：Inter (Google Fonts)

## 📁 項目結構

```
blog/
├── content/                 # 內容目錄
│   ├── posts/              # Markdown 文章
│   │   ├── article-1.md
│   │   └── article-2.md
│   └── index.html          # 首頁模板
├── layouts/                # 佈局模板
│   └── post.erb           # 文章佈局
├── styles/                 # CSS 樣式
│   └── main.css
├── output/                 # 構建輸出（自動生成）
├── nanoc.yaml             # Nanoc 配置
├── Rules                  # 構建規則
└── Gemfile                # Ruby 依賴
```

## 🚀 本地開發

### 1. 安裝依賴

```bash
# 安裝 Ruby 依賴
bundle install
```

### 2. 構建網站

```bash
# 使用構建腳本
ruby build.rb

# 或直接使用 Nanoc
nanoc compile
```

### 3. 本地預覽

```bash
# 啟動本地服務器
nanoc view

# 訪問 http://localhost:3000
```

## ✍️ 撰寫新文章

### 1. 創建新文章

```bash
# 複製模板
cp new-post-template.md content/posts/your-article.md
```

### 2. 編輯文章

編輯 `content/posts/your-article.md`，修改 front matter：

```yaml
---
title: "文章標題"
date: 2025-01-01
slug: "article-slug"
tags: ["標籤1", "標籤2"]
excerpt: "文章摘要"
---
```

### 3. 構建和部署

```bash
# 構建網站
ruby build.rb

# 提交更改
git add .
git commit -m "添加新文章：文章標題"
git push origin main
```

## 📝 文章格式

### Front Matter

每篇文章開頭需要包含 YAML front matter：

```yaml
---
title: "文章標題"
date: 2025-01-01
slug: "article-slug"
tags: ["標籤1", "標籤2"]
excerpt: "文章摘要"
---
```

### Markdown 語法

支持標準的 Markdown 語法：

- **標題**：`# ## ###`
- **列表**：`- 1.`
- **引用**：`>`
- **代碼**：`` `code` ``
- **代碼塊**：``` ``` ```

## 🎨 自定義樣式

編輯 `styles/main.css` 來自定義網站外觀：

- 修改顏色變數
- 調整字體大小
- 更改佈局間距
- 添加動畫效果

## 🚀 部署

### Vercel 部署

1. 連接 GitHub 倉庫到 Vercel
2. 設置構建命令：`bundle install && nanoc compile`
3. 設置輸出目錄：`output`
4. 自動部署

### 手動部署

```bash
# 構建網站
nanoc compile

# 上傳 output/ 目錄到您的服務器
```

## 🔧 配置選項

### nanoc.yaml

- `base_url`：網站基礎 URL
- `text_extensions`：支援的文件格式
- `output_dir`：輸出目錄

### Rules

- 編譯規則：如何處理不同類型的文件
- 路由規則：URL 結構
- 佈局規則：使用哪個佈局模板

## 📚 常用命令

```bash
# 構建網站
nanoc compile

# 本地預覽
nanoc view

# 檢查網站
nanoc check

# 清理構建文件
nanoc prune

# 查看幫助
nanoc help
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 📞 聯繫

- Twitter: [@hostulu](https://x.com/hostulu)
- Telegram: [@tuluduck](https://t.me/tuluduck)

---

*專注於內容，回歸文字的本質。* 
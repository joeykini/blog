const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// --- 配置 ---
const config = {
  outputDir: 'output',
  postsDir: 'content/posts',
  stylesDir: 'styles',
  assets: {
      icon: 'https://s3.bmp.ovh/imgs/2025/06/21/aa53503d0994dad6.jpg'
  }
};

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
  sanitize: false,
});
const renderer = new marked.Renderer();
renderer.html = (html) => html;
marked.use({ renderer });

// --- 工具函数 ---
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return '未知日期';
    }
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
}

// --- HTML 生成函数 ---

async function generatePostHTML(post) {
  const postDir = path.join(config.outputDir, 'posts', post.slug);
  await fs.ensureDir(postDir);
  
  const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
  const dateString = formatDate(post.date);

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Elias Sun</title>
    <meta name="description" content="${post.excerpt}">
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/jpeg" href="${config.assets.icon}">
</head>
<body>
    <main class="main">
        <article class="post">
            <header class="post-header">
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <time class="post-date" datetime="${post.date.toISOString().split('T')[0]}">${dateString}</time>
                    <div class="post-tags">${tagsHTML}</div>
                </div>
            </header>
            <div class="post-content">${post.content}</div>
        </article>
        <nav class="post-nav"><a href="/" class="post-nav-link">← 返回首頁</a></nav>
    </main>
    <footer class="footer"><p>&copy; ${new Date().getFullYear()} Elias Sun.</p></footer>
</body>
</html>`;

  await fs.writeFile(path.join(postDir, 'index.html'), html);
}

async function generateIndexHTML(posts) {
    console.log('🏠 正在從頭生成首頁...');
    if (posts.length === 0) {
      console.warn('[警告] 沒有有效的文章可以用來生成首頁！');
    } else {
      console.log(`[Info] 將使用 ${posts.length} 篇文章生成首頁。最新文章: "${posts[0].title}"`);
    }

    const postsByMonth = posts.reduce((acc, post) => {
        const month = `${post.date.getFullYear()}年${String(post.date.getMonth() + 1).padStart(2, '0')}月`;
        if (!acc[month]) acc[month] = [];
        acc[month].push(post);
        return acc;
    }, {});

    const timelineHTML = Object.entries(postsByMonth).map(([month, monthPosts], idx) => `
        <div class="timeline-item">
            <div class="timeline-date" onclick="toggleTimeline(this)">${month}</div>
            <div class="timeline-posts">
                ${monthPosts.map(post => `<a href="${post.path}" class="timeline-link">${post.title}</a>`).join('')}
            </div>
        </div>`).join('');

    const postsHTML = posts.map(post => `
        <li class="post-item">
            <a href="${post.path}" class="post-link">
                <h3 class="post-item-title">${post.title}</h3>
                <div class="post-item-meta">
                    <time class="post-date" datetime="${post.date.toISOString().split('T')[0]}">${formatDate(post.date)}</time>
                    <span>·</span>
                    <div class="post-tags">${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
                </div>
                <p class="post-item-excerpt">${post.excerpt}</p>
            </a>
        </li>`).join('');

    const finalHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elias Sun</title>
    <meta name="description" content="Elias Sun 的個人部落格">
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/jpeg" href="${config.assets.icon}">
</head>
<body>
    <main class="main">
        <div class="container">
            <div class="content">
                <div class="hero">
                    <h1 class="hero-title">Elias Sun</h1>
                    <div class="social-links">
                        <a href="https://x.com/hostulu" target="_blank" rel="noopener noreferrer" class="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                        <a href="https://t.me/tuluduck" target="_blank" rel="noopener noreferrer" class="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
                    </div>
                </div>
                <section class="posts-section"><ul class="posts-list">${postsHTML}</ul></section>
            </div>
            <aside class="sidebar">
                <div class="timeline-widget"><div class="timeline">${timelineHTML}</div></div>
            </aside>
        </div>
    </main>
    <footer class="footer"><p>&copy; ${new Date().getFullYear()} Elias Sun.</p></footer>
    <script>
      function toggleTimeline(element) {
        const posts = element.nextElementSibling;
        posts.classList.toggle('expanded');
      }
      document.addEventListener('DOMContentLoaded', () => {
        const firstTimeline = document.querySelector('.timeline-posts');
        if (firstTimeline) firstTimeline.classList.add('expanded');
      });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(config.outputDir, 'index.html'), finalHtml);
    console.log('✅ 首頁生成完成');
}

// --- 主構建流程 ---

async function build() {
  console.log('🚀 開始構建部落格...');
  try {
    // 1. 清理並準備輸出目錄
    await fs.remove(config.outputDir);
    await fs.ensureDir(config.outputDir);

    // 2. 複製靜態文件 (CSS 和 vercel.json)
    await fs.copy(config.stylesDir, path.join(config.outputDir, 'styles'));
    if (await fs.pathExists('vercel.json')) {
        await fs.copy('vercel.json', path.join(config.outputDir, 'vercel.json'));
    }

    // 3. 處理所有 Markdown 文章
    const allPosts = [];
    const postsDir = config.postsDir;
    if (await fs.pathExists(postsDir)) {
        const files = await fs.readdir(postsDir);
        for (const file of files) {
            if (path.extname(file) !== '.md') continue;
            try {
                const filePath = path.join(postsDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const { data, content: markdownContent } = matter(content);

                // 健壯性檢查
                if (!data.title || !data.date) {
                    console.warn(`[警告] 跳過 ${file}：缺少 title 或 date。`);
                    continue;
                }
                const date = new Date(data.date);
                if (isNaN(date.getTime())) {
                    console.warn(`[警告] 跳過 ${file}：無效的日期格式 "${data.date}"。請使用 YYYY-MM-DD 格式。`);
                    continue;
                }

                const post = {
                    ...data,
                    date,
                    tags: Array.isArray(data.tags) ? data.tags : [],
                    excerpt: data.excerpt || markdownContent.substring(0, 100).replace(/<[^>]*>/g, ''),
                    slug: data.slug || path.basename(file, '.md'),
                    content: marked(markdownContent),
                    path: `/posts/${data.slug || path.basename(file, '.md')}/`
                };
                allPosts.push(post);
            } catch (e) {
                console.error(`[錯誤] 處理 ${file} 時發生嚴重錯誤: `, e);
            }
        }
    }
    
    // 4. 按日期排序所有有效的文章
    const sortedPosts = allPosts.sort((a, b) => b.date - a.date);

    // 5. 為每篇文章生成獨立的 HTML 頁面
    for (const post of sortedPosts) {
        await generatePostHTML(post);
    }
    console.log(`✅ 已為 ${sortedPosts.length} 篇文章生成獨立頁面。`);

    // 6. 生成包含所有文章列表的 index.html
    await generateIndexHTML(sortedPosts);

    console.log('🎉 構建成功完成！');
    console.log(`📁 輸出目錄: ${config.outputDir}/`);
  } catch (error) {
    console.error('❌ 構建失敗:', error);
    process.exit(1);
  }
}

// 執行構建
build(); 
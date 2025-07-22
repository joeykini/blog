const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// --- 配置 ---
const config = {
  contentDir: 'content',
  outputDir: 'output',
  postsDir: 'content/posts',
  stylesDir: 'styles'
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

// --- 核心函数 ---

async function copyStaticFiles() {
  console.log('📁 複製靜態文件...');
  await fs.copy(config.stylesDir, path.join(config.outputDir, 'styles'));
  const staticFiles = ['vercel.json'];
  for (const file of staticFiles) {
    if (await fs.pathExists(file)) {
      await fs.copy(file, path.join(config.outputDir, file));
    }
  }
}

async function processPosts() {
  console.log('📝 開始處理文章...');
  const posts = [];
  const postsDir = config.postsDir;
  if (!await fs.pathExists(postsDir)) return posts;

  const files = await fs.readdir(postsDir);
  console.log(`[Info] 在 ${postsDir} 發現 ${files.length} 個文件。`);

  for (const file of files) {
    if (path.extname(file) !== '.md') continue;

    try {
      console.log(`[Info] 正在處理: ${file}`);
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      if (!data.title) {
        console.warn(`[警告] 跳過 ${file}：缺少 'title'。`);
        continue;
      }
      if (!data.date) {
        console.warn(`[警告] 跳過 ${file}：缺少 'date'。`);
        continue;
      }
      
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        console.warn(`[警告] 跳過 ${file}：無效的日期格式 "${data.date}"。請使用 'YYYY-MM-DD' 格式。`);
        continue;
      }

      const post = {
        ...data,
        date,
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: data.excerpt || '',
        slug: data.slug || path.basename(file, '.md'),
        content: marked(markdownContent),
        path: `/posts/${data.slug || path.basename(file, '.md')}/`
      };

      posts.push(post);
      await generatePostHTML(post);
    } catch (e) {
      console.error(`[錯誤] 處理 ${file} 時發生錯誤:`, e);
    }
  }
  
  console.log(`[Info] 成功解析 ${posts.length} 篇文章。`);
  return posts.sort((a, b) => b.date - a.date);
}

async function generatePostHTML(post) {
  const postDir = path.join(config.outputDir, 'posts', post.slug);
  await fs.ensureDir(postDir);
  
  const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
  const dateString = `${post.date.getFullYear()}年${String(post.date.getMonth() + 1).padStart(2, '0')}月${String(post.date.getDate()).padStart(2, '0')}日`;

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
    <link rel="icon" type="image/jpeg" href="https://s3.bmp.ovh/imgs/2025/06/21/aa53503d0994dad6.jpg">
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
    <footer class="footer"><p>&copy; 2025 Elias Sun.</p></footer>
</body>
</html>`;

  await fs.writeFile(path.join(postDir, 'index.html'), html);
}

async function generateIndex(posts) {
  console.log('🏠 開始生成首頁...');
  if (posts.length === 0) {
      console.warn('[警告] 沒有任何有效的文章可以用來生成首頁！');
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
        <div class="timeline-posts${idx === 0 ? ' expanded' : ''}">
            ${monthPosts.map(post => `<a href="${post.path}" class="timeline-link">${post.title}</a>`).join('')}
        </div>
    </div>`).join('');

  const postsHTML = posts.map(post => {
      const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
      const dateString = `${post.date.getFullYear()}年${String(post.date.getMonth() + 1).padStart(2, '0')}月${String(post.date.getDate()).padStart(2, '0')}日`;
      return `
      <li class="post-item">
          <a href="${post.path}" class="post-link">
              <h3 class="post-item-title">${post.title}</h3>
              <div class="post-item-meta">
                  <time class="post-date" datetime="${post.date.toISOString().split('T')[0]}">${dateString}</time>
                  <span>·</span>
                  <div class="post-tags">${tagsHTML}</div>
              </div>
              <p class="post-item-excerpt">${post.excerpt}</p>
          </a>
      </li>`;
  }).join('');
  
  const indexTemplate = await fs.readFile('content/index.html', 'utf-8');
  // Simple replacement, assuming your index.html has placeholders
  // A more robust solution would use a proper templating engine
  const finalHtml = indexTemplate
      .replace(/<% @articles.each do |article| %>.*?<% end %>/s, postsHTML)
      .replace(/<% @articles.group_by.*?<% end %>/s, timelineHTML);

  await fs.writeFile(path.join(config.outputDir, 'index.html'), finalHtml);
  console.log('✅ 首頁生成完成');
}

async function build() {
  console.log('🚀 開始構建部落格...');
  try {
    await fs.remove(config.outputDir);
    await fs.ensureDir(config.outputDir);
    await copyStaticFiles();
    const posts = await processPosts();
    await generateIndex(posts);
    console.log('✅ 構建完成！');
    console.log(`📁 輸出目錄: ${config.outputDir}/`);
  } catch (error) {
    console.error('❌ 構建失敗:', error);
    process.exit(1);
  }
}

build(); 
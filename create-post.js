const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createPost() {
  console.log('📝 創建新文章\n');
  
  try {
    // 獲取文章信息
    const title = await question('文章標題: ');
    const slug = await question('文章 slug (URL 路徑): ');
    const date = await question('發布日期 (YYYY-MM-DD): ');
    const tags = await question('標籤 (用逗號分隔): ');
    const excerpt = await question('文章摘要: ');
    
    // 生成 front matter
    const frontMatter = `---
title: "${title}"
date: ${date}
slug: "${slug}"
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]
excerpt: "${excerpt}"
---

# ${title}

這裡是文章的開頭段落。

## 第一個章節

這是第一個章節的內容。

## 第二個章節

這是第二個章節的內容。

## 結語

這是文章的結尾部分。

---

*最後的註釋或簽名*
`;

    // 創建文章文件
    const postsDir = 'content/posts';
    await fs.ensureDir(postsDir);
    
    const fileName = `${slug}.md`;
    const filePath = path.join(postsDir, fileName);
    
    await fs.writeFile(filePath, frontMatter);
    
    console.log(`\n✅ 文章創建成功！`);
    console.log(`📁 文件位置: ${filePath}`);
    console.log(`📝 請編輯文件添加內容，然後運行 npm run build`);
    
  } catch (error) {
    console.error('❌ 創建文章失敗:', error);
  } finally {
    rl.close();
  }
}

createPost(); 
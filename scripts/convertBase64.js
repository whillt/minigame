import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function base64ToImage(base64Str, filePath) {
  // 1. 移除 data:image/gif;base64, 前缀
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
  
  // 2. 解码base64数据
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  // 3. 写入文件
  writeFileSync(filePath, imageBuffer);
}

try {
  // 读取原始文件内容
  const vueContent = readFileSync(join(__dirname, '../src/components/test.vue'), 'utf-8');

  // 匹配base64图片字符串
  const base64Regex = /'(data:image\/gif;base64,[^']+)'/g;
  const matches = vueContent.match(base64Regex);

  if (!matches || matches.length === 0) {
    console.log('No base64 images found in the file');
    process.exit(0);
  }

  // 创建icons目录
  const iconDir = join(__dirname, '../src/assets/icons');
  if (!existsSync(iconDir)) {
    mkdirSync(iconDir, { recursive: true });
  }

  // 处理第一个匹配的图片
  try {
    const base64String = matches[0].slice(1, -1); // 移除单引号
    console.log('Processing first image...');
    console.log('Base64 string length:', base64String.length);

    const fileName = 'icon1.gif';
    const filePath = join(iconDir, fileName);
    
    base64ToImage(base64String, filePath);
    console.log(`Successfully saved ${fileName}`);
    
    // 验证文件是否创建
    if (existsSync(filePath)) {
      const stats = readFileSync(filePath);
      console.log('Generated file size:', stats.length, 'bytes');
    }

  } catch (err) {
    console.error('Error in image conversion:', err);
  }

} catch (err) {
  console.error('Error:', err);
} 
# Upside Down Text - 上下颠倒文字转换器

一个功能强大的上下颠倒文字转换工具，支持文字上下颠倒、反向排列和镜像效果，可用于社交媒体、聊天和创意设计。

## 主要特点

- 💫 **多种转换效果**：上下颠倒、反向排列、镜像效果、组合效果
- 📱 **响应式设计**：完美适配手机和电脑
- 🔍 **SEO优化**：符合搜索引擎优化标准
- 🌍 **多语言支持**：预留多语言扩展接口
- ⚡ **纯静态实现**：无需数据库，部署简单
- 🎨 **优雅界面**：现代化设计，使用体验良好
- 👩‍💻 **开发友好**：提供HTML Unicode转换支持

## 项目结构

```
upside-down-text/
├── index.html          # 主页
├── style.css           # 样式表
├── script.js           # JavaScript代码
├── robots.txt          # 搜索引擎爬虫指南
├── sitemap.xml         # 网站地图
├── privacy.html        # 隐私政策页面
├── terms.html          # 使用条款页面
└── assets/             # 资源文件夹
    ├── fonts/          # 字体文件
    └── images/         # 图片资源
```

## 部署指南

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/yourusername/upside-down-text.git
cd upside-down-text
```

2. 使用本地服务器运行项目
```bash
# 如果安装了Python 3
python -m http.server

# 或者使用Node.js
npx http-server
```

3. 在浏览器中访问 `http://localhost:8000`

### 线上部署

由于是纯静态网站，可以部署在任何静态网站托管服务上：

- **GitHub Pages**: 将仓库推送到GitHub，启用GitHub Pages
- **Netlify**: 连接仓库或上传构建文件
- **Vercel**: 导入项目或上传文件
- **传统虚拟主机**: 上传所有文件到服务器

## 多语言支持扩展

如需添加更多语言支持，请按以下步骤操作：

1. 在 `assets/lang/` 目录下为每种语言创建翻译文件，例如 `en.json`, `ja.json` 等
2. 参考 `script.js` 中的注释，实现语言切换逻辑
3. 在界面中添加语言选择器

## 自定义与二次开发

### 修改样式
编辑 `style.css` 文件，修改颜色、字体等样式。网站使用CSS变量，可以快速更改主题色。

### 添加新功能
编辑 `script.js` 文件，所有核心功能均在此文件中实现。

### 添加新特效
如需添加新的文字转换效果，请在 `script.js` 中：

1. 添加对应的映射表
2. 创建新的转换函数
3. 在界面上添加相应按钮
4. 绑定事件处理函数

## 贡献指南

欢迎提交Pull Request或Issue来改进项目。在提交前，请确保：

1. 代码风格一致
2. 测试所有功能在主流浏览器中正常工作
3. 遵循响应式设计原则
4. 优化SEO和可访问性

## 许可证

本项目采用 MIT 许可证 - 详情请查看 LICENSE 文件 
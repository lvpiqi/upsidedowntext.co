# Cloudflare Pages 多语言网站设置指南

## 文件说明

本项目包含以下配置文件，用于在Cloudflare Pages上实现干净的URL路径：

1. **_redirects** - Cloudflare Pages重定向规则
2. **_headers** - 自定义HTTP头设置
3. **_routes.json** - Cloudflare Pages路由配置
4. **.htaccess** - Apache服务器配置（如果使用Apache托管）

## Cloudflare Pages设置步骤

### 1. 部署网站到Cloudflare Pages

1. 登录Cloudflare仪表板
2. 进入"Pages"部分
3. 点击"创建项目"
4. 连接您的GitHub仓库
5. 设置构建配置（如果需要）
6. 部署项目

### 2. 设置自定义域名

1. 在Pages项目中点击"自定义域"
2. 添加您的域名
3. 按照Cloudflare的指示完成DNS设置

### 3. 配置Cloudflare Transform Rules（如果_redirects不起作用）

如果_redirects文件不能满足您的需求，可以使用Cloudflare Transform Rules：

1. 在Cloudflare仪表板中进入"Rules" > "Transform Rules"
2. 点击"创建规则"
3. 设置以下规则：

   **针对中文页面：**
   - 条件：`(http.request.uri.path matches "^/zh/.*")`
   - 操作：URL重写到 `/zh/index.html`

   **针对日语页面：**
   - 条件：`(http.request.uri.path matches "^/ja/.*")`
   - 操作：URL重写到 `/ja/index.html`

## 注意事项

1. **index.html隐藏** - Cloudflare Pages会自动处理index.html的隐藏，访问/zh/会自动加载/zh/index.html

2. **缓存问题** - 如果更改不立即生效，可能是由于缓存。在Cloudflare仪表板中清除缓存。

3. **路径一致性** - 确保所有内部链接使用一致的URL格式（带或不带尾部斜杠）

4. **调试** - 如果遇到问题，检查Cloudflare Pages的"函数日志"以获取更多信息

## 最佳实践

1. 始终使用相对路径进行内部链接
2. 为所有语言版本添加适当的`hreflang`标签
3. 在sitemap.xml中包含所有语言版本的URL
4. 确保robots.txt允许搜索引擎访问所有语言版本 
# 单词小屋

127 个课本单词与短语的认读、英语听写、中文默写和错词复习，面向 iPad，同时支持手机和 PC。由原有本地单文件网页迁入，原文件保留。

- 公开源码：https://github.com/ZhiYanRen/word-house
- 正式网站：首次部署中，验证成功后回填。
- 应用岛：https://zhiyanren.github.io/app-island/
- 纯静态 HTML/CSS/JavaScript，无后端、账号或远程数据库。

## 开发与验证

Node.js 22.16+，`npm ci` 安装构建和验证依赖。

```sh
npm test
npm run build
npm start
# 另一个终端
npm run test:browser
```

本机预览 http://127.0.0.1:4176/ 。构建仅将 public/ 复制到 dist/ 并生成应用图标，dist/ 不提交。测试使用本机 Chrome，可通过 BROWSER_EXECUTABLE 更改浏览器路径。浏览器模拟不等于真机验证。

## 发布

main 为主干，`.github/workflows/pages.yml` 在 main push 时验证并通过 GitHub Actions 发布 dist/ 到本仓库 Pages；PR 只验证。GITHUB_TOKEN 使用最小权限，不需个人令牌或跨仓库密钥。

## 数据与限制

错词仅保存在当前浏览器的 localStorage，不跨设备同步；从 file:// 改为正式网站后不会自动迁移旧错词。清理网站数据会删除错词。存储被禁用时可继续本次练习并看到提示。

发音使用浏览器 speechSynthesis 和设备英语语音，实际声音取决于系统语音安装情况；不提供录音或云端评分。不能发音时仍可练中文默写。不承诺离线首次打开；添加主屏幕支持独立窗口显示。

Logo 原稿 public/assets/logo.svg，PNG 图标由构建生成，设计与行为约定见 DESIGN.md。项目通过应用岛登记脚本同步。

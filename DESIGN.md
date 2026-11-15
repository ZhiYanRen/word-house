---
version: alpha
name: "单词小屋"
description: "沿用本地学习网页的绿屋与课本卡片，聚焦127个课本词的认读、听写、默写"
colors:
  primary: "#23634e"
  ink: "#243e37"
  paper: "#fffdf6"
  background: "#f6f3e8"
  border: "#d8ded0"
  accent: "#f4bc65"
typography:
  sans:
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  display:
    fontFamily: 'Georgia, serif'
rounded:
  DEFAULT: "12px"
  panel: "24px"
spacing:
  card-gap: "14px"
  page-max: "1000px"
components:
  button:
    minHeight: "44px"
  word-card:
    desktopColumns: 4
    phoneColumns: 2
---

# 单词小屋设计与行为约定

## Overview

对象是练习课本英语词汇的儿童，主要使用 iPad。以已有绿色纸卡和“小屋”主题为依据，只补齐上线所需品牌、布局和反馈，不重新设计学习内容。UI/UX Pro Max 首次 design-system 搜索返回了不适用的销售营销布局；缩窄 product 搜索确认 Educational App 的柔和圆角与 Micro-interactions 合适。保留原配色和字体，不采用其营销首屏或外部字体。

## Colors / Typography

运行时 public/index.html 的 :root 是配色唯一来源，本文件镜像：primary→--green→主操作；ink→--ink→正文；paper→--paper→卡片；border→--line→边框；accent→--orange→品牌屋顶。背景延续原 #f6f3e8。中文系统字体，英文词与成绩使用 Georgia，避免字体网络依赖。只提供浅色主题。

## Layout / Shapes / Elevation

紧凑标题、四个始终可见的功能按钮和学习内容，不使用营销大首屏。iPad/PC 单词四列；620px以下两列，导航两行。自然滚动和安全区内边距，输入不被固定底栏挡住。面板圆角24px，手机18px内边距，延续纸卡轻阴影。

## Iconography

原创 public/assets/logo.svg 是绿底小屋、金色屋顶和打开的单词本。导航44px图形旁文字命名，图片装饰性空 alt。构建生成 favicon.png 32px、apple-touch-icon.png 180px、manifest 图标192/512px，均位于 dist/assets/。SVG 保留源文件，所有引用相对路径，小屋图形留安全边距。原词库 emoji 是认读插图，不作为品牌或导航图标。

## Motion / Components

按钮按压和选中反馈160ms，面板入场180ms；尊重 prefers-reduced-motion，无复杂动画，无 GSAP。全局 scrollbar 有标准属性、WebKit hover/active 和 forced-colors 降级。44px触控目标、可见焦点、原生按钮和带标签输入框。

单一文件应用，不含多组 list/detail 或破坏性操作；不另建重复 UX-CONTRACT。共同行为约定与所有权如下：

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Form | render/check | public/index.html | 听写/中文默写/错词 | tests/browser.mjs |
| Scrollbar | global CSS | public/index.html | forced-colors | tests/browser.mjs |
| Toast | feedback/audioStatus live regions | public/index.html | 正确/错误/存储与语音失败 | tests/browser.mjs |

四种模式由 setMode/render 控制；练习切换会开始新一轮，这是原文件行为。空错词提供开始听写；空答案保留当前题并提示；检查后可下一题，错误进入错词，正确从错词移除，成绩显示本轮结果。错词 localStorage 失败提示并退化到会话内使用。没有请求中的远程业务数据，也无网络加载状态。语音不可用可重复播放或改用中文默写。无服务端、登录、同步或离线首次打开承诺。

## Verification

npm test 验证词库完整性与相对路径；npm run test:browser 覆盖iPad横竖屏、手机横竖屏、PC、键盘输入、成绩、空状态、错词持久化、存储和语音失败、减少动态效果、主屏幕展示模式的浏览器模拟。不将模拟视为真机或实际声音验收。

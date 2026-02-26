# protfolio-v2

基于 Next.js 16 的个人主页及作品集项目（Homepage + Blog + ...）。

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 常用脚本

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:run
```

## 功能概览

- 博客列表与详情（`content/blog/*.mdx`）
- 路由分组布局（列表与详情解耦）
- SEO：metadata / sitemap / robots / JSON-LD / 动态 OG 图
- RSS：`/rss.xml`
- 草稿与再验证接口：`/api/draft`、`/api/draft/disable`、`/api/revalidate`
- 本地托管字体（`next/font/local` + `app/fonts`）
- 博客长文增强：TOC（`H2-H3`）/ 锚点高亮 / 滚动高亮 / 阅读时间+字数 / MDX 提示块
- 测试：Vitest（RSS / TOC / 阅读指标）

## MDX 写作约定

- 目录生成规则：仅提取 `##` 与 `###` 进入右侧 TOC。
- 标题锚点：`h2/h3` 自动注入锚点，可直接 `#hash` 跳转。
- 提示块语法：

```mdx
<Note title="阅读提示">
先看目录，再按需跳读。
</Note>

<Warning>
请注意线上环境的配置与权限控制。
</Warning>
```

## 阅读指标口径

- 仅统计正文可读文本（排除围栏代码块）。
- `inline code` 计入字数。
- 字数按“去空白后的字符数”统计。
- 阅读时间按 `300 字/分钟` 估算，向上取整且最小为 `1` 分钟。

## 环境变量

```bash
BLOG_DRAFT_SECRET=your_draft_secret
BLOG_REVALIDATE_SECRET=your_revalidate_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`BLOG_REVALIDATE_SECRET` 未设置时，会回退使用 `BLOG_DRAFT_SECRET`。

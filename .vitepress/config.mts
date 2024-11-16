// noinspection JSUnusedGlobalSymbols

import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN', //语言，可选 en-US
  title: "CRS Docs",
  description: "",
  cleanUrls:true,
  base: '/',
  head: [
    ['link',{ rel: 'icon', href: '/pwa/Frame-72.png'}],
  ],
  pwa: {
    outDir: ".vitepress/dist", // 输出目录
    registerType: "autoUpdate", // 注册类型为自动更新
    includeManifestIcons: false, // 不包含清单图标
    manifest: {
      id: "/", // 清单 ID
      name: "CRS Docs", // 应用名称
      short_name: "CRS Doc", // 应用的短名称
      description: "铸造字系统帮助文档", // 应用的描述
      theme_color: "#ffffff", // 主题颜色
      icons: [
        {
          src: "/pwa/Frame-120.png", // 图标路径
          sizes: "120x120", // 图标尺寸
          type: "image/png", // 图标类型
        },
        {
          src: "/pwa/Frame-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa/Frame-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"], // 匹配需要缓存的文件类型
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, // 匹配需要缓存的 Google 字体
          handler: "CacheFirst", // 缓存优先策略
          options: {
            cacheName: "google-fonts-cache", // 缓存名称
            expiration: {
              maxEntries: 10, // 最大缓存条目数
              maxAgeSeconds: 60 * 60 * 24 * 365, // 缓存有效期，365天
            },
            cacheableResponse: {
              statuses: [0, 200], // 缓存的响应状态码
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, // 匹配需要缓存的 Google 字体
          handler: "CacheFirst", // 缓存优先策略
          options: {
            cacheName: "gstatic-fonts-cache", // 缓存名称
            expiration: {
              maxEntries: 10, // 最大缓存条目数
              maxAgeSeconds: 60 * 60 * 24 * 365, // 缓存有效期，365天
            },
            cacheableResponse: {
              statuses: [0, 200], // 缓存的响应状态码
            },
          },
        },
        {
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i, // 匹配需要缓存的 jsdelivr 图片
          handler: "NetworkFirst", // 网络优先策略
          options: {
            cacheName: "jsdelivr-images-cache", // 缓存名称
            expiration: {
              maxEntries: 10, // 最大缓存条目数
              maxAgeSeconds: 60 * 60 * 24 * 7, // 缓存有效期，7天
            },
            cacheableResponse: {
              statuses: [0, 200], // 缓存的响应状态码
            },
          },
        },
      ],
    },
  },
  markdown: {
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    config: (md) => {
      // 创建 markdown-it 插件
      md.use((md) => {
        const defaultRender = md.render
        md.render = function (...args) {

          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          defaultContent = defaultContent
              .replace(/NOTE/g, '提醒')
              .replace(/TIP/g, '建议')
              .replace(/IMPORTANT/g, '重要')
              .replace(/WARNING/g, '警告')
              .replace(/CAUTION/g, '注意')
          // 返回渲染的内容
          return defaultContent
        }
      })
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/pwa/Frame-72.png',
    nav: [
      { text: '主页', link: '/' },
      { text: '说明文档', link: '/Docs/help-docs' }
    ],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/xin1201946/CRS-Docs/blob/master/:path', // 改成自己的仓库
      text: '在GitHub编辑本页'
    },
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '说明文档', link: '/Docs/help-docs' },
          { text: 'API 文档', link: '/Docs/api-docs' }
        ]
      }
    ],
    footer: {
      message: 'Casting Character Recognition System Docs',
      copyright: `Copyright © ${new Date().getFullYear()} present Canfeng`
      // 自动更新时间
      //copyright: `Copyright © 2019-${new Date().getFullYear()} present Evan You`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xin1201946/CRS' }
    ]
  }
})

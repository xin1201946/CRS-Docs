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
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} present Canfeng`
      // 自动更新时间
      //copyright: `Copyright © 2019-${new Date().getFullYear()} present Evan You`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xin1201946/CRS' }
    ]
  }
})

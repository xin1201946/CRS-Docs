// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';
import MyLayout from './components/MyLayout.vue'

export default {
  extends: DefaultTheme,

  setup() {
    const route = useRoute()
    const { frontmatter } = useData();
    onMounted(() => {
        mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
    });

    // giscus配置
    giscusTalk({
          repo: 'xin1201946/Talk', //仓库
          repoId: 'R_kgDONQLKjw', //仓库ID
          category: 'Announcements', // 讨论分类
          categoryId: 'DIC_kwDONQLKj84CkUfu', //讨论分类ID
          mapping: 'pathname',
          inputPosition: 'bottom',
          lang: 'zh-CN',
        },
        {
          frontmatter, route
        },
        //默认值为true，表示已启用，此参数可以忽略；
        //如果为false，则表示未启用
        //您可以使用“comment:true”序言在页面上单独启用它
        true
    );
  },

  Layout: () => {
    return h(MyLayout, null, {
    })
  },
} satisfies Theme

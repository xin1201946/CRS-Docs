import{R as i}from"./chunks/theme.Blx7yKpr.js";import{R as o,a5 as u,a6 as c,a7 as l,d as f,u as d,v as m,s as h,a8 as g,a9 as A,aa as v,a3 as P,ab as R,ac as w,ad as y,ae as C,af as b,ag as E,ah as S}from"./chunks/framework.Cdfw5sbD.js";function p(e){if(e.extends){const a=p(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=p(i),T=f({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=d();return m(()=>{h(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&g(),A(),v(),s.setup&&s.setup(),()=>P(s.Layout)}});async function D(){globalThis.__VITEPRESS__=!0;const e=j(),a=_();a.provide(R,e);const t=w(e.route);return a.provide(y,t),a.component("Content",C),a.component("ClientOnly",b),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:E}),{app:a,router:e,data:t}}function _(){return l(T)}function j(){let e=o,a;return u(t=>{let n=c(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=import(n)),o&&(e=!1),r},s.NotFound)}o&&D().then(({app:e,router:a,data:t})=>{a.go().then(()=>{S(a.route,t.site),e.mount("#app")})});export{D as createApp};

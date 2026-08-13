import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('~/pages/Home.vue') },
    { path: '/search', name: 'search', component: () => import('~/pages/Search.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('~/pages/Favorites.vue') },
    { path: '/recent', name: 'recent', component: () => import('~/pages/Recent.vue') },
    { path: '/faq', name: 'faq', component: () => import('~/pages/Faq.vue') },
    { path: '/tools/:slug', name: 'tool-detail', component: () => import('~/pages/ToolDetail.vue') },
    { path: '/category/:slug', name: 'category', component: () => import('~/pages/Category.vue') },
    { path: '/markdownsoft', name: 'markdownsoft', component: () => import('~/pages/MarkdownSoft.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('~/pages/NotFound.vue') },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, top: 80 }
    }
    return savedPosition ?? { top: 0 }
  },
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import RemonteesView from '../views/RemonteesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RemonteesView
    },
    // ✅ Catch-all → Retour home (évite 404)
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import RemonteesView from '../views/RemonteesView.vue' // ← Remplace HomeView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/remontees' // ← Redirige direct vers remontées
    },
    {
      path: '/remontees',
      name: 'remontees',
      component: RemonteesView // ← Votre page avec formulaires
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/remontees'
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/entities/session";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomePage.vue'),
      meta: { title: 'Головна | Vue Lottery' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/ui/AboutPage.vue'),
      meta: { title: 'Про автора | Vue Lottery' },
    },
    {
      path: '/users',
      name: 'users',
      meta: { requiresAuth: true, title: 'Користувачі | Vue Lottery' },
      component: () => import('@/pages/users/ui/UsersPage.vue'),
      children: [
        {
          path: 'create',
          name: 'user-create',
          meta: { title: 'Створення користувача | Vue Lottery' },
          component: () => import('@/pages/user-form/ui/UserFormPage.vue'),
        },
        {
          path: ':id/edit',
          name: 'user-edit',
          meta: { title: 'Редагування користувача | Vue Lottery' },
          component: () => import('@/pages/user-form/ui/UserFormPage.vue'),
        },
      ],
    },
    {
      path: '/users/:id',
      name: 'user-details',
      meta: { requiresAuth: true, title: 'Деталі користувача | Vue Lottery' },
      component: () => import('@/pages/user-details/ui/UserDetailsPage.vue'),
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/ui/LoginPage.vue'),
      meta: { title: 'Вхід | Vue Lottery', layout: 'AuthLayout' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: { title: '404 | Сторінку не знайдено' },
    },
  ],
})

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || 'Vue Lottery App'
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'users' }
  }
})

export default router

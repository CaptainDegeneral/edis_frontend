import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import SignUp from '@/views/SignUpView.vue'
import SignIn from '@/views/SignInView.vue'
import VerifyEmail from '@/views/VerifyEmailView.vue'
import PasswordReset from '@/views/PasswordResetView.vue'
import PasswordResetConfirm from '@/views/PasswordResetConfirmView.vue'
import pinia from '@/modules/pinia-instance';
import { useUserStore } from '@/store/user-store';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/signup', component: SignUp },
  { path: '/signin', component: SignIn },
  { path: '/verify-email', component: VerifyEmail },
  { path: '/password-reset', component: PasswordReset },
  { path: '/password-reset/:uidb64/:token', name: 'PasswordResetConfirm', component: PasswordResetConfirm },
]

const router = createRouter({ history: createWebHashHistory(import.meta.env.BASE_URL), routes })
const userStore = useUserStore(pinia);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isLoggedIn) {
      next({ path: '/signin', query: { redirect: to.fullPath } });
    } else { next(); }
  } else { next(); }
});

export default router;

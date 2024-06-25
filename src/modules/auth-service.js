import axios from 'axios';
import router from '@/router';
import pinia from '@/modules/pinia-instance';
import { useUserStore } from '@/store/user-store';
import { decrypt } from '@/modules/crypto-utils';

const userStore = useUserStore(pinia);

const authService = {
  login: async function(credentials) {
    try {
      const response = await axios.post('https://edis.onrender.com/auth/signin', credentials)
      if (response.data.success) {
        const { access, refresh } = response.data.data.tokens
        const user = response.data.data
        userStore.login({ access, refresh, user })
        await router.push('/')
        return true
      } else {
        throw new Error(response.data.error)
      }
    } catch (error) {
      throw new Error(error.response.data.message || 'Ошибка при входе в систему.')
    }
  },

  async logout() {
    try {
      const refresh = decrypt(localStorage.getItem('refresh'));
      if (refresh) {
        await axios.post('https://edis.onrender.com/auth/signout', { refresh }, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`
          }
        });
      }
      userStore.logout();
      await router.push('/signin');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      userStore.logout();
      await router.push('/signin');
    }
  },

  async checkAuth() {
    try {
      if (!userStore.isLoggedIn) {
        const accessToken = decrypt(localStorage.getItem('access'));
        const refreshToken = decrypt(localStorage.getItem('refresh'));
        const user = JSON.parse(decrypt(localStorage.getItem('user')));

        if (accessToken && user) {
          userStore.login({ access: accessToken, refresh: refreshToken, user });
          userStore.checkDataIntegrity();
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);
    }
  },

  async refreshToken() {
    const refresh = decrypt(localStorage.getItem('refresh'));
    try {
      const response = await axios.post('https://edis.onrender.com/auth/token-refresh', { refresh });
      const tokens = response.data;
      userStore.updateTokens(tokens.access, tokens.refresh);
      return tokens.access;
    } catch (error) {
      await authService.logout();
      throw error;
    }
  },
};

export { authService };




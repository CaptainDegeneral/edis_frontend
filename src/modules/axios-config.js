// import axios from 'axios';
// import router from '@/router';
// import pinia from '@/modules/pinia-instance';
// import { useUserStore } from '@/store/user-store';
// import { authService } from './auth-service';
//
// const api = axios.create({
//   baseURL: 'https://edis.onrender.com',
//   timeout: 20000,
// });
//
// const userStore = useUserStore(pinia);
//
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = userStore.accessToken;
//     if (accessToken) { config.headers.Authorization = `Bearer ${accessToken}`; }
//     return config;
//   }, (error) => Promise.reject(error)
// );
//
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
//       console.error('Request timeout', error);
//       alert('Превышено время ожидания ответа. Пожалуйста, перезагрузите страницу. Данное сообщение может быть показано несколько раз.');
//       return Promise.reject(error);
//     } else if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const accessToken = await authService.refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         userStore.logout();
//         await router.push('/signin');
//       }
//     } else if (!error.response) {
//       console.error('Network or other error', error);
//       userStore.logout();
//       await router.push('/signin');
//     }
//     return Promise.reject(error);
//   }
// );
//
// export { api };

//
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import router from '@/router';
// import pinia from '@/modules/pinia-instance';
// import { useUserStore } from '@/store/user-store';
// import { authService } from '@/modules/auth-service';
//
// const api = axios.create({
//   baseURL: 'https://edis.onrender.com',
//   timeout: 30000,
// });
//
// const userStore = useUserStore(pinia);
//
// axiosRetry(api, {
//   retries: Infinity,
//   retryCondition: (error) => error.code === 'ECONNABORTED',
//   retryDelay: (retryCount) => {
//     alert(`Повторная попытка: ${retryCount}`);
//     console.log(`Повторная попытка: ${retryCount}`);
//     return axiosRetry.exponentialDelay(retryCount);
//   },
// });
//
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = userStore.accessToken;
//     if (accessToken) { config.headers.Authorization = `Bearer ${accessToken}`; }
//     return config;
//   }, (error) => Promise.reject(error)
// );
//
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const accessToken = await authService.refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         userStore.logout();
//         await router.push('/signin');
//       }
//     } else if (!error.response) {
//       console.error('Network or other error', error);
//       userStore.logout();
//       await router.push('/signin');
//     }
//     return Promise.reject(error);
//   }
// );
//
// export { api };

// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import pinia from '@/modules/pinia-instance';
// import { useUserStore } from '@/store/user-store';
// import { authService } from '@/modules/auth-service';
//
// const api = axios.create({
//   baseURL: 'https://edis.onrender.com',
//   timeout: 5000,
// });
//
// const userStore = useUserStore(pinia);
//
// axiosRetry(api, {
//   retries: Infinity,
//   retryCondition: (error) => {
//     return axiosRetry.isNetworkError(error) || error.code === 'ECONNABORTED' || !error.response;
//   },
//   retryDelay: (retryCount) => {
//     console.log(`Повторная попытка: ${retryCount}`);
//     return axiosRetry.exponentialDelay(retryCount);
//   },
// });
//
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = userStore.accessToken;
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
//
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const accessToken = await authService.refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         await authService.logout();
//       }
//     } else if (!error.response) {
//       // console.error('Network or other error', error);
//       // await authService.logout();
//       console.error('Network or other error', error);
//       return axios(originalRequest);
//     }
//     return Promise.reject(error);
//   }
// );
//
// export { api };

// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import pinia from '@/modules/pinia-instance';
// import { useUserStore } from '@/store/user-store';
// import { authService } from '@/modules/auth-service';
//
// const api = axios.create({
//   baseURL: 'https://edis.onrender.com',
//   timeout: 5000,
// });
//
// const userStore = useUserStore(pinia);
//
// axiosRetry(api, {
//   retries: Infinity,
//   retryCondition: (error) => {
//     return axiosRetry.isNetworkError(error) || error.code === 'ECONNABORTED' || !error.response || error.message.includes('timeout');
//   },
//   retryDelay: (retryCount) => {
//     console.log(`Повторная попытка: ${retryCount}`);
//     return axiosRetry.exponentialDelay(retryCount);
//   },
// });
//
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = userStore.accessToken;
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
//
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const accessToken = await authService.refreshToken();
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         await authService.logout();
//         return Promise.reject(refreshError);
//       }
//     }
//
//     if (axiosRetry.isNetworkError(error) || error.code === 'ECONNABORTED' || !error.response || error.message.includes('timeout')) {
//       console.error('Network or other error', error);
//       return Promise.reject(error);
//     }
//
//     return Promise.reject(error);
//   }
// );
//
// export { api };

import axios from 'axios';
import axiosRetry from 'axios-retry';
import pinia from '@/modules/pinia-instance';
import { useUserStore } from '@/store/user-store';
import { authService } from '@/modules/auth-service';

// Создаем экземпляр axios с базовым URL и таймаутом
const api = axios.create({
  baseURL: 'https://edis.onrender.com',
  timeout: 100000,
});

const userStore = useUserStore(pinia);

// Настраиваем axiosRetry для обработки сетевых ошибок и таймаутов
axiosRetry(api, {
  retries: Infinity, // Не ограничиваем количество повторных попыток
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error)
      || error.code === 'ECONNABORTED'
      || !error.response
      || error.message.includes('timeout');
  },
  retryDelay: (retryCount) => {
    console.log(`Повторная попытка: ${retryCount}`);
    return axiosRetry.exponentialDelay(retryCount);
  },
});

// Интерсептор запросов для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const accessToken = userStore.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор ответов для обработки 401 ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверка на 401 ошибку
    if (error.response && error.response.status === 401) {
      try {
        const accessToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await authService.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api };





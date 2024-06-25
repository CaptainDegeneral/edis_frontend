// import { defineStore } from 'pinia';
// import router from '@/router';
// import CryptoJS from 'crypto-js';

// const ENCRYPTION_KEY = 'Y#CQ&Hq3#bf#Tm3#Rv@$F2!#FvA33eFFb#%zG8ZfNXoX68kVi*3d4Ugv*2tsE7&i&CoU2B*J$&fvzc2OP9x%j4gO5#4@6Mem$6r$#6P#OB4#dvo&G@06%1s%^st2#S9ni#q5&Sh^*Cq9%71ga999CC';

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     accessToken: decrypt(localStorage.getItem('access')) || null,
//     refreshToken: decrypt(localStorage.getItem('refresh')) || null,
//     user: JSON.parse(decrypt(localStorage.getItem('user'))) || null,
//   }),

//   getters: {
//     isLoggedIn: (state) => !!state.accessToken,
//     isAdmin: (state) => state.user && state.user.is_staff,
//   },

//   actions: {
//     login({ access, refresh, user }) {
//       this.accessToken = access;
//       this.refreshToken = refresh;
//       this.user = user;

//       localStorage.setItem('access', encrypt(access));
//       localStorage.setItem('refresh', encrypt(refresh));
//       localStorage.setItem('user', encrypt(JSON.stringify(user)));
//     },

//     logout() {
//       this.accessToken = null;
//       this.refreshToken = null;
//       this.user = null;

//       localStorage.removeItem('access');
//       localStorage.removeItem('refresh');
//       localStorage.removeItem('user');

//       router.push('/signin');
//     },
//   },
// });

// function encrypt(data) {
//   return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
// }

// function decrypt(ciphertext) {
//   if (!ciphertext) return null;
//   const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// }

// import { defineStore } from 'pinia';
// import CryptoJS from 'crypto-js';
// import router from '@/router';

// const ENCRYPTION_KEY = 'Y#CQ&Hq3#bf#Tm3#Rv@$F2!#FvA33eFFb#%zG8ZfNXoX68kVi*3d4Ugv*2tsE7&i&CoU2B*J$&fvzc2OP9x%j4gO5#4@6Mem$6r$#6P#OB4#dvo&G@06%1s%^st2#S9ni#q5&Sh^*Cq9%71ga999CC';

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     accessToken: decrypt(localStorage.getItem('access')) || null,
//     refreshToken: decrypt(localStorage.getItem('refresh')) || null,
//     user: JSON.parse(decrypt(localStorage.getItem('user'))) || null,
//     hash: localStorage.getItem('hash') || null,
//   }),

//   getters: {
//     isLoggedIn: (state) => !!state.accessToken,
//     isAdmin: (state) => state.user && state.user.is_staff,
//   },

//   actions: {
//     login({ access, refresh, user }) {
//       this.accessToken = access;
//       this.refreshToken = refresh;
//       this.user = user;
//       this.hash = hash(JSON.stringify(user));

//       localStorage.setItem('access', encrypt(access));
//       localStorage.setItem('refresh', encrypt(refresh));
//       localStorage.setItem('user', encrypt(JSON.stringify(user)));
//       localStorage.setItem('hash', this.hash);
//     },

//     logout() {
//       this.accessToken = null;
//       this.refreshToken = null;
//       this.user = null;
//       this.hash = null;

//       localStorage.removeItem('access');
//       localStorage.removeItem('refresh');
//       localStorage.removeItem('user');
//       localStorage.removeItem('hash');

//       router.push('/signin');
//     },

//     checkDataIntegrity() {
//       const storedHash = localStorage.getItem('hash');
//       const currentHash = hash(JSON.stringify(this.user));
//       if (storedHash !== currentHash) { this.logout(); }
//     }
//   },
// });

// function encrypt(data) {
//   return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
// }

// function decrypt(ciphertext) {
//   try {
//     if (!ciphertext) return null;
//     const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
//     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   } catch {
//     console.log("error")
//     useUserStore.logout;
//     return null;
//   }
// }

// function hash(data) { return CryptoJS.SHA512(data).toString(); }

import { defineStore } from 'pinia';
import { encrypt, decrypt, hash, checkDataIntegrity } from '@/modules/crypto-utils';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: decrypt(localStorage.getItem('access')) || null,
    refreshToken: decrypt(localStorage.getItem('refresh')) || null,
    user: JSON.parse(decrypt(localStorage.getItem('user'))) || null,
    hash: localStorage.getItem('hash') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAdmin: (state) => state.user && state.user.is_staff,
  },

  actions: {
    login({ access, refresh, user }) {
      this.accessToken = access;
      this.refreshToken = refresh;
      this.user = user;
      this.hash = hash(JSON.stringify(user));

      localStorage.setItem('access', encrypt(access));
      localStorage.setItem('refresh', encrypt(refresh));
      localStorage.setItem('user', encrypt(JSON.stringify(user)));
      localStorage.setItem('hash', this.hash);
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      this.hash = null;

      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      localStorage.removeItem('hash');

      router.push('/signin');
    },

    updateTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;

      localStorage.setItem('access', encrypt(access));
      localStorage.setItem('refresh', encrypt(refresh));
    },

    setUser(user) {
      this.user = user;
      this.hash = hash(JSON.stringify(user));

      localStorage.setItem('user', encrypt(JSON.stringify(user)));
      localStorage.setItem('hash', this.hash);
    },

    checkDataIntegrity() {
      checkDataIntegrity(this);
    }
  },
});


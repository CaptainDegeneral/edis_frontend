import CryptoJS from 'crypto-js';
import router from '@/router';
import { useUserStore } from '@/store/user-store';

const ENCRYPTION_KEY = import.meta.env.ENCRYPTION_KEY;

function encrypt(data) { return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString(); }

function decrypt(ciphertext) {
  try {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    const userStore = useUserStore();
    if (userStore.logout) { userStore.logout(); router.push('/signin'); }
    return null;
  }
}

function hash(data) { return CryptoJS.SHA512(data).toString(); }

function checkDataIntegrity(userStore) {
  const storedHash = localStorage.getItem('hash');
  const currentHash = hash(JSON.stringify(userStore.user));
  if (storedHash !== currentHash) { userStore.logout(); }
}

export { encrypt, decrypt, hash, checkDataIntegrity };

import CryptoJS from 'crypto-js';
import router from '@/router';
import { useUserStore } from '@/store/user-store';

const ENCRYPTION_KEY = 'Y#CQ&Hq3#bf#Tm3#Rv@$F2!#FvA33eFFb#%zG8ZfNXoX68kVi*3d4Ugv*2tsE7&i&CoU2B*J$&fvzc2OP9x%j4gO5#4@6Mem$6r$#6P#OB4#dvo&G@06%1s%^st2#S9ni#q5&Sh^*Cq9%71ga999CC';

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

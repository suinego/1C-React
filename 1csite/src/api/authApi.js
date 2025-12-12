const USERS = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "sonya", password: "sonya" },
]
const STORAGE_KEY = "authUser";

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        const idHash = hashString(`${user.id}:${user.username}:SALT`);
        const payload = { idHash, username: user.username };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
        }
        resolve(payload);
      } else {
        reject(new Error("Неверный логин или пароль"));
      }
    }, 300);
  });
}

function logout() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
  }
  return Promise.resolve();
}

function getAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export default { login, logout, getAuth, STORAGE_KEY };

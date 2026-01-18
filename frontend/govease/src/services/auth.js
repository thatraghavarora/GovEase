const USERS_KEY = "govease_users";
const SESSION_KEY = "govease_session";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const loadUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);
const saveUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const registerLocalUser = (payload) => {
  const users = loadUsers();
  const exists = users.some(
    (user) => user.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (exists) {
    throw new Error("Email already registered");
  }

  const user = {
    id: `user-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    mobile: payload.mobile,
    role: payload.role || "user",
    password: payload.password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return user;
};

export const loginLocalUser = ({ email, password }) => {
  const users = loadUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
};

export const logoutLocalUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = () =>
  safeParse(localStorage.getItem(SESSION_KEY), null);

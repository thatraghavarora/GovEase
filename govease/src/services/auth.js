import { loginAdmin, registerAdmin } from "./api";

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

const setSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const decodeJwtPayload = (token) => {
  const payload = token.split(".")[1];
  if (!payload) {
    throw new Error("Invalid Google credential");
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );

  return JSON.parse(atob(padded));
};

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
  setSession(user);

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

  setSession(user);
  return user;
};

export const loginWithGoogle = (credential) => {
  const profile = decodeJwtPayload(credential);

  if (!profile?.email) {
    throw new Error("Google profile is missing an email");
  }

  const users = loadUsers();
  let user = users.find(
    (item) => item.email.toLowerCase() === profile.email.toLowerCase()
  );

  if (!user) {
    user = {
      id: `user-${Date.now()}`,
      name: profile.name || profile.given_name || "Google User",
      email: profile.email,
      mobile: "",
      role: "user",
      password: null,
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);
  }

  setSession(user);
  return user;
};

export const loginCenterAdmin = async ({ username, password }) => {
  try {
    const response = await loginAdmin({ username, password });
    setSession(response.data);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Admin login failed";
    throw new Error(message);
  }
};

export const registerCenterAdmin = async ({ centerId, centerCode, password }) => {
  try {
    const response = await registerAdmin({ centerId, centerCode, password });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Admin registration failed";
    throw new Error(message);
  }
};

export const logoutLocalUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = () =>
  safeParse(localStorage.getItem(SESSION_KEY), null);

const TOKENS_KEY = "govease_tokens";
const COUNTERS_KEY = "govease_counters";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch (error) {
    return fallback;
  }
};

export const loadTokens = () => safeParse(localStorage.getItem(TOKENS_KEY), []);

const saveTokens = (tokens) =>
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

const loadCounters = () =>
  safeParse(localStorage.getItem(COUNTERS_KEY), {});

const saveCounters = (counters) =>
  localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));

export const createToken = (center, payload) => {
  const tokens = loadTokens();
  const counters = loadCounters();
  const counterKey = `${center.id}-${payload.department || "general"}`;
  const nextNumber = (counters[counterKey] || 0) + 1;
  const token = {
    id: `${center.id}-${Date.now()}`,
    centerId: center.id,
    centerName: center.name,
    centerCode: center.code,
    centerType: center.type,
    department: payload.department || "General",
    createdBy: payload.createdBy || null,
    userName: payload.name,
    userPhone: payload.phone,
    purpose: payload.purpose,
    status: "pending",
    createdAt: new Date().toISOString(),
    tokenNumber: nextNumber,
  };

  counters[counterKey] = nextNumber;
  tokens.push(token);
  saveCounters(counters);
  saveTokens(tokens);

  return token;
};

export const getTokensByCenter = (centerId) =>
  loadTokens()
    .filter((token) => token.centerId === centerId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

export const getTokensByDepartment = (centerId, department) =>
  loadTokens()
    .filter(
      (token) =>
        token.centerId === centerId && token.department === department
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

export const getPendingTokens = (centerId) =>
  getTokensByCenter(centerId).filter((token) => token.status === "pending");

export const getPendingTokensByDepartment = (centerId, department) =>
  getTokensByDepartment(centerId, department).filter(
    (token) => token.status === "pending"
  );

export const getPendingCount = (centerId) =>
  getPendingTokens(centerId).length;

export const getPendingCountByDepartment = (centerId, department) =>
  getPendingTokensByDepartment(centerId, department).length;

export const serveNextToken = (centerId) => {
  const tokens = loadTokens();
  const index = tokens.findIndex(
    (token) => token.centerId === centerId && token.status === "pending"
  );

  if (index === -1) {
    return null;
  }

  tokens[index] = {
    ...tokens[index],
    status: "served",
    servedAt: new Date().toISOString(),
  };

  saveTokens(tokens);
  return tokens[index];
};

export const markTokenCalled = (tokenId) => {
  const tokens = loadTokens();
  const index = tokens.findIndex((token) => token.id === tokenId);

  if (index === -1) {
    return null;
  }

  tokens[index] = {
    ...tokens[index],
    status: "called",
    calledAt: new Date().toISOString(),
  };

  saveTokens(tokens);
  return tokens[index];
};

export const resetTokens = () => {
  localStorage.removeItem(TOKENS_KEY);
  localStorage.removeItem(COUNTERS_KEY);
};

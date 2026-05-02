import config from "./config";

let authToken: string | null = null;

async function getAuthToken(): Promise<string> {
  const response = await fetch(config.authAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: config.email,
      name: config.name,
      rollNo: config.rollNo,
      accessCode: config.accessCode,
      clientID: config.clientID,
      clientSecret: config.clientSecret,
    }),
  });
  const data = await response.json();
  return data.access_token;
}

async function ensureToken(): Promise<string> {
  if (!authToken) {
    authToken = await getAuthToken();
  }
  return authToken;
}

export async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: string,
  message: string
): Promise<void> {
  try {
    const token = await ensureToken();
    const response = await fetch(config.logAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    if (response.status === 401) {
      authToken = null;
      const freshToken = await ensureToken();
      await fetch(config.logAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify({ stack, level, package: pkg, message }),
      });
    }
  } catch (error) {
    process.stderr.write(`[LOGGER FAILED] ${error}\n`);
  }
}

export default Log;
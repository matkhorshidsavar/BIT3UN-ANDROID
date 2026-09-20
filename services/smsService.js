const https = require("https");
const { URL } = require("url");

// در صورتی که کلید کاوه نگار را در پروسه انوایرومنت یا فایل .env ست کرده باشید
const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY || "";

function postJson(urlString, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);

    const req = https.request(
      {
        method: "POST",
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        protocol: url.protocol,
        timeout: timeoutMs,
      },
      (res) => {
        let raw = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });

        res.on("end", () => {
          let data = null;

          try {
            data = raw ? JSON.parse(raw) : null;
          } catch {
            data = raw;
          }

          resolve({
            status: res.statusCode || 0,
            data,
          });
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("Kavenegar request timed out"));
    });

    req.on("error", reject);
    req.end();
  });
}

async function sendLoginOTP(receptor, token) {
  if (!KAVENEGAR_API_KEY) {
    console.log("KAVENEGAR_API_KEY missing. SMS simulated only.");
    console.log("receptor:", receptor);
    console.log("token:", token);

    return { success: true, simulated: true };
  }

  try {
    const url = new URL(`https://api.kavenegar.com/v1/${KAVENEGAR_API_KEY}/verify/lookup.json`);
    url.searchParams.set("receptor", receptor);
    url.searchParams.set("token", token);
    url.searchParams.set("template", "LOGIN"); // مطابق الگو های فایل اکسل شما

    const response = await postJson(url.toString(), 12000);

    if (
      response.data &&
      response.data.return &&
      response.data.return.status === 200
    ) {
      return { success: true };
    }

    return {
      success: false,
      error:
        (response.data &&
          response.data.return &&
          response.data.return.message) ||
        `HTTP ${response.status}`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendLoginOTP };

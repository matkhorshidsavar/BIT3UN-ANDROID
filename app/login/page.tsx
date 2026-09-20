"use client";

import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "otp">("login");
  const [challengeId, setChallengeId] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data?.ok) {
        setError(data?.message || "خطا در ورود");
        return;
      }

      // قرارداد بک‌اند واقعی (پورت 8091): challengeId
      setChallengeId(data.challengeId);
      setMaskedPhone(data.maskedPhone || "");
      setMode("otp");
    } catch (e) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const code = (event.currentTarget.elements.namedItem("code") as HTMLInputElement).value;

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId,
          code,
        }),
      });

      const data = await res.json();

      if (!data?.ok) {
        setError(data?.message || "کد اشتباه است");
        return;
      }

      window.location.href = data.redirect || "/dashboard";
    } catch (e) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h2>ورود به Bit3un</h2>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {mode === "login" ? (
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="ایمیل" required style={{ width: "100%", padding: 10, marginBottom: 12 }} />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
            {loading ? "در حال ارسال..." : "ارسال کد ورود"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          {maskedPhone ? <p style={{ opacity: 0.8 }}>کد به {maskedPhone} ارسال شد</p> : null}
          <input name="code" placeholder="کد تایید" required style={{ width: "100%", padding: 10, marginBottom: 12 }} />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
            {loading ? "در حال تایید..." : "تایید ورود"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setChallengeId("");
              setError("");
            }}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          >
            بازگشت
          </button>
        </form>
      )}
    </main>
  );
}

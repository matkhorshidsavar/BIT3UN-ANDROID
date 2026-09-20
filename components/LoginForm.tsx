"use client";
import React from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  margin: "8px 0",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
};
const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #f0c040, #d4a020)",
  color: "#0a0a0f",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};
const googleBtn: React.CSSProperties = {
  ...buttonStyle,
  background: "#fff",
  color: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

export default function LoginForm() {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: "32px 24px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "24px", color: "#f0c040" }}>ورود / ثبت‌نام</h2>
      <input type="email" placeholder="ایمیل (اختیاری)" style={inputStyle} />
      <input type="tel" placeholder="شماره موبایل" style={inputStyle} />
      <input type="password" placeholder="رمز عبور" style={inputStyle} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
        }}
      >
        <a
          href="/forgot-password"
          style={{ color: "#aaa", fontSize: "14px", textDecoration: "none" }}
        >
          فراموشی رمز عبور؟
        </a>
        <button type="button" style={buttonStyle}>
          ورود
        </button>
      </div>
      <div style={{ margin: "24px 0 12px", color: "#aaa", fontSize: "14px" }}>
        یا
      </div>
      <button style={googleBtn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="24"
          height="24"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        ورود با گوگل
      </button>
    </div>
  );
}

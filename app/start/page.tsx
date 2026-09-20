"use client";
import LoginForm from "@/components/LoginForm";

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a0a0f",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "42px",
  fontWeight: "bold",
  background: "linear-gradient(135deg, #f0c040, #d4a020)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "24px",
  textAlign: "center",
};

const descStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#aaa",
  marginBottom: "40px",
  textAlign: "center",
  maxWidth: "600px",
  lineHeight: 1.8,
};

const socialSection: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap" as React.CSSProperties["flexWrap"],
  justifyContent: "center",
  gap: "24px",
  maxWidth: "600px",
  marginTop: "48px",
};

const socialItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
  textDecoration: "none",
  transition: "opacity 0.3s",
};

export default function StartPage() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>BitSun</h1>
      <p style={descStyle}>
        پلتفرم معاملاتی فیوچرز و اسپات با لوریج ۱۰۰x و پشتیبانی از بایننس.
      </p>

      <LoginForm />

      <div style={socialSection}>
        {/* تلگرام */}
        <a href="https://t.me/yourid" target="_blank" rel="noreferrer" style={socialItem}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.41-.88.03-.24.37-.49 1.02-.74 3.96-1.73 6.6-2.87 7.92-3.42 3.77-1.57 4.55-1.84 5.06-1.85.11 0 .35.03.5.17.12.11.15.26.17.42-.01.06.01.24 0 .38z"/>
          </svg>
          <span style={{ marginTop: 8, fontSize: 14 }}>تلگرام</span>
        </a>

        {/* اینستاگرام */}
        <a href="https://instagram.com/yourid" target="_blank" rel="noreferrer" style={socialItem}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
          </svg>
          <span style={{ marginTop: 8, fontSize: 14 }}>اینستاگرام</span>
        </a>

        {/* واتساپ */}
        <a href="https://wa.me/yournumber" target="_blank" rel="noreferrer" style={socialItem}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12.04 2c5.52 0 10 4.48 10 10 0 5.52-4.48 10-10 10-1.78 0-3.45-.47-4.9-1.28L2 22l1.33-4.86C2.5 15.9 2 14.05 2 12.04 2 6.48 6.48 2 12.04 2M17 12.95c-.4-1.1-2.08-1.97-2.9-2.18-.5-.13-1.1-.2-1.65.05-.42.22-1.02.63-1.3.93-.23.22-.47.22-.9.05-1.6-.5-2.72-1.42-3.8-2.58-.25-.33-.5-.7-.75-1.05-.2-.3-.02-.58.17-.72.25-.22.53-.52.78-.8.13-.14.22-.3.17-.5-.1-.35-.6-1.65-.8-2.25-.17-.47-.4-.5-.7-.5-.28 0-.6.03-.9.03-.3 0-.78.1-1.2.48-.4.38-1.56 1.52-1.56 3.7 0 2.2 1.6 4.33 1.82 4.63.23.3 3.1 4.82 7.6 6.55 1.06.37 1.9.3 2.6.18.8-.15 2.48-1.02 2.83-2.02.35-1 .35-1.85.25-2.02z"/>
          </svg>
          <span style={{ marginTop: 8, fontSize: 14 }}>واتساپ</span>
        </a>

        {/* روبیکا */}
        <a href="https://rubika.ir/yourid" target="_blank" rel="noreferrer" style={socialItem}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="1.5"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">R</text>
          </svg>
          <span style={{ marginTop: 8, fontSize: 14 }}>روبیکا</span>
        </a>

        {/* بله */}
        <a href="https://bale.ai/yourid" target="_blank" rel="noreferrer" style={socialItem}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ffffff">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" strokeWidth="1.5"/>
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">B</text>
          </svg>
          <span style={{ marginTop: 8, fontSize: 14 }}>بله</span>
        </a>
      </div>
    </div>
  );
}

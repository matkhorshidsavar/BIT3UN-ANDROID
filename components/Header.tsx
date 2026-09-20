"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/market", label: "بازار" },
  { href: "/features", label: "امکانات" },
  { href: "/testimonials", label: "نظرات" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        backdropFilter: "blur(18px)",
        background: "rgba(10, 10, 15, 0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        boxSizing: "border-box",
      }}
    >
      <Link href="/">
        <img
          src="/bitsun-logo.png"
          alt="BitSun"
          style={{ height: 36 }}
        />
      </Link>

      {/* desktop nav */}
      <nav
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
        className="hidden-mobile"
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: pathname === href ? "#f0c040" : "#ccc",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link
          href="/login"
          style={{
            color: "#ccc",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 14,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          ورود
        </Link>
        <Link
          href="/start"
          style={{
            background: "linear-gradient(135deg, #f0c040, #d4a020)",
            color: "#0a0a0f",
            fontWeight: "bold",
            padding: "8px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          شروع معامله
        </Link>
      </div>

      {/* mobile hamburger */}
      <div className="mobile-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <span style={{ display: "block", width: 20, height: 2, background: "#fff", margin: "4px 0" }} />
        <span style={{ display: "block", width: 20, height: 2, background: "#fff", margin: "4px 0" }} />
        <span style={{ display: "block", width: 20, height: 2, background: "#fff", margin: "4px 0" }} />
      </div>
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            width: "100%",
            background: "rgba(0,0,0,0.95)",
            padding: 20,
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{ color: "#fff", fontWeight: 600 }}>
                {label}
              </Link>
            ))}
            <Link href="/login" style={{ color: "#ccc", fontWeight: 600 }}>ورود</Link>
            <Link
              href="/start"
              style={{
                background: "#f0c040",
                color: "#000",
                fontWeight: 800,
                padding: "8px 16px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              شروع معامله
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

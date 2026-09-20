"use client";
import { useEffect } from "react";

export default function GoogleAuthButton() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    // Global callback attached to window for Google SDK to trigger
    (window as any).handleGoogleSignIn = async (response: any) => {
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });
        const data = await res.json();
        
        if (data.ok) {
          window.location.href = data.redirect || "/dashboard";
        } else {
          alert(data.message || "ورود ناموفق بود");
        }
      } catch (err) {
        console.error("Google Auth Request Failed:", err);
      }
    };
  }, []);

  return (
    <div className="mt-5 w-full flex flex-col items-center gap-4">
      <div className="flex items-center w-full">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="px-3 text-sm text-[#b8c4da]">یا</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>
      
      {/* Hidden configuration div */}
      <div
        id="g_id_onload"
        data-client_id="YOUR_GOOGLE_CLIENT_ID_HERE"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleGoogleSignIn"
        data-auto_prompt="false"
      ></div>
      
      {/* Native Google dark-mode button renderer */}
      <div
        className="g_id_signin w-full flex justify-center"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_black"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="center"
        data-width="400"
      ></div>
    </div>
  );
}

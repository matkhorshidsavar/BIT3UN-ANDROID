// BIT3UN ROUTER FIX V1 - CLEAN AUTH FLOW

export default function router(req, res) {

  const url = req.url;

  // =========================
  // LOGIN PAGE FIX (EMAIL ONLY)
  // =========================
  if (url === "/login") {
    res.end(`
      <html>
        <head><title>Login</title></head>
        <body style="background:#111;color:#fff;font-family:sans-serif">

          <h2>ورود به حساب</h2>

          <div id="login-box">
            <input id="email" type="email" placeholder="ایمیل" />
            <input id="password" type="password" placeholder="رمز عبور" />
            <button onclick="login()">ورود</button>
          </div>

          <div id="otp-box" style="display:none">
            <input id="otp" placeholder="کد OTP" />
            <button onclick="verify()">تایید</button>
          </div>

          <script>

            let userId = null;

            async function login() {

              const email = document.getElementById("email").value;
              const password = document.getElementById("password").value;

              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({ email, password })
              });

              const data = await res.json();

              if (!data.ok) {
                alert("Login failed");
                return;
              }

              userId = data.userId;

              document.getElementById("login-box").style.display = "none";
              document.getElementById("otp-box").style.display = "block";
            }

            async function verify() {

              const code = document.getElementById("otp").value;

              const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                  userId,
                  code
                })
              });

              const data = await res.json();

              if (data.ok) {
                window.location.href = data.redirect;
              } else {
                alert("OTP wrong");
              }
            }

          </script>

        </body>
      </html>
    `);
    return;
  }

  // =========================
  // DASHBOARD ROUTE FIX
  // =========================
  if (url === "/dashboard") {
    res.end("Dashboard OK");
    return;
  }

  // =========================
  // KYC ROUTE FIX
  // =========================
  if (url === "/kyc") {
    res.end("KYC Page");
    return;
  }

  res.end("Not Found");
}

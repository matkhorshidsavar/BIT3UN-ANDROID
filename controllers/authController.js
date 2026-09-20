const { sendLoginOTP } = require('../services/smsService');

const otpStore = new Map();

function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // کد ۵ رقمی
}

async function requestOTP(req, res) {
  const { phone } = req.body;
  if (!phone || !/^09\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'شماره موبایل وارد شده معتبر نیست.' });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 120 * 1000; // ۱۲۰ ثانیه انقضا مطابق الگو

  otpStore.set(phone, { otp, expiresAt });

  const smsResult = await sendLoginOTP(phone, otp);

  if (smsResult.success) {
    return res.status(200).json({ message: 'کد تایید ارسال شد.' });
  } else {
    // برای تست محلی اگر پیامک ارسال نشد کد را لاگ می‌کنیم
    console.log(`[TEST ONLY] OTP for ${phone}: ${otp}`);
    return res.status(500).json({ error: 'خطا در ارسال پیامک. مجدداً تلاش کنید.' });
  }
}

async function verifyOTP(req, res) {
  const { phone, otp } = req.body;
  const record = otpStore.get(phone);

  if (!record) {
    return res.status(400).json({ error: 'کدی برای این شماره ثبت نشده است.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ error: 'کد تایید منقضی شده است.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: 'کد وارد شده اشتباه است.' });
  }

  otpStore.delete(phone);
  
  // شبیه‌سازی توکن ورود موفق و هدایت به داشبورد
  return res.status(200).json({
    message: 'ورود موفقیت‌آمیز بود.',
    token: 'jwt-token-example-' + phone,
    redirectTo: '/dashboard'
  });
}

module.exports = { requestOTP, verifyOTP };

export async function requestOtp(mobile) {
  const response = await fetch("/api/auth/request-otp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    throw new Error(
      data?.message ||
      data?.error ||
      "خطا در ارسال کد تایید"
    );
  }

  return data;
}

export async function verifyOtp(mobile, code) {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile, code }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.ok === false) {
    throw new Error(
      data?.message ||
      data?.error ||
      "کد تایید اشتباه یا منقضی شده است"
    );
  }

  return data;
}

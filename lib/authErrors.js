const MESSAGES = {
  "auth/email-already-in-use": "This email is already registered — try signing in instead.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
  "auth/popup-closed-by-user": null,
  "auth/cancelled-popup-request": null,
};

export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  if (code in MESSAGES) return MESSAGES[code];
  return "Something went wrong. Please try again.";
}

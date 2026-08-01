"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

function LoginForm() {
  const [email, setEmail] = useState("admin@swiftquote.ai");
  const [password, setPassword] = useState("EliteStandard2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        const redirectPath = searchParams.get("from") || "/dashboard";
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
    setLoading(true);

    const mockEmail = "admin@swiftquote.ai";
    const mockPassword = "EliteStandard2026!";

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mockEmail, password: mockPassword }),
      });

      const data = await res.json();

      if (data.success) {
        const redirectPath = searchParams.get("from") || "/dashboard";
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(data.error || `Social login with ${provider} failed`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <div className={styles.logoIcon}>⚡</div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your SwiftQuote AI Solopreneur Workspace</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Authenticating..." : "Login to Dashboard →"}
        </button>
      </form>

      <div className={styles.divider}>or continue with</div>

      <div className={styles.socialGroup}>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("google")}
          className={styles.socialBtn}
        >
          <span className={styles.socialIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.38-2.87-6.38-6.38s2.87-6.38 6.38-6.38c1.626 0 3.09.61 4.223 1.6 l3.1-3.1C18.66 1.76 15.65 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.897 0 10.76-4.257 11.24-10.125H12.24z"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("facebook")}
          className={styles.socialBtn}
        >
          <span className={styles.socialIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </span>
          Continue with Facebook
        </button>
      </div>

      <div className={styles.demoHint}>
        💡 <strong>Demo Credentials Pre-filled:</strong><br />
        Email: <code>admin@swiftquote.ai</code><br />
        Password: <code>EliteStandard2026!</code>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div style={{ color: "#fff" }}>Loading login page...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

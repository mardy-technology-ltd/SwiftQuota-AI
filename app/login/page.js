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

      <div className={styles.socialRow}>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("google")}
          className={styles.iconSocialBtn}
          title="Continue with Google"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.38-2.87-6.38-6.38s2.87-6.38 6.38-6.38c1.626 0 3.09.61 4.223 1.6 l3.1-3.1C18.66 1.76 15.65 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.897 0 10.76-4.257 11.24-10.125H12.24z"
            />
          </svg>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("facebook")}
          className={styles.iconSocialBtn}
          title="Continue with Facebook"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("apple")}
          className={styles.iconSocialBtn}
          title="Continue with Apple"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08 1.16.03 2.82-1.33z" />
          </svg>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("github")}
          className={styles.iconSocialBtn}
          title="Continue with GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
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

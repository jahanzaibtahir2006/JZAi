"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API = "https://jzai-saas.jahanzaibtahir2006.workers.dev";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    if (!token) { setError("Invalid reset link."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setMsg("Password reset! Redirecting to login...");
      setTimeout(() => window.location.href = "/auth", 2000);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050507",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "DM Sans, sans-serif", padding: 24,
    }}>
      <div style={{
        background: "#13131a", border: "1px solid #2a2a35",
        borderRadius: 16, padding: 40, width: "100%", maxWidth: 420,
      }}>
        <a href="/" style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "#f5f5f7", textDecoration: "none", display: "block", marginBottom: 28 }}>
          JZ<span style={{ color: "#e8193c" }}>AI</span>
        </a>
        <h1 style={{ fontFamily: "Syne, sans-serif", color: "#f5f5f7", fontSize: 24, marginBottom: 8 }}>New Password</h1>
        <p style={{ color: "#8a8a9a", fontSize: 14, marginBottom: 28 }}>Enter your new password below.</p>

        {error && (
          <div style={{ background: "rgba(232,25,60,0.08)", border: "1px solid rgba(232,25,60,0.2)", color: "#e8193c", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        {msg && (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
            ✓ {msg}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8a8a9a", display: "block", marginBottom: 8 }}>New Password</label>
          <input
            type="password" placeholder="Min. 8 characters" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", background: "#0d0d12", border: "1px solid #2a2a35", borderRadius: 8, padding: "12px 16px", color: "#f5f5f7", fontSize: 14, outline: "none", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8a8a9a", display: "block", marginBottom: 8 }}>Confirm Password</label>
          <input
            type="password" placeholder="Re-enter password" value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ width: "100%", background: "#0d0d12", border: "1px solid #2a2a35", borderRadius: 8, padding: "12px 16px", color: "#f5f5f7", fontSize: 14, outline: "none", fontFamily: "DM Sans, sans-serif" }}
          />
        </div>

        <button onClick={handleReset} disabled={loading} style={{
          width: "100%", background: "#e8193c", color: "#fff", border: "none",
          borderRadius: 8, padding: 14, fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          fontFamily: "DM Sans, sans-serif",
        }}>
          {loading ? "Updating..." : "Reset Password →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/auth" style={{ fontSize: 13, color: "#8a8a9a", textDecoration: "none" }}>← Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ background: "#050507", minHeight: "100vh" }} />}>
      <ResetForm />
    </Suspense>
  );
}

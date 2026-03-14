import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPages.module.css";

export default function RegisterPage() {
  const { registerInit, registerVerify } = useAuth();

  // "init" | "verify"
  const [step, setStep]       = useState("init");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [info, setInfo]       = useState("");

  
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");


  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const otpRefs                 = useRef([]);

  
  const handleInit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await registerInit(email, name);
      setInfo(`OTP sent to ${email}`);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

 
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;          
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

 
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await registerVerify(email, code, password, name);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => { setStep("init"); setError(""); setOtp(["","","","","",""]); };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        {/* ── Logo ── */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>✦</div>
          <span className={styles.logoText}>TaskSphere</span>
        </div>

        {/* ── Step indicator ── */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step === "init" ? styles.stepActive : styles.stepDone}`}>
            <span className={styles.stepNum}>{step === "verify" ? "✓" : "1"}</span>
            <span className={styles.stepLabel}>Your info</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step === "verify" ? styles.stepActive : ""}`}>
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Verify email</span>
          </div>
        </div>

        {/* ─────────── STEP 1 ─────────── */}
        {step === "init" && (
          <>
            <h1 className={styles.heading}>Create account</h1>
            <p className={styles.subheading}>We'll send a verification code to your email</p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleInit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  className={styles.input} type="text" placeholder="Jane Smith"
                  value={name} onChange={(e) => setName(e.target.value)}
                  required minLength={2} autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  className={styles.input} type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.btn} disabled={loading}>
                {loading && <span className={styles.btnSpinner} />}
                {loading ? "Sending code…" : "Send verification code →"}
              </button>
            </form>
          </>
        )}

        {/* ─────────── STEP 2 ─────────── */}
        {step === "verify" && (
          <>
            <h1 className={styles.heading}>Check your email</h1>
            <p className={styles.subheading}>
              Enter the 6-digit code sent to <strong style={{ color: "var(--accent-light)" }}>{email}</strong>
            </p>

            {info  && <div className={styles.infoBanner}>{info}</div>}
            {error && <div className={styles.errorBanner}>{error}</div>}

            <form onSubmit={handleVerify} className={styles.form}>
              {/* OTP boxes */}
              <div className={styles.field}>
                <label className={styles.label}>Verification code</label>
                <div className={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      className={styles.otpBox}
                      type="text" inputMode="numeric"
                      maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input} type="password" placeholder="Min. 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirm password</label>
                <input
                  className={styles.input} type="password" placeholder="Repeat password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.btn} disabled={loading}>
                {loading && <span className={styles.btnSpinner} />}
                {loading ? "Creating account…" : "Create account"}
              </button>

              <button type="button" className={styles.backBtn} onClick={goBack}>
                ← Back
              </button>
            </form>
          </>
        )}

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

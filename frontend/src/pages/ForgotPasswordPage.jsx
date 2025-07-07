import { useState } from "react";
import { Bird } from "lucide-react";
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
        setEmail("");
    try {
      const res = await fetch("https://chirplab.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setStatus(res.ok ? data.message : data.message || "Error occurred");
    } catch (err) {
      setStatus("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" data-theme="sunset">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
       <h2 className="text-2xl font-bold flex items-center gap-2">
        <Bird className="size-8 text-primary" />
            Forgot Password?
                </h2>
        <p>Enter your registered email to receive a temporary password.</p>

        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <button type="submit" className="btn btn-primary w-full">
          Send Temporary Password
        </button>

        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

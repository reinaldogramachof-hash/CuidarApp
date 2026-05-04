import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redireciona após login
  if (!loading && user && profile) {
    if (profile.role === "admin") navigate("/admin", { replace: true });
    else if (profile.role === "caregiver") navigate("/caregiver", { replace: true });
    else if (profile.role === "family") navigate("/family", { replace: true });
    else navigate("/unauthorized", { replace: true });
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos"
          : error.message
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0f4f4 0%, #f8f9fa 50%, #e8f4f8 100%)",
      padding: "20px",
      fontFamily: "var(--font-body)",
    }}>
      <div style={{
        background: "#fff",
        padding: "48px 40px",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,103,103,0.12)",
        maxWidth: "420px",
        width: "100%",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "72px", height: "72px",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
            borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(0,103,103,0.3)",
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 30C18 30 6 21 6 13C6 9.13 9.13 6 13 6C15.3 6 18 8 18 8C18 8 20.7 6 23 6C26.87 6 30 9.13 30 13C30 21 18 30 18 30Z" fill="white"/>
              <path d="M14 18H22M18 14V22" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "28px",
            color: "var(--color-navy)",
            letterSpacing: "-0.5px",
            margin: "0 0 8px",
          }}>CuidarApp</h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-mid)", lineHeight: 1.5 }}>
            Cuidado com amor,<br />tecnologia com propósito
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block", fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "13px", color: "var(--color-navy)", marginBottom: "8px",
              letterSpacing: "0.02em",
            }}>E-MAIL</label>
            <input
              {...register("email")}
              type="email"
              id="login-email"
              placeholder="seu@email.com"
              className="input-field"
              style={{ border: errors.email ? "1.5px solid var(--color-danger)" : undefined }}
            />
            {errors.email && (
              <span style={{ color: "var(--color-danger)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block", fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "13px", color: "var(--color-navy)", marginBottom: "8px",
              letterSpacing: "0.02em",
            }}>SENHA</label>
            <div style={{ position: "relative" }}>
              <input
                {...register("password")}
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input-field"
                style={{
                  paddingRight: "48px",
                  border: errors.password ? "1.5px solid var(--color-danger)" : undefined,
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "var(--color-text-light)", cursor: "pointer", fontSize: "16px",
              }}>
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <span style={{ color: "var(--color-danger)", fontSize: "12px", marginTop: "4px", display: "block" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {serverError && (
            <div style={{
              background: "var(--color-danger-light)", border: "1px solid var(--color-danger)",
              borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
              color: "var(--color-danger)", fontSize: "14px", fontWeight: 600, textAlign: "center",
            }}>
              {serverError}
            </div>
          )}

          <button type="submit" id="login-submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting
              ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Entrando...</>
              : <><i className="fa-solid fa-arrow-right-to-bracket"></i> Entrar</>
            }
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--color-text-light)", marginTop: "24px" }}>
          🔒 Dados protegidos com criptografia · LGPD
        </p>
      </div>
    </div>
  );
}

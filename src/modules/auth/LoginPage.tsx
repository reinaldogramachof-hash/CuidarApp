import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { useAuth } from "../../hooks/useAuth";
import { C, T } from "../../utils/tokens";

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

  useEffect(() => {
    if (loading || !user || !profile) return;
    if (profile.role === 'admin') navigate('/admin', { replace: true });
    else if (profile.role === 'caregiver') navigate('/caregiver', { replace: true });
    else if (profile.role === 'family') navigate('/family', { replace: true });
    else navigate('/unauthorized', { replace: true });
  }, [user, profile, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      if (error.message === "Invalid login credentials") {
        setServerError("Credenciais incorretas");
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: C.bg,
      fontFamily: T.body,
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: C.primary,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            color: "#fff",
            fontSize: "28px",
          }}>
            <i className="fa-solid fa-heart"></i>
          </div>
          <h1 style={{
            fontFamily: T.display,
            fontWeight: 900,
            fontSize: "28px",
            color: C.navy,
            letterSpacing: "-0.5px",
            margin: 0,
          }}>
            CuidarApp
          </h1>
          <p style={{
            fontSize: "14px",
            color: C.textMid,
            marginTop: "8px",
          }}>
            Cuidado com amor, tecnologia com propósito
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontFamily: T.display,
              fontWeight: 700,
              fontSize: "14px",
              color: C.navy,
              marginBottom: "8px",
            }}>
              E-mail
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="seu@email.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: `1.5px solid ${errors.email ? C.danger : C.border}`,
                outline: "none",
                fontSize: "15px",
                transition: "border-color 0.2s",
              }}
            />
            {errors.email && (
              <span style={{ color: C.danger, fontSize: "12px", marginTop: "4px", display: "block" }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              fontFamily: T.display,
              fontWeight: 700,
              fontSize: "14px",
              color: C.navy,
              marginBottom: "8px",
            }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${errors.password ? C.danger : C.border}`,
                  outline: "none",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: C.textLight,
                  cursor: "pointer",
                }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <span style={{ color: C.danger, fontSize: "12px", marginTop: "4px", display: "block" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {serverError && (
            <div style={{
              color: C.danger,
              fontSize: "14px",
              marginBottom: "16px",
              textAlign: "center",
              fontWeight: 600,
            }}>
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              background: C.primary,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontFamily: T.display,
              fontWeight: 800,
              fontSize: "16px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Entrando...
              </>
            ) : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

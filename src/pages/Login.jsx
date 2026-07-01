import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import { FiLogIn, FiUserPlus, FiAlertCircle } from "react-icons/fi";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: #13121f;
  border: 1px solid rgba(130,80,255,0.2);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: #e8e0ff;
  span.icon { color: #8250ff; font-size: 1.4rem; }
`;

const Title = styled.h1`
  color: #e8e0ff;
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 0.4rem;
`;

const Sub = styled.p`
  color: #4a4560;
  font-size: 0.82rem;
  text-align: center;
  margin: 0 0 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(130,80,255,0.15);
`;

const Tab = styled.button`
  flex: 1;
  background: transparent;
  border: none;
  color: ${p => p.$active ? "#e8e0ff" : "#4a4560"};
  font-size: 0.875rem;
  font-weight: ${p => p.$active ? "600" : "400"};
  padding: 0.6rem;
  cursor: pointer;
  border-bottom: 2px solid ${p => p.$active ? "#8250ff" : "transparent"};
  transition: all 0.2s;
  margin-bottom: -1px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  label { color: #7a7290; font-size: 0.8rem; font-weight: 500; }
  input {
    background: #0a0917;
    border: 1px solid rgba(130,80,255,0.2);
    color: #e8e0ff;
    font-size: 0.875rem;
    padding: 0.6rem 0.85rem;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.2s;
    &::placeholder { color: #4a4560; }
    &:focus { border-color: #8250ff; }
  }
`;

const SubmitBtn = styled.button`
  background: #8250ff;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.7rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 0.25rem;
  transition: background 0.2s;
  &:hover { background: #9d6fff; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ErrorBox = styled.div`
  background: rgba(255,80,80,0.08);
  border: 1px solid rgba(255,80,80,0.2);
  color: #ff9090;
  font-size: 0.82rem;
  padding: 0.6rem 0.85rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";
  if (user) { navigate(from, { replace: true }); return null; }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password || (tab === "register" && !username)) {
      setError("Por favor completá todos los campos.");
      return;
    }
    setSubmitting(true);
    const result = tab === "login"
      ? await login(email, password)
      : await register(email, password, username);
    setSubmitting(false);
    if (result.ok) navigate(from, { replace: true });
    else setError(result.error);
  }

  return (
    <>
      <Helmet>
        <title>{tab === "login" ? "Iniciar sesión" : "Registrarse"} · TETRUX</title>
        <meta name="description" content="Accedé a tu cuenta TETRUX para guardar tu biblioteca y gestionar tus compras." />
      </Helmet>
      <PageWrapper>
        <Card>
          <Logo><span className="icon">◈</span> TETRUX</Logo>
          <Title>{tab === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}</Title>
          <Sub>{tab === "login" ? "Ingresá a tu cuenta" : "Registrate gratis"}</Sub>

          <Tabs>
            <Tab $active={tab === "login"} onClick={() => { setTab("login"); setError(""); }}>
              Iniciar sesión
            </Tab>
            <Tab $active={tab === "register"} onClick={() => { setTab("register"); setError(""); }}>
              Registrarse
            </Tab>
          </Tabs>

          {error && <ErrorBox><FiAlertCircle />{error}</ErrorBox>}

          <Form onSubmit={handleSubmit}>
            {tab === "register" && (
              <Field>
                <label>Nombre de usuario</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="tu_usuario" autoFocus />
              </Field>
            )}
            <Field>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@ejemplo.com" autoFocus={tab === "login"} />
            </Field>
            <Field>
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            <SubmitBtn type="submit" disabled={submitting}>
              {tab === "login" ? <><FiLogIn />Iniciar sesión</> : <><FiUserPlus />Crear cuenta</>}
              {submitting && " ..."}
            </SubmitBtn>
          </Form>
        </Card>
      </PageWrapper>
    </>
  );
}

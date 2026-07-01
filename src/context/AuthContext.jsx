import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          avatar: (firebaseUser.displayName || firebaseUser.email)[0].toUpperCase(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function register(email, password, username) {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        username,
        avatar: username[0].toUpperCase(),
      });
      return { ok: true };
    } catch (err) {
      const msg = parseFirebaseError(err.code);
      setAuthError(msg);
      return { ok: false, error: msg };
    }
  }

  async function login(email, password) {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      const msg = parseFirebaseError(err.code);
      setAuthError(msg);
      return { ok: false, error: msg };
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function parseFirebaseError(code) {
  const errors = {
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/email-already-in-use": "El email ya está registrado.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email": "El email no es válido.",
    "auth/invalid-credential": "Credenciales inválidas.",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde.",
  };
  return errors[code] || "Ocurrió un error. Intentá de nuevo.";
}

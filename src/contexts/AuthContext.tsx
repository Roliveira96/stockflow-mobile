import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { AuthContextData, Usuario } from "@/types";

const CHAVE_USUARIO = "@stockflow:usuario";
const CHAVE_TOKEN = "@stockflow:token";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      const [usuarioSalvo, tokenSalvo] = await Promise.all([
        AsyncStorage.getItem(CHAVE_USUARIO),
        AsyncStorage.getItem(CHAVE_TOKEN),
      ]);

      if (usuarioSalvo && tokenSalvo) {
        setUsuario(JSON.parse(usuarioSalvo) as Usuario);
        setToken(tokenSalvo);
      }

      setCarregandoSessao(false);
    }

    restaurarSessao();
  }, []);

  async function login(email: string, senha: string) {
    if (!email.trim() || !senha.trim()) {
      throw new Error("Informe email e senha para continuar.");
    }

    const usuarioAutenticado: Usuario = {
      id: email,
      nome: email.split("@")[0],
      email,
    };
    const tokenGerado = `${Date.now()}`;

    await AsyncStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioAutenticado));
    await AsyncStorage.setItem(CHAVE_TOKEN, tokenGerado);

    setUsuario(usuarioAutenticado);
    setToken(tokenGerado);
  }

  async function logout() {
    await AsyncStorage.multiRemove([CHAVE_USUARIO, CHAVE_TOKEN]);
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregandoSessao, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  }

  return contexto;
}

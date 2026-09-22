import { useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, Text } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "@/styles/login.styles";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const podeEntrar = email.trim().length > 0 && senha.trim().length > 0;

  async function handleEntrar() {
    setCarregando(true);

    try {
      await login(email, senha);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Não foi possível entrar.";
      Alert.alert("Erro ao entrar", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>StockFlow</Text>
        <Text style={styles.subtitulo}>Entre para gerenciar seu estoque</Text>

        <CustomInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="voce@empresa.com"
        />
        <CustomInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Sua senha"
        />

        <CustomButton
          titulo="Entrar"
          onPress={handleEntrar}
          carregando={carregando}
          desabilitado={!podeEntrar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

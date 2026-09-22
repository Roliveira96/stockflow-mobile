import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text } from "react-native";

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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logotipo do StockFlow"
          />
          <Text style={styles.titulo}>StockFlow</Text>
          <Text style={styles.subtitulo}>Entre para gerenciar seu estoque</Text>

          <CustomInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder="voce@empresa.com"
          />
          <CustomInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            placeholder="Sua senha"
          />

          <CustomButton
            titulo="Entrar"
            onPress={handleEntrar}
            carregando={carregando}
            desabilitado={!podeEntrar}
            icone="log-in-outline"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Animated, Text } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { ToastProps } from "@/types";

import { criarEstilos } from "./styles";

export function Toast({ mensagem }: ToastProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [opacidade] = useState(() => new Animated.Value(0));
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (mensagem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisivel(true);
      Animated.timing(opacidade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacidade, { toValue: 0, duration: 200, useNativeDriver: true }).start(
        () => {
          setVisivel(false);
        }
      );
    }
  }, [mensagem, opacidade]);

  if (!visivel) return null;

  return (
    <Animated.View
      style={[styles.toast, { opacity: opacidade }]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.texto}>{mensagem}</Text>
    </Animated.View>
  );
}

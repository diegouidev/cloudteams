import { SafeAreaView } from 'react-native-safe-area-context'
import styled from "styled-components/native";

// (SafeAreaView) area segura para a aplicação

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.GRAY_600};
  padding: 24px;
`
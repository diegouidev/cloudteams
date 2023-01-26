import { useNavigation } from '@react-navigation/native'

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Container, Content, Icon } from "./styles";

export function NewGroup() {

  const navigation = useNavigation()
  function handleGroup() {
    navigation.navigate('group')
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon onPress={handleGroup} />
        <Highlight
          title='Nova turma'
          subtitle="Crie a turma para adicionar as pessoas"
        />

        <Input
          placeholder="Nome da turma"
        />

        <Button
          title="Criar"
          style={{ marginTop: 15 }}
        />
      </Content>
    </Container>
  )
}
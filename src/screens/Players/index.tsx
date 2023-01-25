import { Input } from "@components/Input";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";

import { Container } from "./styles";

export function Players() {
  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title="Nome da turma"
        subtitle="Adicione o nome da galera e separe os times"
      />
      <Input placeholder="Nome da pessoa"/>
      <ButtonIcon icon="add" />

    </Container>
  )
}
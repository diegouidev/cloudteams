import { useState } from 'react'
import { FlatList } from "react-native";

import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

export function Players() {
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState([])

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title="Nome da turma"
        subtitle="Adicione o nome da galera e separe os times"
      />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />
        <ButtonIcon icon="add" />
      </Form>

      <HeaderList>
        {/* renderizando os item na horizontal  */}
        <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>
    </Container>
  )
}
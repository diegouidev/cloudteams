import { useState } from "react"
import { Alert, FlatList } from "react-native";
import { useRoute } from '@react-navigation/native'

import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { ListEmpty } from "@components/ListEmpty";
import { Highlight } from "@components/Highlight";
import { PlayerCard } from "@components/PlayCard";
import { ButtonIcon } from "@components/ButtonIcon";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { PlaayerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroup } from "@storage/player/playersGetByGroup";

// tipando os parametros do nome da turma da rota 
type RouteParams = {
  group: string
}


export function Players() { 
  const [ newPlayerName, setNewPlayerName] = useState('')
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState([])
  // 'Diego', 'Ayrton', 'Kaju', 'Raul', 'naldim', 'Dinaldo', 'Tio João', 'Fabin', 'Alex', 'Adolfo', 'Gabriel', 'Klismann', 'Marcos', 'Harley'

  // pegando os paramentros para o nome da turma
  const route = useRoute()
  const { group } = route.params as RouteParams

  // identifica se o campo esta vazio ou não e informa a mensagem de error
  async function handlePlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await PlaayerAddByGroup(newPlayer, group)
      const players = await playerGetByGroup(group)
      console.log(players)
      
    }catch(error) {
      if(error instanceof AppError){
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log(error)
        Alert.alert('Nova pessoa', 'Não foi possível adicionar')
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Highlight
      // pegando o nome da turma no title
        title={group}
        subtitle="Adicione o nome da galera e separe os times"
      />

      <Form>
        <Input
        onChangeText={setNewPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />
        <ButtonIcon
          icon="add"
          onPress={handlePlayer}
        />
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

        {/* numerando a quantidade de jogadores */}
        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>

      {/* rendeziando os participantes */}
      <FlatList
        data={players}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <PlayerCard
            name={item}
            onRemove={() => { }}
          />
        )}
        // mostrando mensagem quando nao tem nenhum jogador
        ListEmptyComponent={() => (
          <ListEmpty
            message="Não há pessoas nesse time."
          />
        )}
        showsVerticalScrollIndicator={false}
        // estilo condicional para aplicar padding quando tiver jogadores
        // e deixar a mensagem no centro da tela
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 }
        ]}
      />

      <Button
        title="Remover turma"
        type="SECONDARY"
      />
    </Container>
  )
}
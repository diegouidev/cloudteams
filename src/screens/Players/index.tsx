import { useState, useEffect, useRef } from "react"
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native'

import { PlayerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";

import { AppError } from "@utils/AppError";

import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { ListEmpty } from "@components/ListEmpty";
import { Highlight } from "@components/Highlight";
import { PlayerCard } from "@components/PlayCard";
import { ButtonIcon } from "@components/ButtonIcon";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";



// tipando os parametros do nome da turma da rota 
type RouteParams = {
  group: string
}


export function Players() { 
  const [ newPlayerName, setNewPlayerName] = useState('')
  const [ team, setTeam ] = useState('Time A')
  const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([])
  // 'Diego', 'Ayrton', 'Kaju', 'Raul', 'naldim', 'Dinaldo', 'Tio João', 'Fabin', 'Alex', 'Adolfo', 'Gabriel', 'Klismann', 'Marcos', 'Harley'

  const navigation = useNavigation()
  // pegando os paramentros para o nome da turma
  const route = useRoute()
  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

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
      await PlayerAddByGroup(newPlayer, group)
      //tirando o foco do input e teclado
      newPlayerNameInputRef.current?.blur()
      //limpando o input
      setNewPlayerName('')
      fecthPlayersByTeam()
      
    }catch(error) {
      if(error instanceof AppError){
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log(error)
        Alert.alert('Nova pessoa', 'Não foi possível adicionar')
      }
    }
  }

  async function fecthPlayersByTeam() {
    try {
      const playerByTeam = await playerGetByGroupAndTeam(group, team)
      setPlayers(playerByTeam)
    } catch(error) {
      console.log(error)
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)
      fecthPlayersByTeam()

    } catch (error) {
      console.log(error)
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.')
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remover grupo', 'Não foi possível o grupo.')
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: () => groupRemove()}
      ]
    )
  }

  useEffect(() => {
    fecthPlayersByTeam()
  }, [team])

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
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handlePlayer}
          returnKeyType="done"
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
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            name={item.name}
            onRemove={() => handlePlayerRemove(item.name)}
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
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
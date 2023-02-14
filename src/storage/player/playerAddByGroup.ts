import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYER_COLECTION } from "@storage/storageConfig";
import { playerGetByGroup } from './playersGetByGroup'

import { PlayerStorageDTO } from './PlayerStorageDTO'

export async function PlayerAddByGroup(newPlayer: PlayerStorageDTO, group: string){
  try {
    const storagePlayers = await playerGetByGroup(group)

    const playerAlreadyExists = storagePlayers.filter(player => player.name === newPlayer.name)

    if(playerAlreadyExists.length > 0) {
      throw new AppError('Essa pessoa já está adicionada em um time aqui.')
    }

    const storage = JSON.stringify([...storagePlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLECTION}-${group}`, storage)
    
  } catch(error) {
    throw(error)
  }
}
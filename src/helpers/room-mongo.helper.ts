import { Document } from 'mongoose'
import { RoomModel, RoomSchemaInterface } from '../schemas/room.schema'

export const createRoom = async (
  args: RoomSchemaInterface
): Promise<RoomSchemaInterface> => {
  const { roomId, maxParticipants } = args
  return RoomModel.create({
    roomId,
    sdpData: {},
    maxParticipants: maxParticipants ?? 2,
    participants: [],
  })
}

export const updateRoomByRoomId = async (
  roomId: string,
  update: RoomSchemaInterface
): Promise<any> => {
  return RoomModel.updateOne({ roomId }, { ...update })
}

export const findRoomById = async (
  roomId: string
): Promise<RoomSchemaInterface | any> => {
  return RoomModel.findOne({ roomId })
}

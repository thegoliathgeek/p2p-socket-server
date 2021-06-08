import { tmpdir } from 'os'
import { Server, Socket } from 'socket.io'
import { findRoomById, updateRoomByRoomId } from '../helpers/room-mongo.helper'
import { RoomSchemaInterface } from '../schemas/room.schema'

export class HandleSocketPath {
  static handlePaths(IoServer: Server, socket: Socket): void {
    socket.on('join-room', async ({ roomID }) => {
      const roomData: RoomSchemaInterface = await findRoomById(roomID)
      let tempParticipants = roomData.participants
      tempParticipants = [...roomData.participants, socket.id]
      await updateRoomByRoomId(roomID, {
        participants: tempParticipants,
      })
      socket.join(roomID)
      socket.emit('joined-room', {
        roomID,
        sdp: roomData?.sdpData,
        participants: tempParticipants,
      })
    })

    socket.on('send-offer', async ({ roomID, signal, toUser, offeredUser }) => {
      const roomData: RoomSchemaInterface = await findRoomById(roomID)
      if (roomID && roomData.participants.length > 1) {
        await updateRoomByRoomId(roomID, {
          sdpData: signal,
          initiatorSocketID: socket.id,
          participants: roomData.participants,
        })
        IoServer.to(toUser).emit('fetch-offer', { signal, offeredUser })
      }
    })

    socket.on('send-answer', async ({ roomID, signal, offeredUser }) => {
      IoServer.to(offeredUser).emit('fetch-answer', {
        roomID,
        signal,
      })
    })
  }
}

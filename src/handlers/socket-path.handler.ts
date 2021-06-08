import { RedisClient } from 'redis'
import { Server, Socket } from 'socket.io'
import { findRoomById, updateRoomByRoomId } from '../helpers/room-mongo.helper'
import { RoomSchemaInterface } from '../schemas/room.schema'
import { promisify } from 'util'

export class HandleSocketPath {
  static handlePaths(
    IoServer: Server,
    socket: Socket,
    redis: RedisClient
  ): void {
    socket.on('join-room', async ({ roomID }) => {
      const roomData: RoomSchemaInterface = await findRoomById(roomID)
      const hmsetPromise = promisify(redis.hmset).bind(redis)

      await hmsetPromise(['room', socket.id, roomID])

      let tempParticipants = roomData.participants

      tempParticipants = [...roomData.participants, socket.id]

      await updateRoomByRoomId(roomID, {
        participants: tempParticipants,
      })

      socket.join(roomID)
      socket.emit('joined-room', {
        roomID,
        participants: tempParticipants,
      })
    })

    socket.on('send-offer', async ({ roomID, signal, toUser }) => {
      const roomData: RoomSchemaInterface = await findRoomById(roomID)
      if (roomID && roomData.participants.length > 1) {
        await updateRoomByRoomId(roomID, {
          sdpData: signal,
          initiatorSocketID: socket.id,
          participants: roomData.participants,
        })
        IoServer.to(toUser).emit('fetch-offer', {
          signal,
          offeredUser: socket.id,
        })
      }
    })

    socket.on('send-answer', async ({ roomID, signal, offeredUser }) => {
      IoServer.to(offeredUser).emit('fetch-answer', {
        roomID,
        signal,
      })
    })

    socket.on('disconnect', async () => {
      const hmgetPromise = promisify(redis.hget).bind(redis)
      const roomId = await hmgetPromise('room', socket.id)
      const roomData: RoomSchemaInterface = await findRoomById(roomId)
      const participants = roomData.participants.filter(
        (val) => val !== socket.id
      )
      await updateRoomByRoomId(roomId, {
        participants: [...participants],
      })

      socket.emit('participant-left', { id: socket.id })
    })
  }
}

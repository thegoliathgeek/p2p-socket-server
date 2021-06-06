import { Server, Socket } from 'socket.io'
import { findRoomById, updateRoomByRoomId } from '../helpers/room-mongo.helper'

export class HandleSocketPath {
  static handlePaths(IoServer: Server, socket: Socket): void {
    socket.on('join-room', async ({ roomID }) => {
      const roomData = await findRoomById(roomID)

      socket.join(roomID)
      socket.emit('joined-room', { roomID, sdp: roomData?.sdpData })
    })

    socket.on('send-initiator-signal', async ({ roomID, signal }) => {
      if (signal?.sdp) {
        await updateRoomByRoomId(roomID, {
          sdpData: signal,
          initiatorSocketID: socket.id,
        })
      }
    })

    socket.on('send-client-signal', async ({ roomID, signal }) => {
      const roomData = await findRoomById(roomID)
      if (signal?.sdp) {
        IoServer.to(roomData?.initiatorSocketID + '').emit(
          'receive-initiator-signal',
          { roomID, signal }
        )
      }
    })
  }
}

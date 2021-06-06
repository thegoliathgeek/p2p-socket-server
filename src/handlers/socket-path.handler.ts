import { Server, Socket } from 'socket.io'

export class HandleSocketPath {
  static handlePaths(IoServer: Server, socket: Socket): void {
    socket.on('join-room', () => {
      return
    })
  }
}

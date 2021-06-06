import { Express } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { ServerConfig } from './src/configs/server.config'
import dotenv from 'dotenv'
import { HandleSocketPath } from './src/handlers/socket-path.handler'

dotenv.config()

ServerConfig.getExpress()
  .then((app: Express) => {
    const server = http.createServer(app)
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    })

    io.on('connection', (socket) => {
      HandleSocketPath.handlePaths(io, socket)
    })

    const port =
      typeof process.env.PORT === 'number'
        ? process.env.PORT
        : Number(process.env.PORT)

    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on port ${port}`)
    })
  })
  .catch((err) => {
    throw new Error(err.message)
  })

import { Express } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import { ServerConfig } from './src/configs/server.config'
import dotenv from 'dotenv'
import { HandleSocketPath } from './src/handlers/socket-path.handler'
import { connect } from 'mongoose'
import { RedisClient } from 'redis'

dotenv.config()

ServerConfig.getExpress()
  .then(({ app, redis }: { app: Express; redis: RedisClient }) => {
    const server = http.createServer(app)
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    })

    io.on('connection', (socket) => {
      HandleSocketPath.handlePaths(io, socket, redis)
    })

    const port =
      typeof process.env.PORT === 'number'
        ? process.env.PORT
        : Number(process.env.PORT)

    connect(
      process.env.MONGO_URL || 'mongodb://localhost:27017/peer',
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        // eslint-disable-next-line no-console
        console.log(`Database connected to ${process.env.MONGO_URL}`)
        server.listen(port, () => {
          // eslint-disable-next-line no-console
          console.log(`Server listening on port ${port}`)
        })
      }
    )
  })
  .catch((err) => {
    throw new Error(err.message)
  })

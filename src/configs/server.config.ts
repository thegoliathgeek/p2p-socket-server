import express, { Express } from 'express'
import { createClient, RedisClient } from 'redis'
import { RoomRouter } from '../routes/room.route'
import session from 'express-session'
import { v4 } from 'uuid'
export class ServerConfig {
  static async getExpress(): Promise<{ app: Express; redis: RedisClient }> {
    const app = express()
    const redis = createClient()
    app.use(express.json())
    app.use(
      session({
        genid: () => v4(),
        secret: process.env.SESSION_SECRET + '',
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 60000,
        },
      })
    )
    app.use('/room', RoomRouter.getRoutes())
    return { app, redis }
  }
}

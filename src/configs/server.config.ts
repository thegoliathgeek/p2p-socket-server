import express, { Express } from 'express'
import { createClient, RedisClient } from 'redis'
import { RoomRouter } from '../routes/room.route'
export class ServerConfig {
  static async getExpress(): Promise<{ app: Express; redis: RedisClient }> {
    const app = express()
    const redis = createClient()
    app.use(express.json())
    app.use('/room', RoomRouter.getRoutes())
    return { app, redis }
  }
}

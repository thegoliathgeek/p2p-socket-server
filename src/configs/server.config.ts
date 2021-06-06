import express, { Express } from 'express'
import { RoomRouter } from '../routes/room.route'
export class ServerConfig {
  static async getExpress(): Promise<Express> {
    const app = express()
    app.use(express.json())
    app.use('/room', RoomRouter.getRoutes())
    return app
  }
}

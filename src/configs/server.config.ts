import express, { Express } from 'express'
export class ServerConfig {
  static async getExpress(): Promise<Express> {
    const app = express()
    return app
  }
}

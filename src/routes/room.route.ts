import { Router, Request, Response } from 'express'
import { v4 } from 'uuid'
import { createRoom, updateRoomByRoomId } from '../helpers/room-mongo.helper'
import { RoomModel } from '../schemas/room.schema'

export class RoomRouter {
  static getRoutes(): Router {
    const router = Router()

    router.get('/', (_, res) => {
      res.json({
        error: false,
        message: 'Room Route up and running',
      })
    })

    router.post('/create-room', async (req: Request, res: Response) => {
      const { maxParticipants } = req.body
      const roomId = v4()
      const createdRoom = await createRoom({
        maxParticipants,
        roomId,
        participants: [],
      })

      res.json(createdRoom)
    })

    router.post('/update-room', async (req: Request, res: Response) => {
      const { maxParticipants, sdp, roomId, participants } = req.body
      const foundRoom = await RoomModel.findOne({ roomId })
      const updatedRoom = await updateRoomByRoomId(roomId, {
        sdpData: sdp ?? foundRoom?.sdpData,
        maxParticipants: maxParticipants ?? foundRoom?.maxParticipants,
        participants: participants ?? foundRoom?.participants,
      })

      res.json(updatedRoom)
    })

    return router
  }
}

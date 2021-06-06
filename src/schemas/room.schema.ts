import mongoose, { Model, Document } from 'mongoose'

const { Schema } = mongoose

interface RoomSchemaInterface {
  roomId: string
  sdpData: any
  maxParticipants: number
  participants: [string]
}

export const RoomSchema = new Schema<RoomSchemaInterface>({
  roomId: { type: String, required: true },
  sdpData: Schema.Types.Mixed,
  maxParticipants: Number,
  participants: [String],
})

export const RoomModel: Model<RoomSchemaInterface> = mongoose.model(
  'Rooms',
  RoomSchema
)

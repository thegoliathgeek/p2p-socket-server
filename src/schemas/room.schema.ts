import mongoose, { Model } from 'mongoose'

const { Schema } = mongoose

export interface RoomSchemaInterface {
  roomId?: string
  sdpData?: any
  maxParticipants?: number
  participants: string[]
  initiatorSocketID?: string
}

export const RoomSchema = new Schema<RoomSchemaInterface>(
  {
    roomId: { type: String, required: true },
    sdpData: Schema.Types.Mixed,
    maxParticipants: Number,
    participants: [String],
    initiatorSocketID: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

export const RoomModel: Model<RoomSchemaInterface> = mongoose.model(
  'Rooms',
  RoomSchema
)

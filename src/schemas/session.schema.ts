import mongoose, { Model } from 'mongoose'

const { Schema } = mongoose

export interface SessionInterface {
  sessionId?: string
  sessionData?: any
}

export const SessionSchema = new Schema<SessionInterface>(
  {
    sessionId: { type: String, required: true },
    sessionData: Schema.Types.Mixed,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

export const SessionModel: Model<SessionInterface> = mongoose.model(
  'Session',
  SessionSchema
)

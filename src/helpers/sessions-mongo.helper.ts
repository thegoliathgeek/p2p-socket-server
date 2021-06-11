import { SessionInterface, SessionModel } from '../schemas/session.schema'

export const createSession = async (
  args: SessionInterface
): Promise<SessionInterface> => {
  const { sessionData, sessionId } = args
  return SessionModel.create({
    sessionId,
    sessionData,
  })
}

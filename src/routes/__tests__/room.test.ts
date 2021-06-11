import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:9000' })
const createRoom = jest.fn(() => api.post('room/create-room'))

describe('Room Api Testing', () => {
  test('Create Update', async () => {
    const response = await createRoom()
    expect(typeof response?.data?.roomId).toBe('string')
  })

  test('Update Room', async () => {
    const response: any = await createRoom.mock.results[0].value
    const roomId = response.data.roomId
    const updatedResponse = await api.post('room/update-room', {
      maxParticipants: 4,
      sdp: '',
      roomId,
      participants: [],
    })
    expect(updatedResponse?.data?.ok).toBe(1)
  })
})

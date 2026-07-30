import api from './api'

const publicationsService = {
  list: async () => {
    const response = await api.get('/publications/')
    return response.data
  },
  create: async (pubData) => {
    const response = await api.post('/publications/', pubData)
    return response.data
  },
  update: async (pubId, pubData) => {
    const response = await api.put(`/publications/${pubId}`, pubData)
    return response.data
  },
  delete: async (pubId) => {
    await api.delete(`/publications/${pubId}`)
  }
}

export default publicationsService

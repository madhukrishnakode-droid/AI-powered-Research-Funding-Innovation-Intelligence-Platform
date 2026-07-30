import api from './api'

const patentsService = {
  list: async () => {
    const response = await api.get('/patents/')
    return response.data
  },
  create: async (patentData) => {
    const response = await api.post('/patents/', patentData)
    return response.data
  },
  update: async (patentId, patentData) => {
    const response = await api.put(`/patents/${patentId}`, patentData)
    return response.data
  },
  delete: async (patentId) => {
    await api.delete(`/patents/${patentId}`)
  }
}

export default patentsService

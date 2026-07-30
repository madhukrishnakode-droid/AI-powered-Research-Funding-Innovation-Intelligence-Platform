import api from './api'

const profileService = {
  getProfile: async () => {
    const response = await api.get('/users/me/profile')
    return response.data
  },
  createProfile: async (profileData) => {
    const response = await api.post('/users/me/profile', profileData)
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me/profile', profileData)
    return response.data
  },
  deleteProfile: async () => {
    const response = await api.delete('/users/me/profile')
    return response.data
  }
}

export default profileService

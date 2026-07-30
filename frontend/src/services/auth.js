import api from './api'

const authService = {
  login: async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  },

  register: async (email, password, fullName, role) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
      role
    })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/users/me')
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  }
}

export default authService


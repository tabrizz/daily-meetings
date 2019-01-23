import axios from 'axios'

export const login = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_URL_API + '/login', user)
      .then(res => {
        const { token, user: { name } } = res.data
        localStorage.setItem('token', token)
        commit('authSuccess', { token, name })
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        resolve(res)
      })
      .catch(err => {
        localStorage.removeItem('token');
        commit('authError')

        reject(err);
      })
  })
}

export const logout = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit('authLogout')
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    resolve();
  })
}

export const changePassword = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_URL_API + '/change-password', user)
      .then(res => {
        const { token } = res.data
        localStorage.setItem('token', token)
        commit('changePasswordSuccess', { token })
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        resolve(res)
      })
      .catch(err => {
        
        reject(err)
      })
  })
}
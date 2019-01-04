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
        console.log(err);

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
import axios from "axios";

export const login = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_URL_API + "/users/authenticate", user)
      .then(res => {
        const { id, token, name, officeId } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("officeId", officeId);

        commit("authSuccess", { token, name });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        resolve(res);
      })
      .catch(err => {
        localStorage.removeItem("token");
        commit("authError");

        reject(err);
      });
  });
};

export const logout = ({ commit }) => {
  return new Promise(resolve => {
    commit("authLogout");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("officeId");
    delete axios.defaults.headers.common["Authorization"];

    resolve();
  });
};

export const changePassword = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    axios
      .put(process.env.VUE_APP_URL_API + `/users/change-password`, user)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("token", token);
        commit("changePasswordSuccess", { token });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

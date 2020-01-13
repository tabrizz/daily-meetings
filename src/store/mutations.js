export const authSuccess = (state, { token, name }) => {
  state.token = token;
  state.status = "success";
  state.name = name;
};

export const authError = state => {
  state.token = "";
  state.status = "error";
};

export const authLogout = state => {
  state.token = "";
  state.status = "";
};

export const changePasswordSuccess = (state, { token }) => {
  state.token = token;
  state.status = "success";
};

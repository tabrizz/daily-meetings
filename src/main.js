import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import Buefy from "buefy";
import Vuelidate from "vuelidate";
import store from "./store";
import axios from "axios";
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import "buefy/dist/buefy.css";

Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.config.productionTip = false;

import { required, confirmed, email } from "vee-validate/dist/rules";
extend("required", {
  ...required,
  message: "El campo es requerido"
});
extend("confirmed", {
  ...confirmed,
  message: "Los campos no coinciden"
});
extend("email", {
  ...email,
  message: "Ingrese un correo válido"
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

const token = localStorage.getItem("token");
const val = !!token;
if (val) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// axios.interceptors.request.use(function(config) {
//   const token = store.getters.token;
//   if (token) {
//       config.headers.Authorization = `Bearer 123123123`;
//   }
//   return config;
// }, function(err) {
//   console.log('error 401', err.status)
//   return new Promise(function (resolve, reject) {
//       if (err.status === 401 && err.config && !err.config.__isRetryRequest) {

//         this.$store.dispatch('logout')
//         router.push('login')
//       }
//       throw err;
//     });
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

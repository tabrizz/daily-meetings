import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Login from "./views/Login.vue";
import CreateMeeting from "./views/CreateMeeting.vue";
import ChangePassword from "./views/ChangePassword";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/change-password",
      name: "change-password",
      component: ChangePassword
    },
    {
      path: "/create-meeting",
      name: "create-meeting",
      component: CreateMeeting
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (["login"].includes(to.name)) {
    next();
  } else if (localStorage.getItem("token")) {
    next();
  } else {
    next("/login");
  }
});

export default router;

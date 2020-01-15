import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Login from "./views/Login.vue";
import ChangePassword from "./views/ChangePassword";
import MeetingsIndex from "./views/Meetings/Index";
import ListMeetings from "./views/Meetings/ListMeetings";
import CreateMeeting from "./views/Meetings/CreateMeeting";
import ShowMeeting from "./views/Meetings/ShowMeeting";

import UsersIndex from "./views/Users/Index";
import ListUsers from "./views/Users/ListUsers";
import CreateUser from "./views/Users/CreateUser";
import EditUser from "./views/Users/EditUser";

import EmployeesIndex from "./views/Employees/Index";
import ListEmployees from "./views/Employees/ListEmployees";
import CreateEmployee from "./views/Employees/CreateEmployee";
import EditEmployee from "./views/Employees/EditEmployee";

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
      path: "/meetings",
      name: "meetings",
      redirect: "/meetings/list",
      component: MeetingsIndex,
      children: [
        {
          path: "create",
          name: "create-meeting",
          component: CreateMeeting
        },
        {
          path: "list",
          name: "list-meeting",
          component: ListMeetings
        },
        {
          path: "show/:id",
          name: "show-meeting",
          component: ShowMeeting
        }
      ]
    },
    {
      path: "/users",
      name: "users",
      redirect: "/users/list",
      component: UsersIndex,
      children: [
        {
          path: "create",
          name: "create-user",
          component: CreateUser
        },
        {
          path: "list",
          name: "list-user",
          component: ListUsers
        },
        {
          path: "edit/:id",
          name: "edit-user",
          component: EditUser
        }
      ]
    },
    {
      path: "/employees",
      name: "employees",
      redirect: "/employees/list",
      component: EmployeesIndex,
      children: [
        {
          path: "create",
          name: "create-employee",
          component: CreateEmployee
        },
        {
          path: "list",
          name: "list-employee",
          component: ListEmployees
        },
        {
          path: "edit/:id",
          name: "edit-employee",
          component: EditEmployee
        }
      ]
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

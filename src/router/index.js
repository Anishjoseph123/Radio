import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "../views/MainHomePages/LoginPage.vue";
import LandingPage from "../views/MainHomePages/LandingPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/LandingPage",
    name: "LandingPage",
    component: LandingPage,
    children: [
      {
        path: "/Stations",
        name: "Stations",
        component: () => import("@/views/ChildHomePages/Stations.vue"),
      },
      {
        path: "/Categories",
        name: "Categories",
        component: () => import("@/views/ChildHomePages/Categories.vue"),
      },
      {
        path: "/BMSUsers",
        name: "BMSUsers",
        component: () => import("@/views/ChildHomePages/BMSUsers.vue"),
      },
      {
        path: "/Unverifiedstations",
        name: "UnverifiedStations",
        component: () =>
          import("@/views/ChildHomePages/UnverifiedStations.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
export default router;

// write below code inside RouterList.json for sub menus in nav drawer
// "SubMenu": [
//   {
//     "MenuName": "Sub",
//     "MenuICon": "mdi-email",
//     "MenuRoute": "Categories",
//     "has_child_routes": false,
//     "active": false
//   }
// ]

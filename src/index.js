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
        path: "/RaydeoStations",
        name: "RaydeoStations",
        component: () => import("@/views/ChildHomePages/RaydeoStations.vue"),
      },
      {
        path: "/BMSUsers",
        name: "BMSUsers",
        component: () => import("@/views/ChildHomePages/BMSUsers.vue"),
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

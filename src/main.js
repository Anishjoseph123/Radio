import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import router from "./router";
import { Amplify } from "aws-amplify";

Vue.config.productionTip = false;

Amplify.configure({
  Auth: {
    userPoolId: "xxxxxxxxxxxx",
    region: "ap-south-1",
    userPoolWebClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  API: {
    aws_project_region: "ap-south-1",
    aws_appsync_graphqlEndpoint:
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  },
});

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    libraries: "places",
  },
});

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

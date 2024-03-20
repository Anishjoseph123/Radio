import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import router from "./router";
import { Amplify } from "aws-amplify";

Vue.config.productionTip = false;

Amplify.configure({
  Auth: {
    userPoolId: "ap-south-1_8nDuyw57o",
    region: "ap-south-1",
    userPoolWebClientId: "lkc6nedpiieoql4bcs64j8icc",
  },
  API: {
    aws_project_region: "ap-south-1",
    aws_appsync_graphqlEndpoint:
      "https://4iz64aofavb55atgx54kfzn6mu.appsync-api.ap-south-1.amazonaws.com/graphql",
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  },
});

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBUp8E7OghfEFg9fJ1ePokoOhE1I8MaD-M",
    libraries: "places",
  },
});

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

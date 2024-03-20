import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);
export default new Vuex.Store({
  namespaced:true,
  plugins: [createPersistedState()],
  state: {
    EmailID: "",
    getPreviousRoute: "",

    projectDetails: {},
    getIssueDetails: {},
    currentUserDetails: {},
  },
  getters: {
    get_user_email: (state) => {
      return state.EmailID;
    },
    get_current_user_details: (state) => {
      return state.currentUserDetails;
    },
  },
  mutations: {
    SET_USEREMAIL(state, username) {
      state.EmailID = username;
    },
    SET_CURRENTUSER_DETAILS(state, user) {
      state.currentUserDetails = user;
    },
  },
  actions: {},
  modules: {},
});

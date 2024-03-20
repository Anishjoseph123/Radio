<template>
  <v-app>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <LogoutDialog :logoutDialog="logoutDialog" @clicked="dialogLogoutEmit" />
    <v-app-bar dense app clipped-left color="white" elevation="1">
      <v-app-bar-nav-icon
        color="primary"
        v-if="
          $vuetify.breakpoint.name == 'sm' ||
          $vuetify.breakpoint.name == 'md' ||
          $vuetify.breakpoint.name == 'xs'
        "
        @click="navDrawer = !navDrawer"
      ></v-app-bar-nav-icon>
      <div class="d-flex">
        <v-img
          src="../../assets/android-chrome-512x512.png"
          height="60"
          width="40"
          contain
          :class="$vuetify.breakpoint.xs ? 'mx-auto ml-n2' : 'ml-2'"
        ></v-img>
        <h3
          :class="
            $vuetify.breakpoint.xs
              ? 'mt-4 ml-1 subtitle-2 font-weight-bold'
              : 'ml-2 mt-4'
          "
        >
          Radio.ONE - BMS
        </h3>
      </div>
      <v-spacer />
      <span
        :class="
          $vuetify.breakpoint.xs
            ? 'caption mb-2 mr-n2 primary--text'
            : 'subtitle-2'
        "
      >
        {{ $store.getters.get_user_email }}
      </span>

      <v-tooltip bottom color="#474747">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            depressed
            v-bind="attrs"
            v-on="on"
            color="error"
            @click="logoutDialog = true"
            :class="$vuetify.breakpoint.xs ? 'mb-2 mr-n6' : ''"
          >
            <v-icon dark>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>
        <span class="subtitle-2 font-italic">Logout?</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer
      v-model="navDrawer"
      app
      clipped
      width="195px"
      color="#98bc90"
      dark
      class="pa-2 pr-2"
    >
      <v-list dark dense rounded> 
        <v-list-group
          dark
          link
          v-for="(item, idx) in RouterList"
          :key="idx"
          :append-icon="item.has_child_routes == true ? 'mdi-chevron-down' : ''"
          @click="
            $route.name != item.MenuRoute && item.has_child_routes == false
              ? $router.push(item.MenuRoute)
              : ''
          "
          v-model="item.active"
          :active-class="
            item.has_child_routes == false
              ? 'white primary--text'
              : ' black white--text '
          "
        >
          <template v-slot:activator>
            <v-list-item-action class="mr-0 ml-n1">
              <v-icon small class="mr-1 mb-1">{{ item.MenuICon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content :to="item.MenuRoute" link>
              <v-list-item-title>
                {{ !item.has_child_routes ? item.MenuName : item.MenuName }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item-group dark link>
            <v-list-item
              dark
              v-for="(sitem, i) in item.SubMenu"
              :key="i"
              link
              :to="sitem.MenuRoute"
            >
              <v-icon color="white" class="mx-2" small>{{
                sitem.MenuICon
              }}</v-icon>
              <v-list-item-title class="white--text mt-1"
                >{{ sitem.MenuName }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import RouterList from "@/JsonFiles/RouterList.json";
import Overlay from "@/components/Extras/Overlay.vue";
import Snackbar from "@/components/Extras/Snackbar.vue";
import { GetCurrentUser } from "@/mixins/GetCurrentUser.js";
import LogoutDialog from "../../components/LogoutDialog/LogoutDialog.vue";

export default {
  components: {
    Overlay,
    Snackbar,
    LogoutDialog,
  },
  mixins: [GetCurrentUser],
  data: () => ({
    logoutDialog: false,
    navDrawer: true,
    overlay: false,
    RouterList: [],
    SnackBarComponent: {},
  }),
  watch: {
    "$route.name"() {
      this.overlay = false;
    },
  },
  mounted() {
    this.RouterList = [];
    for (let i = 0; i < RouterList.length; i++) {
      this.RouterList.push({ ...RouterList[i] });
    }
    this.GetCurrentUserDetailsMethod();
  },
  methods: {
    dialogLogoutEmit(Toggle) {
      if (Toggle === 1) this.logoutDialog = false;
    },
  },
};
</script>

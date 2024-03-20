<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogActivateInactivateUser"
      persistent
      :hide-overlay="false"
      :retain-focus="true"
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '350px' : '400px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div class="font-weight-bold">
            <v-icon small class="mr-1 mb-1">{{
              StoreObj.user_status == "ACTIVE"
                ? "mdi-account-off"
                : "mdi-account-check"
            }}</v-icon>
            <span>{{
              StoreObj.user_status == "ACTIVE" ? "Deactivate" : "Activate"
            }}</span>
            User
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogActivateInactivateUserEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-2 pa-2 text-center">
          <!-- <v-icon
            size="50px"
            :color="StoreObj.user_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.user_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          > -->
          <div class="text-left subtitle-2 font-weight-bold black--text">
            Are you sure you want to
            <span
              :class="
                StoreObj.user_status == 'ACTIVE' ? 'red--text' : 'green--text'
              "
              >{{
                StoreObj.user_status == "ACTIVE" ? "Deactivate" : "Activate"
              }}</span
            >

            {{ StoreObj.user_email_id }}
            ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4 mt-2">
          <v-spacer />
          <v-btn
            small
            class="borderRadius text-uppercase"
            color="primary"
            outlined
            @click="dialogActivateInactivateUserEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius text-uppercase mr-2"
            depressed
            color="#98bc90"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { activateOrDeactivateUser } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogActivateInactivateUser: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    add_issuer: {
      user_name: "",
      user_email_id: "",
    },
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async activateInactivateMethod() {
      try {
        var inputParams = {
          user_email_id: this.StoreObj.user_email_id,
          action:
            this.StoreObj.user_status == "ACTIVE" ? "DEACTIVATE" : "ACTIVATE",
          updater_email_id: this.$store.getters.get_user_email,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(activateOrDeactivateUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateUser);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.status_message,
          };
        });

        this.dialogActivateInactivateUserEmit((this.Toggle = 2));
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
        });
      }
    },
    dialogActivateInactivateUserEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

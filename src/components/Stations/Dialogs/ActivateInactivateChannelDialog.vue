<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogActivateInactivateChannel"
      persistent
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div>
            <v-icon small class="mr-1 mb-1">{{
              StoreObj.channel_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon>
            <span class="font-weight-bold"
              >{{
                StoreObj.channel_status == "ACTIVE" ? "Deactivate" : "Activate"
              }}
              Channel</span
            >
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogActivateInactivateChannelEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-2 py-2 pb-0">
          <!-- <v-icon
            size="50px"
            :color="StoreObj.user_status == 'ACTIVE' ? 'red' : 'green'"
            >{{
              StoreObj.user_status == "ACTIVE" ? "mdi-close" : "mdi-check"
            }}</v-icon
          > -->
          <div
            class="text-left black--text font-weight-bold"
            :class="$vuetify.breakpoint.xs ? 'caption' : 'subtitle-2'"
          >
            Are you sure you want to
            <span
              :class="
                StoreObj.channel_status == 'ACTIVE'
                  ? 'red--text'
                  : 'green--text'
              "
              >{{
                StoreObj.channel_status == "ACTIVE" ? "Deactivate" : "Activate"
              }}
            </span>
            <b> {{ StoreObj.channel_name }}</b>
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
            @click="dialogActivateInactivateChannelEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius text-uppercase mr-2"
            color="#98bc90"
            :loading="loading"
            @click="activateInactivateMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon
            >{{
              StoreObj.channel_status == "ACTIVE" ? "deactivate" : "activate"
            }}</v-btn
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
    dialogActivateInactivateChannel: Boolean,
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

        this.dialogActivateInactivateChannelEmit((this.Toggle = 2));
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
    dialogActivateInactivateChannelEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

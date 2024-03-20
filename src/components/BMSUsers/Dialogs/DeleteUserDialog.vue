<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogDeleteUser"
      persistent
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div class="font-weight-bold">
            <v-icon small dark class="mr-1 mb-1">mdi-account-remove</v-icon>
            Delete User
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeleteUserEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-2 pb-0 text-center">
          <!-- <v-icon size="50px" color="red">mdi-delete</v-icon> -->
          <div class="text-left subtitle-2 font-weight-bold black--text">
            Are you sure you want to delete
            {{ StoreObj.user_email_id }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4 mt-2">
          <v-spacer />
          <v-btn
            small
            class="borderRadius text-capitalise"
            color="primary"
            outlined
            @click="dialogDeleteUserEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius text-capitalise mr-2"
            depressed
            color="#98bc90"
            :loading="loading"
            @click="DeleteUserMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { deleteUser } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogDeleteUser: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
  }),
  methods: {
    async DeleteUserMethod() {
      try {
        var inputParams = {
          user_email_id: this.StoreObj.user_email_id,
          updater_email_id: this.$store.getters.get_user_email,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(deleteUser, {
            input: inputParams,
          })
        );
        console.log("result", result);
        var ResultObject = JSON.parse(result.data.DeleteUser);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.status,
          };
        });
        this.dialogDeleteUserEmit((this.Toggle = 2));
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("Error", error);

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
    dialogDeleteUserEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

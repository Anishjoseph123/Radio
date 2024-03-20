<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogDeleteChannel"
      persistent
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div class="font-weight-bold">
            <v-icon small class="mr-1 mb-1">mdi-delete</v-icon>
            Delete Channel
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeleteChannelEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <!-- <v-icon size="50px" color="red">mdi-delete</v-icon> -->
          <div
            class="text-left black--text subtitle-2 font-weight-bold py-2 pb-0"
          >
            Are you sure you want to delete
            {{ StoreObj.channel_name }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4 pt-0">
          <v-spacer />
          <v-btn
            small
            class="borderRadius text-uppercase"
            color="primary"
            outlined
            dark
            @click="dialogDeleteChannelEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius mr-2"
            depressed
            color="#98bc90"
            :loading="loading"
            @click="DeleteChannelMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { deleteChannel } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogDeleteChannel: Boolean,
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
    async DeleteChannelMethod() {
      try {
        var inputParams = {
          user_email_id: this.$store.getters.get_user_email,
          channel_id: this.StoreObj.channel_id,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(deleteChannel, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.DeleteChannel);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.status_message,
          };
        });

        this.dialogDeleteChannelEmit((this.Toggle = 2));
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("Error", error);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: error.errors[0].message,
          };
        });
      }
    },
    dialogDeleteChannelEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

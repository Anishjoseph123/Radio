<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      :max-width="$vuetify.breakpoint.xs ? '350px' : '400px'"
      v-model="dialogPublishStationCatalog"
      transition="dialog-top-transition"
      :retain-focus="false"
    >
      <v-card>
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <div class="font-weight-bold">
            <v-icon small class="mr-1 mb-1">mdi-radio-tower</v-icon>
            Publish Station Catalog
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogPublishStationCatalogEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center">
          <!-- <v-icon class="my-2" size="50px">mdi-publish</v-icon> -->
          <div
            class="py-2 pb-0 text-left subtitle-2 black--text font-weight-bold"
          >
            Are you sure you want to Publish Station Catalog ?
          </div>
        </v-card-text>
        <v-card-actions class="pt-0 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="borderRadius"
            outlined
            color="primary"
            @click="dialogPublishStationCatalogEmit(1)"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="mr-2 borderRadius"
            color="#98bc90"
            depressed
            :loading="loading"
            @click="sendBroadCastBaseMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { sendBroadCast } from "@/mixins/Extras/sendBroadCast.js";

import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogPublishStationCatalog: Boolean,
    GetAllStationsList: Array,
    StoreObj: Object,
  },
  mixins: [sendBroadCast],
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    Toggle: 0,
    SnackBarComponent: {},
  }),
  mounted() {},
  methods: {
    async sendBroadCastBaseMethod() {
      let result = await this.sendBroadCastMethod(
        this.GetAllStationsList,
        "78767a735746445a354e316774743364746571"
      );
      if (result.status == "SUCCESS") {
        this.dialogPublishStationCatalogEmit(1);
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            renderComp: true,
            SnackbarText: result.status_message,
          };
        });
      }
    },
    dialogPublishStationCatalogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogActivateInactivateCategory"
      persistent
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      transition="dialog-top-transition"
      :hide-overlay="false"
      :retain-focus="true"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div class="font-weight-bold">
            <v-icon small dark class="mr-1 mb-1">{{
              StoreObj.category_status == "ACTIVE"
                ? "mdi-folder-off"
                : "mdi-folder-check"
            }}</v-icon>
            <span
              v-text="
                StoreObj.category_status == 'ACTIVE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            Category
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogActivateInactivateCategoryEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-2 pa-2 pb-0 text-center">
          <!-- <v-icon size="50px" :color="StoreObj.category_status == 'ACTIVE' ? 'red' : 'green'">{{ StoreObj.category_status == "ACTIVE" ? "mdi-close" : "mdi-check" }}</v-icon> -->
          <div
            class="text-left ml-2 font-weight-bold black--text"
            :class="$vuetify.breakpoint.xs ? 'caption' : 'subtitle-2'"
          >
            Are you sure you want to
            <span
              :class="
                StoreObj.category_status == 'ACTIVE'
                  ? 'red--text'
                  : 'green--text'
              "
              >{{
                StoreObj.category_status == "ACTIVE" ? "Deactivate" : "Activate"
              }}</span
            >
            {{ StoreObj.category_name }} ?
          </div>
        </v-card-text>
        <v-card-actions class="pb-4 mt-2">
          <v-spacer />
          <v-btn
            small
            class="borderRadius text-capitalise"
            color="primary"
            outlined
            @click="dialogActivateInactivateCategoryEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius text-capitalise mr-2"
            color="#98bc90"
            depressed
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
import { activateOrDeactivateCategory } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogActivateInactivateCategory: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    Toggle: 0,
    add_issuer: {
      user_name: "",
      category_name: "",
    },
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {},
  methods: {
    async activateInactivateMethod() {
      try {
        var inputParams = {
          category_id: this.StoreObj.category_id,
          action:
            this.StoreObj.category_status == "ACTIVE"
              ? "DEACTIVATE"
              : "ACTIVATE",
          user_email_id: this.$store.getters.get_user_email,
        };
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(activateOrDeactivateCategory, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateCategory);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            SnackbarText: ResultObject.status_message,
          };
        });

        this.dialogActivateInactivateCategoryEmit(2);
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
    dialogActivateInactivateCategoryEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

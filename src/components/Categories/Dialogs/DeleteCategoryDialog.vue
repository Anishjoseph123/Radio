<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogDeleteCategory"
      persistent
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      :hide-overlay="false"
      transition="dialog-top-transition"
      :retain-focus="true"
    >
      <v-card>
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <v-icon small class="mr-1">mdi-folder-remove</v-icon>
          <div class="font-weight-bold">Delete Category</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDeleteCategoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pa-2 pb-0 text-center">
          <!-- <v-icon size="50px" color="red">mdi-delete</v-icon> -->
          <div class="text-left subtitle-2 font-weight-bold black--text">
            Are you sure you want to delete
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
            @click="dialogDeleteCategoryEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="borderRadius mr-2"
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
import { activateOrDeactivateCategory } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogDeleteCategory: Boolean,
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
          action: "DELETE",
          category_id: this.StoreObj.category_id,
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
            SnackbarVmodel: true,
            SnackbarColor: "green",
            Top: true,
            renderComp: true,
            SnackbarText: ResultObject.status_message,
          };
        });

        this.dialogDeleteCategoryEmit((this.Toggle = 2));
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
    dialogDeleteCategoryEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

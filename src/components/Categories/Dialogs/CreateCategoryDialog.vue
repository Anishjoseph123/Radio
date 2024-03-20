<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      v-model="dialogCreateCategory"
      :retain-focus="true"
      :hide-overlay="false"
    >
      <v-card>
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <v-icon small dark class="mr-1">
            {{
              StoreObj.action == "EDIT" ? "mdi-folder-edit" : "mdi-folder-plus"
            }}
          </v-icon>
          <div class="font-weight-bold">
            {{ StoreObj.action == "EDIT" ? "Edit" : "Create" }} Category
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCreateCategoryEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-row dense align="center" justify="center">
            <v-col cols="12" lg="12" md="12" xl="12" sm="12" xs="12">
              <v-form ref="form" class="mt-4">
                <v-row dense no-gutters>
                  <v-col cols="12" lg="12" md="12" xl="12" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Category Name*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="create_category.category_name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" md="12" xl="12" sm="12" xs="12">
                    <v-text-field
                      dense
                      outlined
                      label="Category Description*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="create_category.category_description"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="borderRadius"
            outlined
            color="primary"
            @click="dialogCreateCategoryEmit((Toggle = 1))"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="mr-2 borderRadius"
            depressed
            color="#98bc90"
            :loading="loading"
            @click="validateFormMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { createCategory, updateCategory } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";

import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogCreateCategory: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    Toggle: 0,
    user_type: "",
    create_category: {
      category_name: "",
      category_description: "",
    },
    SnackBarComponent: {},
  }),
  watch: {
    dialogCreateCategory(value) {
      if (value == true && this.StoreObj.action == "EDIT") {
        this.create_category.category_name = this.StoreObj.category_name;
        this.create_category.category_description =
          this.StoreObj.category_description;
      }
    },
  },
  methods: {
    validateFormMethod() {
      if (this.$refs.form.validate()) {
        this.createCategoryMethod();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            SnackbarText: "Fields cannot be empty!!!",
          };
        });
      }
    },
    async createCategoryMethod() {
      var inputParams = {
        category_name: this.create_category.category_name,
        category_description: this.create_category.category_description,
        user_email_id: this.$store.getters.get_user_email,
        category_id:
          this.StoreObj.action == "EDIT"
            ? this.StoreObj.category_id
            : undefined,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(
            this.StoreObj.action == "CREATE" ? createCategory : updateCategory,
            {
              input: inputParams,
            }
          )
        );
        var ResultObject = JSON.parse(
          result.data[
            this.StoreObj.action == "CREATE"
              ? "CreateCategory"
              : "UpdateCategory"
          ]
        );
        if (ResultObject.status == "Success") {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "success",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
          });

          console.log("Result Object", ResultObject);
          this.dialogCreateCategoryEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        console.log(error);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
        });

        this.loading = false;
      }
    },
    dialogCreateCategoryEmit(Toggle) {
      //if (this.$refs.form != undefined) {
      this.$refs.form.reset();
      // }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

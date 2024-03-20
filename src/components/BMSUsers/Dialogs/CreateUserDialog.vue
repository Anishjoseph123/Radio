<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      v-model="dialogCreateBMSUser"
      :retain-focus="false"
    >
      <v-card>
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <v-icon small class="mr-1">
            {{ StoreObj.action == "EDIT" ? "mdi-pencil" : "mdi-account-plus" }}
          </v-icon>
          <div class="font-weight-bold">
            {{ StoreObj.action == "EDIT" ? "Edit" : "Create" }} User
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="createUserDialogEmit((Toggle = 1))"
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
                      label="Email ID*"
                      class="field_height field_label_size fontSizeVariant1 mx-2 mt-2"
                      :rules="[rules.required, rules.email]"
                      v-model="create_user.user_email_id"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon class="mr-1" small color="primary"
                          >mdi-email</v-icon
                        >
                      </template>
                    </v-text-field>
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
            @click="createUserDialogEmit((Toggle = 1))"
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
import { createUser } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogCreateBMSUser: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    Toggle: 0,
    user_type: "",
    create_user: {
      user_email_id: "",
    },
    SnackBarComponent: {},
    rules: {
      required: (v) => !!v || "Required.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Email must be valid.";
      },
    },
  }),
  // watch: {
  //   dialogCreateBMSUser(val) {
  //     if (val && this.StoreObj.action == "EDIT") {
  //       this.create_user.user_email_id = this.StoreObj.user_email_id;
  //     }
  //   },
  // },
  methods: {
    validateFormMethod() {
      if (this.$refs.form.validate()) {
        this.createUserMethod();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: "Please Enter Email ID!",
          };
        });
      }
    },
    async createUserMethod() {
      var inputParams = {
        user_email_id:
          this.StoreObj.action == "CREATE"
            ? this.create_user.user_email_id
            : undefined,
        creator_email_id:
          this.StoreObj.action == "EDIT"
            ? this.$store.getters.get_user_email
            : undefined,
      };
      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(createUser, {
            input: inputParams,
          })
        );
        var ResultObject = JSON.parse(result.data.CreateUser);

        if (ResultObject.status == "Success") {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              SnackbarText: ResultObject.status_message,
            };
          });
          this.createUserDialogEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        console.log("List BMS User", error);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
        });

        this.loading = false;
      }
    },
    createUserDialogEmit(Toggle) {
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

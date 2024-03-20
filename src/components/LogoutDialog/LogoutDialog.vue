<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      :max-width="400"
      v-model="logoutDialog"
      :hide-overlay="false"
      :retain-focus="true"
      transition="scroll-y-transition"
    >
      <v-card height="100" width="auto" outlined hover>
        <v-card-text
          :class="$vuetify.breakpoint.xs ? 'caption  pa-2' : 'subtitle-1 pa-2'"
          class="black--text font-weight-bold"
        >
          <div class="text-center">
            Are you sure you want to logout from
            <span class="success--text"> Radio.ONE?</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="primary" outlined @click="dialogLogoutEmit(1)"
            ><v-icon small class="mr-1">mdi-close</v-icon>no, stay back</v-btn
          >
          <v-btn
            small
            class="mr-2"
            color="error"
            :loading="loading"
            @click="SignOut()"
            ><v-icon small class="mr-1">mdi-power</v-icon>yes, Logout</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    logoutDialog: Boolean,
  },
  components: {
    Snackbar,
  },
  data: () => ({
    loading: false,
    SnackBarComponent: {},
  }),
  methods: {
    async SignOut() {
      this.loading = true;

      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "success",
          Top: true,
          renderComp: true,
          SnackbarText: "Logged Out Successfully.",
        };
      });

      await Auth.signOut().then(() => {
        setTimeout(() => {
          this.$router.push("/");
        }, 500);
      });
    },
    dialogLogoutEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>

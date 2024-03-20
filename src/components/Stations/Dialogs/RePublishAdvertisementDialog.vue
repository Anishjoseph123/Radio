<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      transition="dialog-top-transition"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      v-model="dialogRePublishAdvertisement"
      :retain-focus="true"
      :hide-overlay="false"
    >
      <v-card>
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <div class="font-weight-bold">
            <v-icon small class="mr-1">mdi-publish</v-icon>
            Publish Advertisement
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogRePublishAdvertisementEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center mt-4">
          <v-form ref="form">
            <v-img
              :src="publish_advertisement_object.section_image_url"
              alt="img"
              contain
            ></v-img>
            <v-text-field
              dense
              outlined
              label="Advertisement Source URL"
              v-model="publish_advertisement_object.section_body"
              class="field_height field_label_size fontSizeVariant1 mx-6 mt-2"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pt-0 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            small
            class="borderRadius"
            outlined
            color="primary"
            @click="dialogRePublishAdvertisementEmit(1)"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="mr-2 borderRadius"
            color="#98bc90"
            :loading="loading"
            @click="validateMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Re-publish</v-btn
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
    dialogRePublishAdvertisement: Boolean,
    StoreObj: Object,
    addObject: Object,
  },
  components: {
    Snackbar,
  },
  mixins: [sendBroadCast],
  data: () => ({
    height: 0,
    croppaWidth: 0,
    loading: false,

    section_body: "",
    image_type: "UPLOAD",
    section_image_url: "",

    imageVmodel: {},
    SnackBarComponent: {},
    selectedFileObject: {},
    publish_advertisement_object: {
      section_type: "IMAGE",
      section_body: "",
      section_image_type: "WITH_DESCRIPTION",
      section_image_url: "",
    },
  }),
  watch: {
    dialogRePublishAdvertisement(value) {
      if (value == true) {
        this.publish_advertisement_object.section_image_url =
          this.addObject.channel_message.description[0].section_image_url;
        this.publish_advertisement_object.section_body =
          this.addObject.channel_message.description[0].section_body !=
          "NOT_INFORMATION_SOURCE"
            ? this.addObject.channel_message.description[0].section_body
            : "";
      }
    },
  },
  mounted() {
    this.croppaWidth = window.innerWidth / 5;
    this.height = window.innerHeight - 260;
    console.log("Check The Store Object", this.StoreObj);
  },
  methods: {
    async validateMethod() {
      if (
        this.publish_advertisement_object.section_image_url &&
        this.publish_advertisement_object.section_image_url != ""
      ) {
        let publish_advertisement_object = {
          ...this.publish_advertisement_object,
        };
        if (publish_advertisement_object.section_body == "") {
          publish_advertisement_object.section_body = "NOT_INFORMATION_SOURCE";
          publish_advertisement_object.section_id =
            this.StoreObj.channel_section_id;
          publish_advertisement_object.section_title =
            this.StoreObj.channel_name;
        }
        let result = await this.sendBroadCastMethod(
          [publish_advertisement_object],
          this.StoreObj.channel_api_key
        );
        if (result.status == "SUCCESS") {
          this.dialogRePublishAdvertisementEmit(2);
        }
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Please Enter Email ID!",
          };
        });
      }
    },
    dialogRePublishAdvertisementEmit(Toggle) {
      this.publish_advertisement_object = {
        section_type: "IMAGE",
        section_body: "",
        section_image_type: "WITH_DESCRIPTION",
        section_image_url: "",
      };
      if (this.$refs.form != undefined) {
        this.$refs.form.reset();
      }
      this.imageVmodel = {};
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

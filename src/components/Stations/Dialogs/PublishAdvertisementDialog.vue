<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      :hide-overlay="false"
      :max-width="$vuetify.breakpoint.xs ? '300px' : '400px'"
      v-model="dialogPublishAdvertisement"
      :retain-focus="true"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <div class="font-weight-bold">
            <v-icon small class="mr-1 mb-1">mdi-publish</v-icon>
            Publish Advertisement
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogPublishAdvertisementEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="text-center">
          <v-form ref="form">
            <croppa
              :v-model="imageVmodel"
              :width="$vuetify.breakpoint.xs ? 250 : 308"
              :height="$vuetify.breakpoint.xs ? 250 : 310"
              class="mt-4"
              :accept="'image/*'"
              :canvas-color="`#E5E4E2`"
              :placeholder-color="'green'"
              :placeholder-font-size="0"
              :disabled="false"
              :prevent-white-space="false"
              :show-remove-button="true"
              @file-choose="checkImage"
              @image-remove="handleImageRemove"
              @move="handleCroppaMove"
              @zoom="handleCroppaZoom"
            >
            </croppa>
            <v-row dense no-gutters>
              <v-col cols="12" lg="12" md="12" xl="12" sm="12" xs="12">
                <v-text-field
                  dense
                  outlined
                  label="Advertisement Source URL"
                  :rules="[(v) => !!v || 'Required.']"
                  v-model="publish_advertisement_object.section_body"
                  :class="
                    $vuetify.breakpoint.xs
                      ? 'field_height field_label_size fontSizeVariant1 pa-2'
                      : 'field_height field_label_size fontSizeVariant1 mx-6 mt-3'
                  "
                >
                  <template v-slot:prepend-inner>
                    <v-icon small color="primary" class="mr-1">mdi-web</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions
          :class="$vuetify.breakpoint.xs ? 'mt-n10 pa-2' : 'pt-n12'"
        >
          <v-spacer></v-spacer>
          <v-btn
            small
            class="borderRadius text-uppercase"
            outlined
            color="primary"
            @click="dialogPublishAdvertisementEmit(1)"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="mr-2 borderRadius text-uppercase"
            color="#98bc90"
            depressed
            :loading="loading"
            @click="validateMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon>Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import Croppa from "vue-croppa";
Vue.use(Croppa);

import { sendBroadCast } from "@/mixins/Extras/sendBroadCast.js";
import { uploadFileToS3 } from "@/mixins/Extras/uploadFileToS3.js";

import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogPublishAdvertisement: Boolean,
    StoreObj: Object,
  },
  components: {
    Snackbar,
  },
  mixins: [uploadFileToS3, sendBroadCast],
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
  watch: {},
  mounted() {
    // this.croppaWidth = window.innerWidth / 5;
    // console.log(this.croppaWidth);
    this.height = window.innerHeight - 260;
  },
  methods: {
    async validateMethod() {
      if (this.$refs.form.validate()) {
        if (
          this.publish_advertisement_object.section_image_url &&
          this.publish_advertisement_object.section_image_url != ""
        ) {
          let publish_advertisement_object = {
            ...this.publish_advertisement_object,
          };
          publish_advertisement_object.section_id =
            this.StoreObj.channel_section_id;
          publish_advertisement_object.section_title =
            this.StoreObj.channel_name;
          if (publish_advertisement_object.section_body == "") {
            publish_advertisement_object.section_body =
              "NOT_INFORMATION_SOURCE";
          }
          let result = await this.sendBroadCastMethod(
            [publish_advertisement_object],
            this.StoreObj.channel_api_key
          );
          if (result.status == "SUCCESS") {
            this.dialogPublishAdvertisementEmit(2);
          }
        } else {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Please Upload Image",
            };
          });
        }
      }
    },
    async handleCroppaZoom() {
      const blob = await this.imageVmodel.promisedBlob();
      blob.name = `${new Date().getTime()}.png`;
      this.checkImage(blob);
    },
    async handleCroppaMove() {
      const blob = await this.imageVmodel.promisedBlob();
      blob.name = `${new Date().getTime()}.png`;
      this.checkImage(blob);
    },
    handleImageRemove() {
      this.section.section_image_url = "";
      this.selectedFileObject = {};
    },
    async checkImage(e) {
      let result = await this.uploadImageToS3Method(e);
      if (result.status == "SUCCESS") {
        this.publish_advertisement_object.section_image_url = result.file_url;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "success",
            Top: true,
            SnackbarText: "Image Uploaded Successfully.",
          };
        });
      }
    },
    dialogPublishAdvertisementEmit(Toggle) {
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

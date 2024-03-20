<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      v-model="dialogApproveRejectStation"
      transition="dialog-top-transition"
      persistent
      :max-width="$vuetify.breakpoint.xs ? '450px' : '600px'"
      :hide-overlay="false"
      :retain-focus="true"
    >
      <v-card height="auto" width="auto">
        <v-toolbar dark dense class="elevation-0" color="#474747">
          <div class="font-weight-bold">
            <v-icon small class="mr-1">mdi-check-decagram</v-icon>
            Verify Station
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogApproveRejectStationEmit(1)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="mt-5 pb-0">
          <v-row dense no-gutters align="center" justify="center">
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <v-form ref="form">
                <v-row dense>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      dense
                      outlined
                      rounded
                      readonly
                      :value="StoreObject.channel_name"
                      label="Station Name*"
                      class="field_height field_label_size fontSizeVariant1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-select
                      dense
                      outlined
                      rounded
                      label="Station Category*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="StoreObject.channel_category"
                      :items="GetAllCategoriesList"
                      item-text="category_name"
                      item-value="category_name"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" lg="12" md="6" sm="12" xl="6" xs="12">
                    <v-text-field
                      dense
                      outlined
                      rounded
                      readonly
                      :value="StoreObject.channel_stream_url"
                      label="Station Stream URL*"
                      class="field_height field_label_size fontSizeVariant1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12" md="12" sm="12" xl="12" xs="12">
                    <v-textarea
                      dense
                      outlined
                      rounded
                      rows="1"
                      auto-grow
                      label="Station Description*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="StoreObject.channel_description"
                    ></v-textarea>
                  </v-col>
                  <v-row dense>
                    <v-col cols="12" lg="6" md="6" xl="6" sm="12" xs="12">
                      <v-file-input
                        outlined
                        dense
                        rounded
                        prepend-icon="mdi-camera"
                        class="field_height field_label_size fontSizeVariant1"
                        label="Station Image*"
                        v-model="channelImageInput"
                        :rules="[(v) => !!v || 'Please Upload Image.']"
                        accept="image/*"
                        @change="onChangeEvent"
                      >
                      </v-file-input>
                    </v-col>

                    <v-row dense v-if="StoreObject.channel_image_url">
                      <v-col cols="12" lg="6" md="6" xl="6" sm="12" xs="12">
                        <v-tooltip right color="#474747">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              @click="delete_image"
                              color="error"
                              v-on="on"
                              v-bind="attrs"
                              style="margin-left: 260px; top: 20px"
                              ><v-icon>mdi-delete</v-icon></v-btn
                            >
                          </template>
                          <span>Delete Image</span>
                        </v-tooltip>
                        <div v-show="StoreObject.channel_image_url !== ''">
                          <h5 class="black--text">Original Image</h5>

                          <cropper
                            :src="StoreObject.channel_image_url"
                            :stencil-props="{
                              aspectRatio: 1 / 1,
                            }"
                            ref="cropper"
                            @change="change"
                          ></cropper>
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        lg="6"
                        md="6"
                        xl="6"
                        sm="12"
                        xs="12"
                        class=""
                      >
                        <div
                          v-show="StoreObject.channel_image_url !== ''"
                          class="ml-6 mt-12"
                        >
                          <h5 class="black--text">Cropped Output Image</h5>

                          <canvas
                            id="PreviewImage"
                            height="200px"
                            width="250px"
                          ></canvas>
                        </div>
                      </v-col>
                      <v-btn
                        color="#98bc90"
                        v-show="StoreObject.channel_image_url !== ''"
                        depressed
                        small
                        class="mb-2 ml-16"
                        @click="handleFileUpload(croppedImageInput)"
                        :loading="loading1"
                      >
                        <v-icon small class="mr-1" dark>mdi-upload</v-icon>
                        upload image</v-btn
                      >
                    </v-row>
                    <v-col
                      cols="12"
                      lg="12"
                      md="12"
                      xl="12"
                      sm="12"
                      xs="12"
                      v-show="StoreObject.channel_image_url"
                    >
                      <v-card-title class="text-center black--text"
                        >Uploaded Station Image</v-card-title
                      >
                      <v-tooltip right color="#474747">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            small
                            v-on="on"
                            v-bind="attrs"
                            color="error"
                            dark
                            style="left: 183px"
                            @click="delete_image"
                          >
                            <v-icon>mdi-delete</v-icon></v-btn
                          >
                        </template>
                        <span>Delete Image</span>
                      </v-tooltip>
                      <v-img
                        :src="StoreObject.channel_image_url"
                        v-show="StoreObject.channel_image_url"
                        alt="Cropped Image"
                        height="200"
                        width="200"
                        style="border: 1px solid black"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-row>
              </v-form>
            </v-col>
            <v-col
              cols="12"
              xs="12"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="mt-3"
            >
              <v-toolbar dense class="elevation-0 py-0">
                <v-icon class="ml-n2" color="primary" dark>mdi-magnify</v-icon>
                <gmap-autocomplete
                  placeholder="Search Location*"
                  style="
                    width: 1200px;
                    border-bottom: 1px solid black;
                    font-size: 15px;
                  "
                  :value="search"
                  class="ml-0"
                  ref="clearSearch"
                  @place_changed="setPlace"
                >
                </gmap-autocomplete>
              </v-toolbar>
              <v-card class="elevation-0" height="350px">
                <gmap-map
                  :center="mapCenter"
                  :zoom="mapZoom"
                  style="width: 100%; height: 400px"
                >
                  <gmap-marker
                    v-if="markerPosition"
                    :position="markerPosition"
                    :clickable="true"
                    :draggable="true"
                    @click="mapCenter = markerPosition"
                    @dragend="updateCoordinates"
                  ></gmap-marker>
                </gmap-map>
                <v-col cols="12" lg="12" md="12" sm="12" xl="12" xs="12">
                  <v-text-field
                    dense
                    outlined
                    rounded
                    readonly
                    label="Station Location"
                    @focus="getCoordinates"
                    @input="setPlace"
                    class="field_height field_label_size fontSizeVariant1 mt-2"
                    :value="StoreObject.channel_location"
                  >
                    <template v-slot:prepend-inner
                      ><v-icon small dark color="primary" dense
                        >mdi-map-marker</v-icon
                      ></template
                    >
                  </v-text-field>
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-16 mt-16">
          <v-spacer />
          <v-btn
            outlined
            color="primary"
            depressed
            small
            dark
            @click="dialogApproveRejectStationEmit((Toggle = 1))"
          >
            <v-icon small class="mr-1">mdi-close</v-icon>
            Close
          </v-btn>
          <v-btn
            small
            color="error"
            depressed
            @click="validateFormMethod(), (StoreObject.action = 'REJECT')"
            ><v-icon small class="mr-1">mdi-cancel</v-icon>Reject</v-btn
          >
          <v-btn
            small
            class="mr-2"
            color="#98bc90"
            :loading="loading"
            @click="validateFormMethod(), (StoreObject.action = 'APPROVE')"
            ><v-icon small class="mr-1">mdi-check</v-icon>Approve</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Snackbar from "@/components/Extras/Snackbar.vue";
import { API, graphqlOperation } from "aws-amplify";
import { approveOrRejectChannel } from "@/graphql/mutations.js";
import { uploadFileToS3 } from "@/mixins/Extras/uploadFileToS3.js";
import { GetUnverifiedStations } from "@/mixins/GetUnverifiedStations.js";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { GetAllCategories } from "@/mixins/GetAllCategories.js";

export default {
  props: {
    dialogApproveRejectStation: Boolean,
    StoreObject: Object,
  },
  components: {
    Snackbar,
    Cropper,
  },
  mixins: [GetAllCategories, uploadFileToS3, GetUnverifiedStations],
  data: () => ({
    mapCenter: { lat: 0, lng: 0 },
    mapZoom: 12,
    markerPosition: null,
    loading: false,
    SnackBarComponent: {},
    channelImageInput: null,
    croppedImageInput: {},
    croppedImg: "",
    currentLocation: "",
    currentPlace: "",
    loading1: false,
    search: "",
  }),
  mounted() {
    this.GetAllCategoriesMethod();
    window.onload = () => {
      this.updateCoordinates();
    };
  },

  methods: {
    async getCoordinates() {
      try {
        const apiKey = "AIzaSyBUp8E7OghfEFg9fJ1ePokoOhE1I8MaD-M";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          this.StoreObject.channel_location
        )}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (
          data.results.length > 0 &&
          data.results[0].geometry &&
          data.results[0].geometry.location
        ) {
          const { lat, lng } = data.results[0].geometry.location;
          this.markerPosition = { lat, lng };
          this.mapCenter = { lat, lng };
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "success",
              Top: true,
              renderComp: true,
              SnackbarText: `Located Address: ${this.StoreObject.channel_location}`,
            };
          });
          console.log("Address:", this.StoreObject.channel_location);
        } else {
          this.mapCenter.lat = 0;
          this.mapCenter.lng = 0;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "error",
              Top: true,
              renderComp: true,
              SnackbarText: "Address not found.",
            };
          });
          console.log("Address not found!");
        }
      } catch (error) {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            renderComp: true,
            SnackbarText: error,
          };
        });
        console.error("Error fetching co-ordinates:", error);
      }
    },
    async getAddress() {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(
        parseFloat(this.mapCenter.lat),
        parseFloat(this.mapCenter.lng)
      );
      await geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          this.StoreObject.channel_location = results[0].formatted_address;
        } else {
          this.StoreObject.channel_location = "Address not found.";
        }
      });
    },
    onChangeEvent(e) {
      console.log("File Uploaded", e);
      if (e) {
        let imageUrl = URL.createObjectURL(e);

        console.log("File Object", imageUrl);
        this.StoreObject.channel_image_url = imageUrl;
        console.log("Image URL", this.StoreObject.channel_image_url);
        console.log("Image URL again", imageUrl);
        const url = new URL(imageUrl);
        console.log(url);
      } else {
        this.channelImageInput = null;
      }
    },
    change({ canvas }) {
      console.log("canvas object", canvas);
      this.PreviewMethod(canvas);
    },
    async PreviewMethod(getsize) {
      const canvas = document.getElementById("PreviewImage");
      canvas.width = getsize.width;
      canvas.height = getsize.height;
      console.log("Canvas height", canvas.height);
      console.log("Canvas width", canvas.width);
      const context = canvas.getContext("2d");
      context.drawImage(getsize, 0, 0, getsize.width, getsize.height);
      const img = canvas.toDataURL("image/jpeg");
      const res = await fetch(img);
      const buff = await res.arrayBuffer();
      let files = [
        new File([buff], `CroppedImage_${new Date().getTime()}.jpg`, {
          type: "image/*",
        }),
      ];
      console.log("files", files);
      this.croppedImageInput = files;
      let new_image_url = context.canvas.toDataURL("image/*");
      this.croppedImg = new_image_url;
      console.log("Cropped image URL", this.croppedImg);
      console.log("Base 64 url:", new_image_url);
    },
    handleFileUpload(e) {
      this.loading1 = true;
      console.log("check file", e);
      this.uploadImageToS3Method(e)
        .then((url) => {
          console.log("S3 URL", url);
          this.StoreObject.channel_image_url = url.file_url;
          console.log("Image S3 URL", url);
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "success",
              Top: true,
              renderComp: true,
              SnackbarText: "Image Uploaded Successfully",
            };
          });

          this.loading1 = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading1 = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "error",
              Top: true,
              renderComp: true,
              SnackbarText: "Error in Uploading Image.",
            };
          });
        });
      self;
      console.log(
        "Image after cropping",
        this.create_station.channel_image_url
      );
    },
    delete_image() {
      this.StoreObject.channel_image_url = "";
      this.channelImageInput = null;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "success",
          Top: true,
          renderComp: true,
          SnackbarText: "Image Removed Successfully.",
        };
      });
    },
    async updateCoordinates() {
      this.StoreObject.channel_lat = this.mapCenter.lat;
      this.StoreObject.channel_long = this.mapCenter.lng;
      this.getAddress();
      console.log("My current location is:", this.StoreObject.channel_location);
    },
    async setPlace(place) {
      this.currentPlace = place;
      console.log("Check The Place", place);
      this.StoreObject.channel_location = place.formatted_address;
      console.log("Location:", this.currentLocation);
      var self = this;
      this.mapCenter.lat = this.currentPlace.geometry.location.lat();
      this.mapCenter.lng = this.currentPlace.geometry.location.lng();
      this.markerPosition = [];
      this.StoreObject.channel_lat = this.currentPlace.geometry.location.lat();
      this.StoreObject.channel_long = self.currentPlace.geometry.location.lng();
      (this.markerPosition = {
        lat: this.currentPlace.geometry.location.lat(),
        lng: this.currentPlace.geometry.location.lng(),
      }),
        this.getAddress();
    },

    validateFormMethod() {
      if (this.$refs.form.validate()) {
        this.approveRejectMethod();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            renderComp: true,
            SnackbarText: "Fields marked with * are mandatory.",
          };
        });
      }
    },
    async approveRejectMethod() {
      try {
        var inputParams = {
          channel_name: this.StoreObject.channel_name,
          channel_id: this.StoreObject.channel_id,
          updater_email_id: this.$store.getters.get_user_email,
          channel_description: this.StoreObject.channel_description,
          channel_category: this.StoreObject.channel_category,
          channel_lat: this.StoreObject.channel_lat,
          channel_long: this.StoreObject.channel_long,
          channel_image_url: this.StoreObject.channel_image_url,
          channel_location: this.StoreObject.channel_location,
          action: this.StoreObject.action,
        };
        this.loading = true;
        let result = API.graphql(
          graphqlOperation(approveOrRejectChannel, {
            input: inputParams,
          })
        );
        console.log("Inputs", inputParams);
        var ResultObject = JSON.parse(
          (await result).data.ApproveOrRejectChannel
        );
        console.log("status", ResultObject.status);
        console.log("Result Object", ResultObject);

        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "success",
            Top: true,
            renderComp: true,
            SnackbarText: ResultObject.status_message,
          };
        });
        this.dialogApproveRejectStationEmit(2);
        this.loading = false;
      } catch (error) {
        this.loading = false;
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
      }
    },
    dialogApproveRejectStationEmit(Toggle) {
      this.$emit("clicked", Toggle);
      this.mapCenter.lat = 0;
      this.mapCenter.lng = 0;
    },
  },
};
</script>

<style></style>

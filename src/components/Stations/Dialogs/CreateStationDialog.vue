<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-dialog
      persistent
      :max-width="$vuetify.breakpoint.xs ? '450px' : '600px'"
      v-model="dialogCreateStation"
      :hide-overlay="false"
      transition="dialog-top-transition"
      :retain-focus="true"
    >
      <v-card height="auto" width="auto">
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <v-icon small class="mr-1">
            {{ StoreObj.action == "EDIT" ? "mdi-pencil" : "mdi-plus" }}
          </v-icon>
          <div class="font-weight-bold">
            {{ StoreObj.action == "EDIT" ? "Edit" : "Create" }} Station
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogCreateStationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-row dense no-gutters>
            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
              <v-form ref="form" class="mt-4">
                <v-row dense>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      dense
                      outlined
                      rounded
                      label="Station Name*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="rules"
                      v-model="create_station.channel_name"
                      counter="25"
                      maxlength="25"
                      @keydown="maxCharLimit"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-select
                      dense
                      outlined
                      rounded
                      label="Station Category*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="rules"
                      v-model="create_station.channel_category"
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
                      label="Station Stream URL*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="rules"
                      v-model="create_station.channel_stream_url"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" lg="12" md="12" sm="12" xl="12" xs="12">
                    <v-textarea
                      dense
                      outlined
                      rounded
                      :rows="1"
                      auto-grow
                      label="Station Description*"
                      class="field_height field_label_size fontSizeVariant1"
                      :rules="rules"
                      v-model="create_station.channel_description"
                    ></v-textarea>
                  </v-col>
                  <v-row dense>
                    <v-col
                      cols="12"
                      lg="6"
                      md="6"
                      xl="6"
                      sm="12"
                      xs="12"
                      v-if="create_station.channel_image_url == ''"
                    >
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
                    <v-row dense>
                      <v-col
                        cols="12"
                        lg="6"
                        md="6"
                        xl="6"
                        sm="12"
                        xs="12"
                        v-if="channelImageInput !== null"
                      >
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
                        <div>
                          <h5 class="black--text">Original Image</h5>

                          <cropper
                            :src="create_station.channel_image_url"
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
                        v-if="channelImageInput !== null"
                      >
                        <div class="ml-2 mt-auto">
                          <h5 class="black--text">Cropped Output Image</h5>

                          <canvas id="PreviewImage"></canvas>
                        </div>
                      </v-col>
                      <v-btn
                        v-if="channelImageInput !== null"
                        color="#98bc90"
                        depressed
                        small
                        class="mb-2 ml-16"
                        @click="handleFileUpload(croppedImageInput)"
                        :loading="loading1"
                      >
                        <v-icon small dark>mdi-upload</v-icon>
                        upload image</v-btn
                      >
                    </v-row>
                    <v-row
                      v-if="create_station.channel_image_url !== ''"
                      dense
                      no-gutters
                      style="width: 50%; margin-right: 250px; margin-top: -25px"
                    >
                      <v-col cols="12" lg="12" md="12" xl="12" sm="12" xs="12">
                        <v-card-title class="subtitle-2 black--text mt-2">
                          <span> Uploaded Station Image</span></v-card-title
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
                          :src="create_station.channel_image_url"
                          alt="Cropped Image"
                          height="200px"
                          width="200px"
                          style="border: 1px solid black"
                        ></v-img>
                      </v-col>
                    </v-row>
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
                  :center="center"
                  :zoom="13"
                  style="width: 100%; height: 100%"
                >
                  <GmapMarker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="true"
                    @click="center = m.position"
                    @drag="updateCoordinates"
                  />
                </gmap-map>
                <v-col
                  cols="12"
                  lg="12"
                  md="12"
                  sm="12"
                  xl="12"
                  xs="12"
                  v-if="currentLocation"
                >
                  <v-text-field
                    dense
                    outlined
                    rounded
                    readonly
                    label="Station Location"
                    class="field_height field_label_size fontSizeVariant1 mt-2"
                    v-model="currentLocation"
                    @input="setPlace"
                  >
                    <template v-slot:prepend-inner
                      ><v-icon small dark color="#474747" dense
                        >mdi-map-marker</v-icon
                      ></template
                    >
                  </v-text-field>
                </v-col>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions
          :class="currentLocation !== '' ? 'pt-0 pb-4 mt-12' : 'pt-0 pb-4'"
        >
          <v-spacer></v-spacer>
          <v-btn
            small
            class="borderRadius"
            outlined
            color="primary"
            @click="dialogCreateStationEmit(1)"
            ><v-icon small class="mr-1">mdi-close</v-icon>Cancel</v-btn
          >
          <v-btn
            small
            class="mr-2 borderRadius"
            color="#98bc90"
            depressed
            :loading="loading"
            @click="validateFormMethod()"
            ><v-icon small class="mr-1">mdi-check</v-icon> confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { createChannel, editChannel } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
import { uploadFileToS3 } from "@/mixins/Extras/uploadFileToS3.js";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { GetAllCategories } from "@/mixins/GetAllCategories.js";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  props: {
    dialogCreateStation: Boolean,
    StoreObj: Object,
  },

  components: {
    Snackbar,
    Cropper,
  },
  mixins: [GetAllCategories, uploadFileToS3],

  data: () => ({
    channelImageInput: null,
    croppedImageInput: {},
    croppedImg: "",
    currentLocation: "",
    currentPlace: "",
    username: "",
    loading: false,
    loading1: false,
    Toggle: 0,
    Attachments: [],
    create_station: {
      channel_name: "",
      channel_description: "",
      channel_stream_url: "",
      location_lat: "",
      location_long: "",
      channel_category: "",
      channel_image_url: "",
    },
    rules: [(v) => !!v || "Required."],
    SnackBarComponent: {},
    markers: [
      {
        position: { lat: 11.1271, lng: 78.6569 },
      },
    ],
    center: { lat: 11.1271, lng: 78.6569 },
    search: "",
  }),
  mounted() {
    this.GetAllCategoriesMethod();
    if (this.StoreObj.action == "CREATE") {
      this.GetCurrentLocation();
    } else {
      this.create_station.channel_name = this.StoreObj.channel_name;
      this.create_station.channel_description =
        this.StoreObj.channel_description;
      this.create_station.channel_stream_url = this.StoreObj.channel_stream_url;
      this.create_station.channel_lat = parseFloat(this.StoreObj.channel_lat);
      this.create_station.channel_long = parseFloat(this.StoreObj.channel_long);
      this.create_station.channel_category = this.StoreObj.channel_category;
      this.create_station.channel_image_url = this.StoreObj.channel_image_url;
      this.center.lat = this.create_station.channel_lat;
      this.center.lng = this.create_station.channel_long;
      this.markers.push({
        position: {
          lat: this.create_station.channel_lat,
          lng: this.create_station.channel_long,
        },
      });
      this.updateCoordinates();
    }
  },
  methods: {
    maxCharLimit(e) {
      if (this.create_station.channel_name.length >= 25 && e.keyCode !== 8) {
        e.preventDefault();
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            renderComp: true,
            SnackbarText: "Station Name restricted to 25 characters.",
          };
        });
      }
    },
    onChangeEvent(e) {
      console.log("File Uploaded", e);
      const imageUrl = URL.createObjectURL(e);
      console.log("File Object", imageUrl);
      this.create_station.channel_image_url = imageUrl;
      console.log("Image URL", this.create_station.channel_image_url);
      console.log("Image URL again", imageUrl);
      const url = new URL(imageUrl);
      console.log(url);
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
          type: "image/jpeg",
        }),
      ];
      console.log("files", files);
      this.croppedImageInput = files;
      let new_image_url = context.canvas.toDataURL("image/*");
      this.croppedImg = new_image_url;
      console.log(
        "create station channel img url",
        this.create_station.channel_image_url
      );
      console.log("Cropped image URL", this.croppedImg);
      console.log("Base 64 url:", new_image_url);
    },
    handleFileUpload() {
      this.loading1 = true;
      console.log("check file");
      this.uploadImageToS3Method(this.channelImageInput)
        .then((url) => {
          console.log("S3 URL", url);
          this.create_station.channel_image_url = url.file_url;
          console.log("URL", url);

          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              renderComp: true,
              SnackbarText: "Image Uploaded Successfully.",
            };
          });
          this.loading1 = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading1 = false;

          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
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
      this.create_station.channel_image_url = "";
      this.channelImageInput = null;
      this.$nextTick(() => {
        this.SnackBarComponent = {
          renderComp: true,
          SnackbarVmodel: true,
          SnackbarColor: "green",
          Top: true,
          timeout: 500,
          SnackbarText: "Image Removed Successfully.",
        };
      });
    },
    async GetCurrentLocation() {
      var self = this;
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log("Check Latitude", pos.coords.latitude);
        console.log("Check Longitude", pos.coords.longitude);
        self.create_station.channel_lat = parseFloat(pos.coords.latitude);
        self.create_station.channel_long = parseFloat(pos.coords.longitude);
        self.center.lat = pos.coords.latitude;
        self.center.lng = pos.coords.longitude;
        self.markers = [];
        console.log("Latitude", pos.coords.latitude);
        console.log("Longitude", pos.coords.longitude);
        self.markers.push({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
        console.log("Place", pos);
        self.circle = [];
        self.circle.push({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      });
    },
    async updateCoordinates() {
      this.create_station.location_lat = this.center.lat;
      this.create_station.location_long = this.center.lng;
      console.log("center", this.center);
      console.log("Latitude", this.center.lat);
      console.log("Longitude", this.center.lng);
      this.getAddress();
      console.log("My current location is:", this.currentLocation);
    },
    async setPlace(place) {
      this.currentPlace = place;
      console.log("Check The Place", place);
      this.currentLocation = place.formatted_address;
      console.log("Location:", this.currentLocation);
      var self = this;
      this.center.lat = this.currentPlace.geometry.location.lat();
      this.center.lng = this.currentPlace.geometry.location.lng();
      this.marker = null;
      this.create_station.channel_lat =
        this.currentPlace.geometry.location.lat();
      this.create_station.channel_long =
        self.currentPlace.geometry.location.lng();
      this.markers.push({
        position: {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        },
      });
    },
    getAddress() {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(
        parseFloat(this.center.lat),
        parseFloat(this.center.lng)
      );

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          this.currentLocation = results[0].formatted_address;
        } else {
          this.currentLocation = "Address not found";
          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "error",
              Top: true,
              SnackbarText: "Address not Found.",
            };
          });
        }
      });
    },
    validateFormMethod() {
      if (this.$refs.form.validate()) {
        this.createChannelMethod();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with * are mandatory.",
          };
        });
      }
    },
    async createChannelMethod() {
      var inputParams = {
        channel_api_key:
          this.StoreObj.action == "EDIT"
            ? this.StoreObj.channel_api_key
            : undefined,
        user_email_id:
          this.StoreObj.action == "EDIT"
            ? undefined
            : this.$store.getters.get_user_email,
        channel_name: this.create_station.channel_name,
        channel_description: this.create_station.channel_description,
        channel_stream_url: this.create_station.channel_stream_url,
        channel_lat: this.create_station.channel_lat,
        channel_long: this.create_station.channel_long,
        channel_category: this.create_station.channel_category,
        channel_image_url: this.create_station.channel_image_url,
      };

      try {
        this.loading = true;
        let result = await API.graphql(
          graphqlOperation(
            this.StoreObj.action == "EDIT" ? editChannel : createChannel,
            {
              input: inputParams,
            }
          )
        );
        this.StoreObj.action == "ACTION";
        var ResultObject = JSON.parse(
          result.data[
            this.StoreObj.action == "EDIT" ? "EditChannel" : "CreateChannel"
          ]
        );
        if (ResultObject.status == "success") {
          this.dialogCreateStationEmit((this.Toggle = 2));
        }
        this.loading = false;
      } catch (error) {
        console.log("List BMS User:", error);
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            timeout: 1000,
            SnackbarText: error.errors[0].message,
          };
        });
        setTimeout(() => {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              renderComp: true,
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              SnackbarText: "Please Enter Channel Location to continue.",
            };
          });
        }, 2000);
        this.loading = false;
      }
    },
    dialogCreateStationEmit(Toggle) {
      if (this.$refs.form != undefined) {
        console.log("Image URL", this.create_station.channel_image_url);
      } else {
        this.$refs.form.reset();
      }
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style></style>

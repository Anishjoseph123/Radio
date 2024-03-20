<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <PublishAdvertisementDialog
      v-if="dialogPublishAdvertisement == true"
      :StoreObj="StoreObj"
      :dialogPublishAdvertisement="dialogPublishAdvertisement"
      @clicked="dialogPublishAdvertisementEmit"
    />
    <RePublishAdvertisementDialog
      :dialogRePublishAdvertisement="dialogRePublishAdvertisement"
      @clicked="dialogRePublishAdvertisementEmit"
      :StoreObj="StoreObj"
      :addObject="addObject"
    />
    <v-card class="elevation-0">
      <v-row no-gutters>
        <v-col cols="12" xs="12" sm="12" md="12">
          <v-toolbar dense class="elevation-0">
            <div
              :class="$vuetify.breakpoint.xs ? 'caption' : 'subtitle-2'"
              class="channel_name"
            >
              {{ StoreObj.channel_name }}
            </div>
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  icon
                  color="primary"
                  small
                  v-show="!$vuetify.breakpoint.xs"
                  class="mx-2 mt-1"
                  @click="refreshPage()"
                  ><v-icon>mdi-refresh</v-icon></v-btn
                >
              </template>
              <span class="white--text">Refresh</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip bottom color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  :class="$vuetify.breakpoint.xs ? 'ml-4' : 'borderRadius mr-2'"
                  color="#474747"
                  dark
                  @click="
                    (dialogPublishAdvertisement = true),
                      (StoreObj.action = 'PUBLISH')
                  "
                >
                  <v-icon small class="mr-1 mb-1">mdi-publish</v-icon>
                  Publish Ad
                </v-btn>
              </template>
              <span>Publish Advertisement</span>
            </v-tooltip>
            <v-tooltip color="secondary" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  small
                  color="#474747"
                  dark
                  id="back_btn"
                  @click="viewAddsInsideStationCardEmit(1)"
                >
                  <v-icon small class="mr-1">mdi-arrow-left-bold</v-icon>
                  Back
                </v-btn>
              </template>
              <span>Back to Stations</span>
            </v-tooltip>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-card-text>
        <v-data-table
          dense
          class="elevation-0"
          :fixed-header="true"
          :search="search"
          :headers="GetAllMessagesHeader"
          :items="GetAllAddsOfStationList"
          :no-data-text="noDataText"
          :hide-default-footer="GetAllAddsOfStationList.length == 0"
          :footer-props="{
            'items-per-page-options': [100, 200, 300, 400, 500],
          }"
          :items-per-page="100"
        >
          <template v-slot:[`item.message`]="{ item }">
            <v-img
              max-width="100px"
              :src="item.channel_message.description[0].section_image_url"
            ></v-img>
          </template>
          <template v-slot:[`item.published_on`]="{ item }">
            <div class="fontSizeVariant2">
              {{ new Date(item.published_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.Action`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="green"
                  @click="checkItem(item, 'VIEW')"
                  ><v-icon small>mdi-eye</v-icon></v-btn
                >
              </template>
              <span>View {{ item.channel_name }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import PublishAdvertisementDialog from "@/components/Stations/Dialogs/PublishAdvertisementDialog.vue";
import RePublishAdvertisementDialog from "@/components/Stations/Dialogs/RePublishAdvertisementDialog.vue";
import Overlay from "@/components/Extras/Overlay.vue";
import Snackbar from "@/components/Extras/Snackbar.vue";
import { GetAllAddsOfStation } from "@/mixins/GetAllAddsOfStation.js";
import { decodeMessage } from "@/mixins/Extras/decodeMessage.js";
export default {
  props: {
    StoreObj: Object,
  },
  components: {
    PublishAdvertisementDialog,
    RePublishAdvertisementDialog,
    Overlay,
    Snackbar,
  },
  mixins: [GetAllAddsOfStation, decodeMessage],
  data: () => ({
    search: "",
    noDataText: "",
    height: 0,
    overlay: false,
    dialogPublishAdvertisement: false,
    dialogRePublishAdvertisement: false,
    SnackBarComponent: {},
    addObject: {},

    GetAllMessagesHeader: [
      {
        text: "Message",
        value: "message",
        sortable: false,
      },
      {
        text: "Published On",
        value: "published_on",
        sortable: false,
      },
      {
        text: "Action",
        value: "Action",
        sortable: false,
      },
    ],
  }),
  mounted() {
    this.GetAllAddsOfStationMethod();
    this.height = window.innerHeight - 220;
  },
  methods: {
    dialogRePublishAdvertisementEmit(Toggle) {
      this.dialogRePublishAdvertisement = false;
      if (Toggle == 2) {
        this.GetAllAddsOfStationMethod();
      }
    },
    refreshPage() {
      this.GetAllAddsOfStationMethod();
    },
    checkItem(addObject) {
      this.addObject = addObject;
      this.dialogRePublishAdvertisement = true;
    },
    dialogPublishAdvertisementEmit(Toggle) {
      this.dialogPublishAdvertisement = false;
      if (Toggle == 2) {
        this.GetAllAddsOfStationMethod();
      }
    },
    viewAddsInsideStationCardEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

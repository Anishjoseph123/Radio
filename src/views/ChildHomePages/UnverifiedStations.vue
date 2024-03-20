<template>
  <div>
    <PlayAudioDialog
      :playAudioDialog="playAudioDialog"
      :StoreObj="StoreObj"
      @clicked="AudioPlayAndPauseEmit"
    />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <Overlay :overlay="overlay" />

    <ApproveRejectStationDialog
      :dialogApproveRejectStation="dialogApproveRejectStation"
      :StoreObject="StoreObject"
      @clicked="dialogApproveRejectStationEmit"
    />

    <v-card class="elevation-0">
      <v-toolbar class="elevation-0">
        <div
          :class="
            $vuetify.breakpoint.xs ? 'font-weight-bold' : 'text-uppercase '
          "
          class="heading subtitle-2"
        >
          Unverified Stations
        </div>
        <v-badge
          color="error"
          overlap
          class="mb-8 ml-2"
          :content="GetUnverifiedStationsList.length"
          v-show="
            $vuetify.breakpoint.name !== 'xs' &&
            GetUnverifiedStationsList.length > 0
          "
        ></v-badge>
        <v-tooltip bottom color="#474747">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="refreshPage()"
              color="primary"
              small
              v-show="!$vuetify.breakpoint.xs"
              class="mx-2 mt-1"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
          </template>
          <span class="white--text">Refresh</span>
        </v-tooltip>
        <v-spacer />
        <v-col cols="12" lg="2" md="2" xl="2" sm="12" xs="12">
          <v-text-field
            label="Search Stations"
            v-model="search"
            outlined
            dense
            :class="
              $vuetify.breakpoint.xs
                ? 'field_label_size field_height fontSizeVariant1'
                : 'mt-9 mr-2 field_height field_label_size fontSizeVariant1'
            "
            class="searchstations2"
          >
            <template v-slot:prepend-inner>
              <v-icon small color="success"> mdi-magnify </v-icon>
            </template>
            <template v-slot:append v-if="search !== ''">
              <v-icon small color="primary" @click="search = ''"
                >mdi-close-circle</v-icon
              >
            </template>
          </v-text-field></v-col
        >
      </v-toolbar>
      <v-card-text :class="$vuetify.breakpoint.xs ? 'mt-3' : 'py-0'">
        <v-data-table
          dense
          class="elevation-0"
          :fixed-header="true"
          :search="search"
          :no-data-text="noDataText"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :disable-sort="$vuetify.breakpoint.xs ? true : false"
          :headers="unverifiedStationsHeaders"
          :items="GetUnverifiedStationsList"
          :hide-default-footer="GetUnverifiedStationsList.length == 0"
          :footer-props="{
            'items-per-page-options': [100, 200, 300, 400, 500],
          }"
          :items-per-page="100"
          :height="height"
        >
          <template v-slot:no-results>
            <v-alert :value="true" class="subtitle-2 text-capitalize red--text">
              No records found!
              <v-icon color="#474747" dark>mdi-emoticon-sad-outline</v-icon>
            </v-alert>
          </template>
          <template v-slot:[`item.channel_name`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.channel_name }}
            </div></template
          >
          <template v-slot:[`item.sl_no`]="{ item }">
            <span>{{ GetUnverifiedStationsList.indexOf(item) + 1 }}</span>
          </template>
          <template v-slot:[`item.channel_location`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.channel_location }}
            </div>
          </template>
          <template v-slot:[`item.channel_created_on`]="{ item }">
            <div class="fontSizeVariant2">
              {{ new Date(item.channel_created_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.channel_status`]="{ item }">
            <div
              class="fontSizeVariant2 font-weight-bold"
              :class="
                item.channel_status == 'ACTIVE' ? 'green--text' : 'red--text'
              "
            >
              {{ item.channel_status }}
            </div>
          </template>
          <template v-slot:[`item.channel_stream_url`]="{ item }">
            <v-tooltip color="#474747" bottom>
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-on="on"
                  v-bind="attrs"
                  :href="item.channel_stream_url"
                  class="fontSizeVariant2 primary--text text-decoration-none"
                  target="_blank"
                  >{{ item.channel_stream_url }}</a
                >
              </template>
              <span>Click to stream the channel</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on }">
                <v-btn icon color="#474747" v-on="on" @click="playAudio(item)">
                  <v-icon small>mdi-play</v-icon>
                </v-btn>
              </template>
              <span class="white--text">Stream {{ item.channel_name }}</span>
            </v-tooltip>

            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="success"
                  v-on="on"
                  @click="checkItem(item, 'ACTION')"
                  icon
                >
                  <v-icon small>mdi-check-decagram</v-icon>
                </v-btn>
              </template>
              <span class="white--text">Verify {{ item.channel_name }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PlayAudioDialog from "@/components/UnverifiedStations/Dialogs/PlayAudioDialog.vue";
import Snackbar from "@/components/Extras/Snackbar.vue";
import Overlay from "@/components/Extras/Overlay.vue";
import { GetUnverifiedStations } from "@/mixins/GetUnverifiedStations.js";
import ApproveRejectStationDialog from "@/components/UnverifiedStations/Dialogs/ApproveRejectStationDialog.vue";

export default {
  components: {
    Snackbar,
    Overlay,
    ApproveRejectStationDialog,
    PlayAudioDialog,
  },
  data: () => ({
    playAudioDialog: false,
    dialogApproveRejectStation: false,

    StoreObject: {},
    overlay: false,
    sortDesc: true,
    SnackBarComponent: {},
    search: "",
    height: 0,
    StoreObj: {},
    unverifiedStationsHeaders: [
      //{ text: "SL NO.", value: "sl_no" },
      { text: "Station Name", value: "channel_name" },
      { text: "Station Location", value: "channel_location" },
      {
        text: "Station Created On",
        value: "channel_created_on",
      },
      {
        text: "Station Stream URL",
        value: "channel_stream_url",
      },
      { text: "Station Status", value: "channel_status" },
      { text: "Actions", value: "Actions" },
    ],
    sortBy: "channel_created_on",
  }),
  mixins: [GetUnverifiedStations],
  mounted() {
    this.height = window.innerHeight - 220;
    this.GetUnverifiedStationsMethod();
  },

  methods: {
    playAudio(items) {
      this.playAudioDialog = true;
      this.StoreObj = items;
      console.log("Station details", items);
    },
    refreshPage() {
      this.GetUnverifiedStationsMethod();
    },

    checkItem(item, action) {
      this.StoreObject = item;
      this.StoreObject.action = action;
      switch (action) {
        case "ACTION":
          this.dialogApproveRejectStation = true;
          break;
      }
    },
    dialogApproveRejectStationEmit(Toggle) {
      this.dialogApproveRejectStation = false;
      if (Toggle == 2) {
        this.GetUnverifiedStationsMethod();
      }
    },
    AudioPlayAndPauseEmit() {
      this.playAudioDialog = false;
    },
  },
};
</script>
<style scoped>
a:hover {
  color: blue !important;
  font-weight: bold;
}
@media screen and (max-width: 768px) {
  .searchstations2 {
    top: 45px;
    right: 120px;
  }
}
</style>

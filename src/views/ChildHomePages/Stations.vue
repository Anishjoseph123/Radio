<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <CreateStationDialog
      v-if="dialogCreateStation == true"
      :StoreObj="StoreObj"
      :dialogCreateStation="dialogCreateStation"
      @clicked="dialogCreateStationEmit"
    />
    <ActivateInactivateChannelDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateChannel="dialogActivateInactivateChannel"
      @clicked="dialogActivateInactivateChannelEmit"
    />
    <DeleteChannelDialog
      :StoreObj="StoreObj"
      :dialogDeleteChannel="dialogDeleteChannel"
      @clicked="dialogDeleteChannelEmit"
    />
    <PublishStationCatalogDialog
      :StoreObj="StoreObj"
      :dialogPublishStationCatalog="dialogPublishStationCatalog"
      @clicked="dialogPublishStationCatalogEmit"
      :GetAllStationsList="GetAllStationsList"
    />
    <PublishAdvertisementDialog
      v-if="dialogPublishAdvertisement == true"
      :StoreObj="StoreObj"
      :dialogPublishAdvertisement="dialogPublishAdvertisement"
      @clicked="dialogPublishAdvertisementEmit"
    />

    <v-card class="elevation-0" v-if="current_view == 'LIST'">
      <v-toolbar class="elevation-0">
        <div
          :class="
            $vuetify.breakpoint.xs ? 'font-weight-bold' : 'text-uppercase '
          "
          class="heading subtitle-2"
        >
          Stations
        </div>
        <v-badge
          color="success"
          overlap
          class="mb-8 ml-3"
          :content="GetAllStationsList.length"
          v-show="
            GetAllStationsList.length > 0 && $vuetify.breakpoint.name !== 'xs'
          "
        ></v-badge>
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
        <v-col cols="12" lg="2" md="2" xl="2" sm="12" xs="12">
          <v-text-field
            label="Search Stations"
            v-model="search"
            dense
            outlined
            :class="
              $vuetify.breakpoint.xs
                ? 'field_label_size field_height fontSizeVariant1'
                : 'mt-9 mr-2 field_height field_label_size fontSizeVariant1 elevation-0'
            "
            class="search"
          >
            <template v-slot:prepend-inner>
              <v-icon small color="success" class="mt-1"> mdi-magnify </v-icon>
            </template>
            <template v-slot:append v-if="search !== ''">
              <v-icon small color="primary" @click="search = ''"
                >mdi-close-circle</v-icon
              >
            </template>
          </v-text-field>
        </v-col>
        <v-tooltip bottom color="#474747">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :disabled="GetAllStationsList.length == 0"
              small
              class="borderRadius mt-2 mr-2 publishcat"
              color="#474747"
              dark
              depressed
              v-on="on"
              v-bind="attrs"
              @click="
                (dialogPublishStationCatalog = true),
                  (StoreObj.action = 'PUBLISH')
              "
            >
              <v-icon small class="mr-1">mdi-publish</v-icon>
              Publish Catalog
            </v-btn>
          </template>
          <span>Publish Catalog</span>
        </v-tooltip>

        <v-tooltip bottom color="#474747">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              color="#474747"
              dark
              v-on="on"
              v-bind="attrs"
              @click="
                (dialogCreateStation = true), (StoreObj.action = 'CREATE')
              "
              class="borderRadius mt-2 creating"
              ><v-icon small class="mr-1">mdi-plus</v-icon>Create</v-btn
            >
          </template>
          <span>Create Station</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text :class="$vuetify.breakpoint.xs ? 'mt-3' : 'py-0'">
        <v-data-table
          dense
          class="elevation-0"
          :fixed-header="true"
          :search="search"
          :headers="GetAllStationHeaders"
          :items="GetAllStationsList"
          :no-data-text="noDataText"
          :disable-sort="$vuetify.breakpoint.xs ? true : false"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :hide-default-footer="GetAllStationsList.length == 0"
          :footer-props="{
            'items-per-page-options': [100, 200, 300, 400, 500],
          }"
          :items-per-page="100"
          :height="height"
        >
          <!-- @click:row="checkRowItem" -->
          <template v-slot:no-results>
            <v-alert
              :value="true"
              width="100%"
              class="subtitle-2 text-capitalize red--text"
            >
              No records found!
              <v-icon color="#474747" dark>mdi-emoticon-sad-outline</v-icon>
            </v-alert>
          </template>
          <template v-slot:[`item.channel_name`]="{ item }">
            <div
              :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
              class="fontSizeVariant1 font-weight-bold"
            >
              {{ item.channel_name }}
            </div>
            <div class="fontSizeVariant1">
              {{ item.channel_description }}
            </div>
          </template>
          <template v-slot:[`item.channel_category`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.channel_category }}
            </div>
          </template>
          <template v-slot:[`item.channel_image_url`]="{ item }">
            <div class="fontSizeVariant1">
              <v-img
                :src="item.channel_image_url"
                alt="img"
                width="100"
                style="
                  position: relative;
                  height: fit-content;
                  object-fit: cover;
                "
              ></v-img>
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
          <template v-slot:[`item.channel_created_on`]="{ item }">
            <div class="fontSizeVariant2">
              {{ new Date(item.channel_created_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.last_published_on`]="{ item }">
            <div class="fontSizeVariant2">
              {{ new Date(item.last_published_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.channel_created_by`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.channel_created_by }}
            </div>
          </template>
          <template v-slot:[`item.sl_no`]="{ item }">
            <span>{{ GetAllStationsList.indexOf(item) + 1 }}</span>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  color="success"
                  @click.stop="checkItem(item, 'EDIT')"
                  ><v-icon small>mdi-pencil</v-icon></v-btn
                >
              </template>
              <span>Edit {{ item.channel_name }}</span>
            </v-tooltip>
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  @click="dialogActivateInactivateChannel = true"
                >
                  <v-icon
                    small
                    :color="
                      item.channel_status == 'ACTIVE' ? 'error' : 'success'
                    "
                    >{{
                      item.channel_status == "ACTIVE"
                        ? "mdi-close"
                        : "mdi-check"
                    }}</v-icon
                  >
                </v-btn>
              </template>
              <span
                >{{
                  item.channel_status == "ACTIVE" ? "Deactivate" : "Activate"
                }}
                {{ item.channel_name }}</span
              >
            </v-tooltip>
            <!-- <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="item.channel_status == 'ACTIVE'"
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="success"
                  @click.stop="checkItem(item, 'ADVERTISEMENT')"
                  ><v-icon small>mdi-publish</v-icon></v-btn
                >
              </template>
              <span
                v-text="`Publish Advertisement for ${item.channel_name}`"
              ></span>
            </v-tooltip> -->
            <v-tooltip bottom color="#474747">
              <!-- v-if="item.channel_status !== 'ACTIVE'" -->
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  dark
                  color="error"
                  @click.stop="checkItem(item, 'DELETE')"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
              </template>
              <span>Delete {{ item.channel_name }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <ViewAddsInsideStationCard
      v-if="current_view == 'INSIDE_STATION'"
      :StoreObj="StoreObj"
      @clicked="viewAddsInsideStationCardEmit"
    />
  </div>
</template>
<script>
import Overlay from "@/components/Extras/Overlay.vue";
import Snackbar from "@/components/Extras/Snackbar.vue";
import CreateStationDialog from "@/components/Stations/Dialogs/CreateStationDialog.vue";
import PublishStationCatalogDialog from "@/components/Stations/Dialogs/PublishStationCatalogDialog.vue";
import PublishAdvertisementDialog from "@/components/Stations/Dialogs/PublishAdvertisementDialog.vue";
import ActivateInactivateChannelDialog from "@/components/Stations/Dialogs/ActivateInactivateChannelDialog.vue";
import DeleteChannelDialog from "@/components/Stations/Dialogs/DeleteChannelDialog.vue";
import ViewAddsInsideStationCard from "@/components/Stations/Cards/ViewAddsInsideStationCard.vue";
import { GetAllStations } from "@/mixins/GetAllStations.js";

export default {
  components: {
    Overlay,
    Snackbar,
    CreateStationDialog,
    ActivateInactivateChannelDialog,
    DeleteChannelDialog,
    PublishStationCatalogDialog,
    PublishAdvertisementDialog,
    ViewAddsInsideStationCard,
  },
  data: () => ({
    sortDesc: true,
    overlay: false,
    SnackBarComponent: {},
    search: "",
    current_view: "LIST",
    height: 0,
    dialogDeleteChannel: false,
    dialogCreateStation: false,
    dialogPublishStationCatalog: false,
    dialogPublishAdvertisement: false,
    dialogActivateInactivateChannel: false,
    GetAllStationHeaders: [
      //{ text: "SL NO.", value: "sl_no" },
      { text: "Station Name", value: "channel_name" },
      { text: "Station Category", value: "channel_category" },
      { text: "Station Created By", value: "channel_created_by" },
      { text: "Station Created On", value: "channel_created_on" },
      {
        text: "Station Status",
        value: "channel_status",
      },
      { text: "Station Published On", value: "last_published_on" },
      // { text: "Station Image", value: "channel_image_url" },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},

    sortBy: "channel_created_on",
  }),
  mixins: [GetAllStations],
  mounted() {
    this.height = window.innerHeight - 220;
    this.GetAllStationsMethod();
  },
  methods: {
    viewAddsInsideStationCardEmit(Toggle) {
      if (Toggle == 1) {
        this.current_view = "LIST";
      }
    },
    checkRowItem(item) {
      this.StoreObj = item;
      this.current_view = "INSIDE_STATION";
    },
    dialogPublishAdvertisementEmit(Toggle) {
      this.dialogPublishAdvertisement = false;
      if (Toggle == 2) {
        this.GetAllStationsMethod();
      }
    },
    dialogPublishStationCatalogEmit() {
      this.dialogPublishStationCatalog = false;
    },
    refreshPage() {
      this.GetAllStationsMethod();
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      switch (action) {
        case "EDIT":
          this.dialogCreateStation = true;
          break;
        case "ACTION":
          this.dialogActivateInactivateChannel = true;
          break;
        case "DELETE":
          this.dialogDeleteChannel = true;
          break;
        case "ADVERTISEMENT":
          this.dialogPublishAdvertisement = true;
          break;
      }
    },

    dialogCreateStationEmit(Toggle) {
      this.dialogCreateStation = false;
      if (Toggle == 2) {
        this.GetAllStationsMethod();
      }
    },
    dialogDeleteChannelEmit(Toggle) {
      this.dialogDeleteChannel = false;
      if (Toggle == 2) {
        this.GetAllStationsMethod();
      }
    },
    dialogActivateInactivateChannelEmit(Toggle) {
      this.dialogActivateInactivateChannel = false;
      if (Toggle == 2) {
        this.GetAllStationsMethod();
      }
    },
  },
};
</script>

<style>
.v-data-table-header th {
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .publishcat {
    bottom: 8px;
    right: 305px;
  }
  .creating {
    bottom: 8px;
    right: 310px;
  }

  .search {
    top: 55px;
    right: 50px;
  }
}
</style>

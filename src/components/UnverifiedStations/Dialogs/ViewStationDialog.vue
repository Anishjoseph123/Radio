<template>
  <div>
    <v-dialog
      persistent
      :max-width="$vuetify.breakpoint.xs ? 'auto' : '600px'"
      v-model="dialogViewStation"
      :hide-overlay="false"
      :retain-focus="true"
      transition="dialog-top-transition"
      style="overflow: hidden"
    >
      <v-card height="auto" width="auto">
        <v-toolbar dark color="#474747" dense class="elevation-0">
          <v-icon small class="mr-1"> mdi-information-outline</v-icon>
          <div class="font-weight-bold">Channel Info</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogViewStationEmit((Toggle = 1))"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-row dense align="center" justify="center">
            <v-col cols="12" lg="12" md="12" sm="12" xl="12" xs="12">
              <v-card
                height="auto"
                width="100%"
                outlined
                rounded="xl"
                class="mt-2 responses"
              >
                <v-row dense class="pa-6">
                  <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                    <div class="subtitle-2">Channel ID:</div>
                    <span class="caption"> {{ StoreObject.channel_id }}</span>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <div class="subtitle-2">Channel Name:</div>
                    <span class="caption"> {{ StoreObject.channel_name }}</span>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                    <div class="subtitle-2">Channel Created On:</div>
                    <span class="caption">
                      {{
                        new Date(
                          StoreObject.channel_created_on
                        ).toLocaleString()
                      }}</span
                    >
                  </v-col>

                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <div class="subtitle-2">Channel Location:</div>
                    <span class="caption">
                      {{ StoreObject.channel_location }}</span
                    >
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
                    <div class="subtitle-2">Channel Status:</div>
                    <span
                      :class="
                        StoreObject.channel_status == 'ACTIVE'
                          ? 'green--text caption font-weight-bold'
                          : 'red--text'
                      "
                      >{{ StoreObject.channel_status }}</span
                    >
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
                    <div class="subtitle-2">Channel Stream URL:</div>
                    <a
                      :href="StoreObject.channel_stream_url"
                      target="_blank"
                      style="text-decoration: none; color: lightseagreen"
                    >
                      {{ StoreObject.channel_stream_url }}</a
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GetUnverifiedStations } from "@/mixins/GetUnverifiedStations.js";
export default {
  props: {
    dialogViewStation: Boolean,
    StoreObject: Object,
  },
  data: () => ({}),
  mixins: [GetUnverifiedStations],
  mounted() {
    this.GetUnverifiedStationsMethod();
  },
  methods: {
    dialogViewStationEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>

<style></style>

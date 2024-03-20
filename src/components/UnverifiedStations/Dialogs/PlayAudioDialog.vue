<template>
  <v-dialog
    persistent
    :hide-overlay="false"
    :retain-focus="true"
    transition="dialog-top-transition"
    :max-width="$vuetify.breakpoint.xs ? 'auto' : '400px'"
    v-model="playAudioDialog"
  >
    <v-card flat>
      <v-toolbar dark color="#474747" dense class="elevation-0">
        <div class="font-weight-bold">
          <v-icon small class="mr-2" dark>mdi-music</v-icon>Streaming
          {{ StoreObj.channel_name }}
        </div>
        <v-spacer></v-spacer>
        <v-btn @click="AudioPlayAndPauseEmit()" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <audio
          style="border-radius: 20px"
          :class="$vuetify.breakpoint.xs ? ' mt-4 ml-n4' : 'mt-4 mx-8'"
          :src="StoreObj.channel_stream_url"
          controls
          autoplay
        ></audio>
        <!-- <video
          src="../../../assets/Arabic Kuthu - Beast_HD-(Hd9video).mp4"
          controls
          muted
          height="300"
          width="350"
        ></video> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    playAudioDialog: Boolean,
    StoreObj: Object,
  },

  data: () => ({}),

  methods: {
    AudioPlayAndPauseEmit() {
      this.$emit("clicked");
    },
  },
};
</script>

<style></style>

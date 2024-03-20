<template>
  <v-snackbar
    :value="SnackBarComponent.SnackbarVmodel"
    :color="SnackBarComponent.SnackbarColor"
    :top="SnackBarComponent.Top"
    :timeout="SnackBarComponent.timeout"
    v-model="SnackBarComponent.renderComp"
  >
    <div class="text-center">
      {{ SnackBarComponent.SnackbarText }}
    </div>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    SnackBarComponent: Object,
  },
};
</script>

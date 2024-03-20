<template>
  <v-app>
    <router-view />
  </v-app>
</template>
<style>
.fontSizeVariant1 {
  font-size: 12px !important;
}

.fontSizeVariant2 {
  font-size: 10px !important;
}

.field_height.v-text-field .v-input__control .v-input__slot {
  min-height: 12px !important;
  display: flex !important;
  align-items: center !important;
}
.field_label_size.v-input .v-label {
  font-size: 12px;
}

.v-select
  .v-input__control
  .v-input__slot
  .v-select__slot
  .v-select__selections {
  padding: 0 !important;
  min-height: 0 !important;
}

.v-select-list .v-list-item {
  min-height: 0 !important;
}
.loginBtn:hover {
  background: #98bc90 !important;
  color: black !important;
}
.forgotPwd:hover {
  color: darkred !important;
}

.v-select-list .v-list-item .v-list-item__content {
  padding: 14px 0 !important;
}
.checkboxx label:hover {
  color: black !important;
}
.checkboxx label {
  color: #222 !important;
}
@media screen and (max-width: 768px) {
  .fontSizeVariant33 {
    font-size: 12px !important;
  }
  #back_btn {
    margin-left: 7px;
  }
  .channel_name {
    white-space: nowrap;
    font-size: 9px !important;
    font-weight: 600 !important;
  }
  .forgotPwd {
    margin-left: 115px !important;
    bottom: 85px !important;
    font-size: 10px !important;
  }
  .loginBtn {
    bottom: 50px !important;
  }
  .checkboxx {
    height: auto !important;
    width: 100% !important;
  }
  .heading {
    white-space: nowrap;
    padding-bottom: 15px;
  }
}
</style>

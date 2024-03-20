<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <CreateUserDialog
      :StoreObj="StoreObj"
      :dialogCreateBMSUser="dialogCreateBMSUser"
      @clicked="createBMSUsersDialogEmit"
    />
    <ActivateInactivateUserDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateUser="dialogActivateInactivateUser"
      @clicked="dialogActivateInactivateUserEmit"
    />
    <DeleteUserDialog
      :StoreObj="StoreObj"
      :dialogDeleteUser="dialogDeleteUser"
      @clicked="dialogDeleteUserEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar class="elevation-0">
        <div
          class="heading subtitle-2"
          :class="
            $vuetify.breakpoint.xs ? 'font-weight-bold' : 'text-uppercase '
          "
        >
          BMS Users
        </div>
        <v-badge
          color="success"
          overlap
          icon="mdi-account"
          class="mb-8 ml-2"
          :content="GetAllBMSUserList.length"
          v-show="
            $vuetify.breakpoint.name !== 'xs' && GetAllBMSUserList.length > 0
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
        <v-spacer />
        <v-col cols="12" lg="2" md="2" xl="2" sm="6" xs="6">
          <v-text-field
            label="Search Users"
            v-model="search"
            dense
            outlined
            :class="
              $vuetify.breakpoint.xs
                ? 'field_label_size field_height fontSizeVariant1'
                : 'mt-8 field_height field_label_size fontSizeVariant1'
            "
            class="searchusers"
          >
            <template v-slot:prepend-inner>
              <v-icon small color="green"> mdi-magnify </v-icon>
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
              small
              dark
              v-on="on"
              v-bind="attrs"
              color="#474747"
              @click="
                (dialogCreateBMSUser = true), (StoreObj.action = 'CREATE')
              "
              class="borderRadius mt-2 createuser"
              ><v-icon small class="mr-1">mdi-plus</v-icon>Create</v-btn
            >
          </template>
          <span>Create BMS User</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text :class="$vuetify.breakpoint.xs ? 'pt-6' : 'py-0'">
        <v-data-table
          dense
          class="elevation-0"
          :fixed-header="true"
          :search="search"
          :disable-sort="$vuetify.breakpoint.xs ? true : false"
          :headers="GetAllBMSUserHeaders"
          :items="GetAllBMSUserList"
          sort-by="user_email_id"
          :no-data-text="noDataText"
          :hide-default-footer="GetAllBMSUserList.length == 0"
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
          <template v-slot:[`item.user_email_id`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.user_email_id }}
            </div>
          </template>
          <template v-slot:[`item.user_status`]="{ item }">
            <div
              class="fontSizeVariant2 font-weight-bold"
              :class="
                item.user_status == 'ACTIVE' ? 'green--text' : 'red--text'
              "
            >
              {{ item.user_status }}
            </div>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <!-- <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="!item.user_type"
                  v-on="on"
                  v-bind="attrs"
                  color="success"
                  icon
                  @click="checkItem(item, 'EDIT')"
                >
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit {{ item.user_email_id }}</span>
            </v-tooltip> -->
            <v-tooltip bottom color="#474747" v-if="!item.user_type">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.user_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                >
                  <v-icon small>{{
                    item.user_status == "ACTIVE" ? "mdi-close" : "mdi-check"
                  }}</v-icon>
                </v-btn>
              </template>
              <span
                v-if="$store.getters.get_user_email != item.user_email_id"
                v-text="
                  item.user_status == 'ACTIVE'
                    ? `Deactivate ${item.user_email_id}`
                    : `Activate ${item.user_email_id}`
                "
              ></span>
            </v-tooltip>

            <v-tooltip
              bottom
              v-if="item.user_status != 'ACTIVE'"
              color="#474747"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="red"
                  @click="checkItem(item, 'DELETE')"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
              </template>
              <span v-text="`Delete ${item.user_email_id}`"></span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Overlay from "@/components/Extras/Overlay.vue";
import Snackbar from "@/components/Extras/Snackbar.vue";
import CreateUserDialog from "@/components/BMSUsers/Dialogs/CreateUserDialog.vue";
import ActivateInactivateUserDialog from "@/components/BMSUsers/Dialogs/ActivateInactivateUserDialog.vue";
import DeleteUserDialog from "@/components/BMSUsers/Dialogs/DeleteUserDialog.vue";
import { GetAllBMSUsers } from "@/mixins/GetAllBMSUsers.js";

export default {
  components: {
    Overlay,
    CreateUserDialog,
    ActivateInactivateUserDialog,
    DeleteUserDialog,
    Snackbar,
  },
  data: () => ({
    isFlipped: false,

    rocketList: [],
    // swapList: [],
    SnackBarComponent: {},
    overlay: false,
    search: "",
    height: 0,
    dialogDeleteUser: false,
    dialogCreateBMSUser: false,
    dialogActivateInactivateUser: false,
    GetAllBMSUserHeaders: [
      { text: "User Email ID", value: "user_email_id" },
      {
        text: "User Status",
        value: "user_status",
      },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},
  }),
  mixins: [GetAllBMSUsers],
  mounted() {
    this.height = window.innerHeight - 220;
    this.GetAllBMSUsersMethod();
  },

  methods: {
    refreshPage() {
      this.GetAllBMSUsersMethod();
    },

    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      switch (action) {
        case "ACTION":
          this.dialogActivateInactivateUser = true;
          break;

        case "DELETE":
          this.dialogDeleteUser = true;
          break;
        case "EDIT":
          this.dialogCreateBMSUser = true;
      }
    },
    createBMSUsersDialogEmit(Toggle) {
      this.dialogCreateBMSUser = false;
      if (Toggle == 2) {
        this.GetAllBMSUsersMethod();
      }
    },
    dialogDeleteUserEmit(Toggle) {
      this.dialogDeleteUser = false;
      if (Toggle == 2) {
        this.GetAllBMSUsersMethod();
      }
    },
    dialogActivateInactivateUserEmit(Toggle) {
      this.dialogActivateInactivateUser = false;
      if (Toggle == 2) {
        this.GetAllBMSUsersMethod();
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
  .bmsusers {
    white-space: nowrap;
    padding-bottom: 15px;
  }

  .searchusers {
    top: 44px;
    right: 70px;
  }

  .createuser {
    right: 165px;
    bottom: 10px;
  }
}
</style>

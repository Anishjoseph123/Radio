<template>
  <div>
    <Overlay :overlay="overlay" />
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <CreateCategoryDialog
      :StoreObj="StoreObj"
      :dialogCreateCategory="dialogCreateCategory"
      @clicked="dialogCreateCategoryEmit"
    />
    <ActivateInactivateCategoryDialog
      :StoreObj="StoreObj"
      :dialogActivateInactivateCategory="dialogActivateInactivateCategory"
      @clicked="dialogActivateInactivateCategoryEmit"
    />
    <DeleteCategoryDialog
      :StoreObj="StoreObj"
      :dialogDeleteCategory="dialogDeleteCategory"
      @clicked="dialogDeleteCategoryEmit"
    />
    <v-card class="elevation-0">
      <v-toolbar class="elevation-0">
        <div
          :class="
            $vuetify.breakpoint.xs ? ' font-weight-bold' : 'text-uppercase '
          "
          class="heading subtitle-2"
        >
          Categories
        </div>
        <v-badge
          color="success"
          overlap
          class="mb-8 ml-2"
          :content="GetAllCategoriesList.length"
          v-if="
            $vuetify.breakpoint.name !== 'xs' && GetAllCategoriesList.length > 0
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
        <v-col cols="12" lg="2" md="2" sm="6" xl="2" xs="6">
          <v-text-field
            label="Search Categories"
            v-model="search"
            dense
            outlined
            :class="
              $vuetify.breakpoint.xs
                ? 'field_label_size field_height fontSizeVariant1'
                : 'mt-8 field_height field_label_size fontSizeVariant1'
            "
            class="searchcat"
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
              color="#474747"
              dark
              v-bind="attrs"
              v-on="on"
              @click="
                (dialogCreateCategory = true), (StoreObj.action = 'CREATE')
              "
              class="borderRadius mt-2 createcat"
              ><v-icon small class="mr-1">mdi-plus</v-icon>Create</v-btn
            >
          </template>
          <span>Create Category</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text :class="$vuetify.breakpoint.xs ? 'pt-6' : 'py-0'">
        <v-data-table
          dense
          class="elevation-0"
          :fixed-header="true"
          :search="search"
          :headers="GetAllCategoryHeaders"
          :items="GetAllCategoriesList"
          :no-data-text="noDataText"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :disable-sort="$vuetify.breakpoint.xs ? true : false"
          :hide-default-footer="GetAllCategoriesList.length == 0"
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
          <template v-slot:[`item.category_name`]="{ item }">
            <div class="fontSizeVariant1 font-weight-bold">
              {{ item.category_name }}
            </div>
          </template>
          <template v-slot:[`item.category_description`]="{ item }">
            <div class="fontSizeVariant1">
              {{ item.category_description }}
            </div>
          </template>
          <template v-slot:[`item.sl_no`]="{ item }">
            <span>{{ GetAllCategoriesList.indexOf(item) + 1 }}</span>
          </template>
          <template v-slot:[`item.category_status`]="{ item }">
            <div
              class="fontSizeVariant2 font-weight-bold"
              :class="
                item.category_status == 'ACTIVE' ? 'green--text' : 'red--text'
              "
            >
              {{ item.category_status }}
            </div>
          </template>
          <template v-slot:[`item.category_created_on`]="{ item }">
            <div class="fontSizeVariant2">
              {{ new Date(item.category_created_on).toLocaleString() }}
            </div>
          </template>
          <template v-slot:[`item.category_created_by`]="{ item }">
            <span class="fontSizeVariant1 font-weight-bold">{{
              item.category_created_by
            }}</span>
          </template>

          <template v-slot:[`item.Actions`]="{ item }">
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="green"
                  @click="checkItem(item, 'EDIT')"
                  ><v-icon small>mdi-pencil</v-icon></v-btn
                >
              </template>
              <span>Edit {{ item.category_name }}</span>
            </v-tooltip>
            <v-tooltip bottom color="#474747">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  :color="item.category_status == 'ACTIVE' ? 'red' : 'green'"
                  @click="checkItem(item, 'ACTION')"
                  ><v-icon small>{{
                    item.category_status == "ACTIVE" ? "mdi-close" : "mdi-check"
                  }}</v-icon></v-btn
                >
              </template>
              <span
                v-text="
                  item.category_status == 'ACTIVE'
                    ? `Deactivate ${item.category_name}`
                    : `Activate ${item.category_name}`
                "
              ></span>
            </v-tooltip>
            <v-tooltip bottom v-if="item.category_status == 'INACTIVE'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="red"
                  @click.stop="checkItem(item, 'DELETE')"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
              </template>
              <span>Delete {{ item.category_name }}</span>
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

import CreateCategoryDialog from "@/components/Categories/Dialogs/CreateCategoryDialog.vue";
import ActivateInactivateCategoryDialog from "@/components/Categories/Dialogs/ActivateInactivateCategoryDialog.vue";
import DeleteCategoryDialog from "@/components/Categories/Dialogs/DeleteCategoryDialog.vue";

import { GetAllCategories } from "@/mixins/GetAllCategories.js";

export default {
  components: {
    Overlay,
    Snackbar,
    CreateCategoryDialog,
    ActivateInactivateCategoryDialog,
    DeleteCategoryDialog,
  },
  data: () => ({
    sortDesc: true,
    overlay: false,
    SnackBarComponent: {},
    search: "",
    height: 0,
    dialogCreateCategory: false,
    dialogDeleteCategory: false,
    dialogActivateInactivateCategory: false,

    GetAllCategoryHeaders: [
      //{ text: "SL NO.", value: "sl_no" },
      { text: "Category Name", value: "category_name" },
      { text: "Category Description", value: "category_description" },
      { text: "Category Created by", value: "category_created_by" },
      { text: "Category Created On", value: "category_created_on" },
      {
        text: " Category Status",
        value: "category_status",
      },
      { text: "Actions", value: "Actions" },
    ],
    StoreObj: {},
    sortBy: "category_created_on",
  }),
  mixins: [GetAllCategories],
  mounted() {
    this.height = window.innerHeight - 220;
    this.GetAllCategoriesMethod();
  },

  methods: {
    refreshPage() {
      this.GetAllCategoriesMethod();
    },
    checkItem(item, action) {
      this.StoreObj = item;
      this.StoreObj.action = action;
      switch (action) {
        case "EDIT":
          this.dialogCreateCategory = true;
          break;
        case "ACTION":
          this.dialogActivateInactivateCategory = true;
          break;
        case "DELETE":
          this.dialogDeleteCategory = true;
          break;
      }
    },
    dialogCreateCategoryEmit(Toggle) {
      this.dialogCreateCategory = false;
      if (Toggle == 2) {
        this.GetAllCategoriesMethod();
      }
    },
    dialogDeleteCategoryEmit(Toggle) {
      this.dialogDeleteCategory = false;
      if (Toggle == 2) {
        this.GetAllCategoriesMethod();
      }
    },
    dialogActivateInactivateCategoryEmit(Toggle) {
      this.dialogActivateInactivateCategory = false;
      if (Toggle == 2) {
        this.GetAllCategoriesMethod();
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
  .searchcat {
    top: 45px;
    right: 80px;
  }
  .createcat {
    bottom: 10px;
    right: 165px;
  }
}
</style>

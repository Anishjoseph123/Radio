import { listChannels } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllStations = {
  data() {
    return {
      overlay: false,
      GetAllStationsList: [],
      noDataText: "",
    };
  },
  methods: {
    async GetAllStationsMethod() {
      this.GetAllStationsList = [];
      var inputParams = {
        user_email_id: this.$store.getters.get_user_email,
      };
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(listChannels, {
            input: inputParams,
          })
        );
        this.GetAllStationsList = JSON.parse(
          result.data.ListChannels
        ).data.items;
        console.log("Check GetAllStationsList", this.GetAllStationsList);
        this.overlay = false;
        if (
          this.StoreObj.action == "CREATE" ||
          this.StoreObj.action == "EDIT"
        ) {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "success",
              Top: true,
              renderComp: true,
              SnackbarText:
                this.StoreObj.action == "CREATE"
                  ? "Channel Created Successfully."
                  : "Channel Updated Successfully.",
            };
          });
        }
      } catch (error) {
        this.noDataText = error.errors[0].message;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
        });
        this.GetAllStationsList = [];
        this.overlay = false;
      }
    },
  },
};

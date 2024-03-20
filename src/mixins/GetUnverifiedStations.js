import { listAllApprovalChannels } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetUnverifiedStations = {
  data: () => ({
    GetUnverifiedStationsList: [],
    overlay: false,
    noDataText: "",
  }),
  methods: {
    async GetUnverifiedStationsMethod() {
      this.GetUnverifiedStationsList = [];
      var inputParams = {
        user_email_id: this.$store.getters.get_user_email,
      };
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(listAllApprovalChannels, {
            input: inputParams,
          })
        );
        this.GetUnverifiedStationsList = JSON.parse(
          result.data.ListAllApprovalChannels
        ).data.items;
        console.log(
          "Check unverified channels",
          this.GetUnverifiedStationsList
        );
        this.overlay = false;
      } catch (error) {
        console.log("Error", error);
        this.noDataText = error.errors[0].message;
        this.GetUnverifiedStationsList = [];
        this.overlay = false;
      }
    },
  },
};

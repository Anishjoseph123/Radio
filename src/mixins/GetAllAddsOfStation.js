import { listMessages } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllAddsOfStation = {
  data: () => ({
    GetAllAddsOfStationList: [],
    noDataText: "",
  }),
  mounted() {},
  methods: {
    async GetAllAddsOfStationMethod() {
      this.GetAllAddsOfStationList = [];
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(listMessages, {
            input: {
              user_id: "92d1bfa5-bb26-4f49-a7e3-cb1c7211a163",
              channel_id: this.StoreObj.channel_id,
            },
          })
        );
        this.GetAllAddsOfStationList = JSON.parse(
          result.data.ListMessages
        ).data.items.map((obj) => {
          let addObject = obj;
          addObject.channel_message = this.decodeMessageMethod(
            addObject.channel_message
          );
          addObject.channel_message.description = JSON.parse(
            addObject.channel_message.description
          );
          return addObject;
        });
        console.log("GetAllAddsOfStationList", this.GetAllAddsOfStationList);
        this.overlay = false;
      } catch (error) {
        console.log("Error", error);
        this.overlay = false;
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
        console.log(error);
      }
    },
  },
};

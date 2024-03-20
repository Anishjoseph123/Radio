import { listUsers } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllBMSUsers = {
  data() {
    return {
      overlay: false,
      GetAllBMSUserList: [],
      noDataText: "",
    };
  },
  methods: {
    async GetAllBMSUsersMethod() {
      this.GetAllBMSUserList = [];
      try {
        this.overlay = true;
        let result = await API.graphql(graphqlOperation(listUsers));
        this.GetAllBMSUserList = JSON.parse(result.data.ListUsers).data.items;
        //console.log("GetAllBMSUserList", this.GetAllBMSUserList);
        this.overlay = false;
      } catch (error) {
        console.log("Error!", error);
        this.noDataText = error.errors[0].message;
        this.overlay = false;
      }
    },
  },
};

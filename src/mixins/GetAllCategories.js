import { listCategory } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetAllCategories = {
  data: () => ({
    noDataText: "",

    GetAllCategoriesList: [],
  }),
  mounted() {},
  methods: {
    async GetAllCategoriesMethod() {
      this.GetAllCategoriesList = [];
      try {
        this.overlay = true;
        let result = await API.graphql(graphqlOperation(listCategory));
        this.GetAllCategoriesList = JSON.parse(
          result.data.ListCategory
        ).data.items;
        //console.log("Categories List", this.GetAllCategoriesList);
        this.overlay = false;
      } catch (error) {
        console.log("Error!", error);
        this.noDataText = error.errors[0].message;
        this.overlay = false;
      }
    },
  },
};

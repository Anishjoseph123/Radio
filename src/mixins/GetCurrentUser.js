import { getCurrentUserDetails } from "@/graphql/queries.js";
import { API, graphqlOperation } from "aws-amplify";
export const GetCurrentUser = {
  data() {
    return {
      getCurrentUserDetails: {},
      overlay: false,
    };
  },
  methods: {
    async GetCurrentUserDetailsMethod() {
      try {
        this.overlay = true;
        let result = await API.graphql(
          graphqlOperation(getCurrentUserDetails, {
            input: {
              user_email_id: this.$store.getters.get_user_email,
            },
          })
        );
        this.$store.commit("SET_CURRENTUSER_DETAILS", JSON.parse(result.data.GetCurrentUserDetails).data.items[0]);
        this.overlay = false;
      } catch (error) {
        console.log("Error", error);
        this.overlay = false;
        this.$router.push("/");
        console.log(error);
      }
    },
  },
};

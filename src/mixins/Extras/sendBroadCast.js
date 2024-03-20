import { publishMessage } from "@/graphql/mutations.js";
import { API, graphqlOperation } from "aws-amplify";
export const sendBroadCast = {
  data: () => ({}),
  mounted() {},
  methods: {
    async sendBroadCastMethod(messageItem, channel_api_key) {
      this.loading = true;
      let inputParams = {
        channel_api_key: channel_api_key,
        content_type: "dashboard_text",
        channel_message: JSON.stringify({
          title: "RADIO CHANNEL CATALOGUE",
          description: JSON.stringify(messageItem),
          add_client_id_to_url: false,
          ttl: "FOREVER",
          geo_enabled: false,
        }),
        enable_notification: true,
        open_within_app: true,
        broadcast_now: true,
      };
      try {
        let result = await API.graphql(
          graphqlOperation(publishMessage, {
            input: inputParams,
          })
        );
        let ResultObject = JSON.parse(result.data.PublishMessage);
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "success",
            Top: true,
            renderComp: true,
            SnackbarText: ResultObject.status_message,
          };
        });
        this.loading = false;

        return {
          status: "SUCCESS",
          status_message: ResultObject.status_message,
        };
      } catch (error) {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "error",
            Top: true,
            SnackbarText: error.errors[0].message,
          };
        });
        this.loading = false;
        return {
          status: "ERROR",
          error_message: error.errors[0].message,
        };
      }
    },
  },
};

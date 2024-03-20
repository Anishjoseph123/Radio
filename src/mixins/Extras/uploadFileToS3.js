var AWS = require("aws-sdk");
export const uploadFileToS3 = {
  data: () => ({}),
  mounted() {},
  methods: {
    uploadImageToS3Method(file) {
      var fileObject = file[0];
      console.log("file object", fileObject);

      return new Promise((res) => {
        var self = this;

        var s3Bucket = new AWS.S3({
          region:
            self.$store.getters.get_current_user_details.s3_details.region,
          accessKeyId:
            self.$store.getters.get_current_user_details.s3_details.access_key,
          secretAccessKey:
            self.$store.getters.get_current_user_details.s3_details.secret_key,
        });
        if (fileObject !== null && typeof fileObject === "object") {
          console.log(
            "Is an Object?",
            fileObject !== null && typeof fileObject === "object"
          );
          console.log("Type of fileObject is", typeof fileObject);
          var fileReader = new FileReader();
          if (fileObject !== null || "") fileReader.readAsDataURL(fileObject);
          console.log("file object", fileObject);
          fileReader.onload = async () => {
            var base64FileContent = fileReader.result.split(",");
            var buf = Buffer.from(base64FileContent[1], "base64");
            var param = {
              Bucket:
                self.$store.getters.get_current_user_details.s3_details
                  .bucket_name,
              Key: `${
                self.$store.getters.get_current_user_details.user_email_id
              }/${new Date().getTime()}_${fileObject.name.replaceAll(
                /\s/g,
                ""
              )}`,
              Body: buf,
              ContentType: fileObject.type,
              ACL: "public-read-write",
            };
            console.log("params", param);
            await s3Bucket.putObject(param, (err, data) => {
              if (err) {
                console.log(err);
                res({
                  status: "ERROR",
                  status_message: err.toString(),
                });
              } else if (data) {
                data = fileObject;
                console.log("data", data);
                res({
                  status: "SUCCESS",
                  status_message: "File Uploaded Successfully!!",
                  file_url: `https://${
                    param.Bucket
                  }.s3.ap-south-1.amazonaws.com/${encodeURI(param.Key)}`,
                });
              }
            });
          };
        } else {
          console.log("File object type:", typeof fileObject);
          console.log("res type:", typeof res);
          console.error(
            "File object is not defined or is not an object",
            fileObject
          );
        }
      });
    },
  },
};

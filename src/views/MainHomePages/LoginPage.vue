<template>
  <div>
    <Snackbar :SnackBarComponent="SnackBarComponent" />
    <v-card
      class="elevation-0 overflow-auto"
      color=""
      tile
      :height="height"
      id="main_card"
    >
      <v-app-bar flat dense color="#474747" fixed>
        <v-toolbar-title>
          <v-img
            contain
            src="../../assets/android-chrome-512x512.png"
            height="40"
            width="60"
          ></v-img>
        </v-toolbar-title>
        <v-toolbar-items>
          <h4 class="mt-3 white--text">Radio.ONE</h4>
        </v-toolbar-items>
      </v-app-bar>
      <v-card-text>
        <v-row no-gutters justify="center" class="ma-0">
          <v-col cols="12" xs="12" sm="12" md="7" lg="7" xl="7" class="mt-8">
            <div
              :class="
                $vuetify.breakpoint.xs
                  ? 'subtitle-2 black--text mt-3'
                  : 'text-h4 pt-6 black--text font-weight-bold'
              "
            >
              Listen to Across Millions of Stations in Radio.ONE.
            </div>
            <v-img
              contain
              src="https://cdn.pixabay.com/photo/2023/04/20/00/01/podcast-7938768_1280.png"
              alt="image"
              height="auto"
              width="700"
            ></v-img>
          </v-col>
          <v-col
            cols="12"
            xs="12"
            sm="12"
            md="5"
            lg="5"
            xl="5"
            align="center"
            class="LoginAlign"
          >
            <!-- :tile="$vuetify.breakpoint.xs ? true : false" -->
            <v-card
              :rounded="$vuetify.breakpoint.xs ? '' : 'xl'"
              :flat="$vuetify.breakpoint.xs ? true : false"
              style="margin-top: 100px"
              :max-width="$vuetify.breakpoint.xs ? '1000px' : '400px'"
              height="auto"
            >
              <v-img
                contain
                height="100"
                width="150"
                src="@/assets/android-chrome-512x512.png"
              ></v-img>
              <span class="text-h6" style="color: #98bc90">Radio.ONE</span>
              <v-card-title class="pb-4 pt-1 mt-0">
                <v-row class="text-center">
                  <v-col cols="12" class="py-0" align="center"> </v-col>
                  <v-col cols="12" class="py-0">
                    <div v-if="currentTitle != 'Set New Password'" class="mt-5">
                      <h4 class="primary--text font-weight-bold text-uppercase">
                        {{ currentTitle }}
                      </h4>
                    </div>
                    <div v-else class="mt-5">
                      <h4 class="primary--text font-weight-bold text-uppercase">
                        {{ currentTitle }}
                      </h4>
                    </div>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-window v-model="step" class="px-3" touchless>
                  <v-window-item :value="1">
                    <v-card-text>
                      <v-form ref="form" :lazy-validation="true" class="mt-2">
                        <v-row dense>
                          <v-col
                            cols="12"
                            lg="12"
                            sm="12"
                            md="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              outlined
                              dense
                              solo
                              label="Email ID*"
                              prepend-inner-icon="mdi-account"
                              :rules="rules.email"
                              v-model="Login.EmailID"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            lg="12"
                            sm="12"
                            md="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              outlined
                              dense
                              solo
                              label="Password*"
                              :type="isPwd ? 'text' : 'password'"
                              @click:append="isPwd = !isPwd"
                              required
                              :append-icon="isPwd ? 'mdi-eye' : 'mdi-eye-off'"
                              prepend-inner-icon="mdi-lock"
                              :rules="[(v) => !!v || 'Password is required']"
                              v-model="Login.Password"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="py-0 mt-n4">
                      <v-row>
                        <v-col cols="8" lg="6" sm="6" md="6" xl="6" xs="6">
                          <v-checkbox
                            dense
                            color="primary"
                            class="my-0 py-0 ml-1 checkboxx"
                            v-model="rememberme"
                            label="Remember Me"
                            :disabled="
                              Login.EmailID === '' && Login.Password === ''
                            "
                          ></v-checkbox
                        ></v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="12" lg="6" sm="12" md="6" xl="6" xs="12">
                          <v-btn
                            small
                            text
                            class="FontSize mb-4 forgotPwd"
                            color="#474747 fontStyle"
                            @click="step = 3"
                            >Forgot Password ?</v-btn
                          ></v-col
                        >
                      </v-row>
                    </v-card-actions>
                    <v-card-actions class="pt-2 pb-2">
                      <v-btn
                        block
                        rounded
                        :loading="loading"
                        depressed
                        color="#474747"
                        class="loginBtn"
                        dark
                        @click="ValidateSignUpForm()"
                        >Login</v-btn
                      >
                    </v-card-actions>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-card-text>
                      <v-form ref="formCP" lazy-validation>
                        <v-row dense>
                          <v-col
                            cols="12"
                            lg="12"
                            md="12"
                            sm="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              class=""
                              outlined
                              dense
                              solo
                              label="New Password*"
                              :type="isPwdNew ? 'text' : 'password'"
                              @click:append="isPwdNew = !isPwdNew"
                              required
                              :append-icon="
                                isPwdNew ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              prepend-inner-icon="mdi-lock"
                              :rules="[(v) => !!v || 'Password is required']"
                              v-model="Password.NewPassword"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            lg="12"
                            md="12"
                            sm="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              class=""
                              outlined
                              solo
                              dense
                              hint="Password must be same as above."
                              label="Confirm Password*"
                              :type="isPwdConfirm ? 'text' : 'password'"
                              @click:append="isPwdConfirm = !isPwdConfirm"
                              required
                              :append-icon="
                                isPwdConfirm ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              prepend-inner-icon="mdi-lock"
                              :rules="[(v) => !!v || 'Password is required']"
                              v-model="Password.ConfirmPassword"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0 pb-8 px-4">
                      <v-btn
                        block
                        :loading="loading"
                        rounded
                        depressed
                        dark
                        class="loginBtn1"
                        color="#474747"
                        @click="ValidateConfirmPasswordForm()"
                        >Login</v-btn
                      >
                    </v-card-actions>
                  </v-window-item>
                  <v-window-item :value="3">
                    <v-card-text>
                      <v-form ref="formOTP">
                        <!-- <div class="text-center">
                          Please Enter The Registered Email ID.
                        </div> -->
                        <v-row dense>
                          <v-col
                            cols="12"
                            lg="12"
                            md="12"
                            sm="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              dense
                              outlined
                              solo
                              label="Enter Email ID*"
                              prepend-inner-icon="mdi-email"
                              v-model="OTPEmail"
                              :rules="[(v) => !!v || 'Email ID is required.']"
                              class="mt-4"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <div class="FontSize caption black--text">
                          Enter the Email ID used for Raydeo Login/Registration.
                        </div>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-layout justify-space-between>
                        <v-btn
                          text
                          color="#474747 fontStyle"
                          small
                          id="backk"
                          @click="step = 1"
                          >Back To login
                        </v-btn>
                        <!-- <v-spacer></v-spacer> -->
                        <v-btn
                          text
                          id="right_arrow"
                          color="#474747 fontStyle"
                          small
                          @click="ValidateOTP()"
                          >Next
                          <v-icon x-small dark dense>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-card-actions>
                  </v-window-item>
                  <v-window-item :value="4">
                    <v-card-text>
                      <v-form ref="formConfirmOTP">
                        <div class="text-center black--text">
                          Enter the Raydeo Activation Code
                        </div>
                        <v-row dense>
                          <v-col
                            cols="12"
                            lg="12"
                            sm="12"
                            md="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              dense
                              outlined
                              solo
                              label="Enter Code*"
                              prepend-inner-icon="mdi-numeric"
                              v-model="ConfirmOTP"
                              :rules="[(v) => !!v || 'Code is required']"
                              class="mt-4"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            lg="12"
                            sm="12"
                            md="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              dense
                              outlined
                              solo
                              label="New Password*"
                              v-model="ConfirmNewPassword"
                              :rules="[(v) => !!v || 'Password is required']"
                              class=""
                              :type="isPwdConfirmCode ? 'text' : 'password'"
                              @click:append="
                                isPwdConfirmCode = !isPwdConfirmCode
                              "
                              required
                              :append-icon="
                                isPwdConfirmCode ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              prepend-inner-icon="mdi-lock"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            lg="12"
                            sm="12"
                            md="12"
                            xl="12"
                            xs="12"
                          >
                            <v-text-field
                              dense
                              outlined
                              solo
                              label="Confirm Password*"
                              v-model="ReenterNewPassword"
                              :rules="[(v) => !!v || 'Password is required']"
                              class=""
                              :type="isPwdConfirmCode ? 'text' : 'password'"
                              @click:append="
                                isPwdConfirmCode = !isPwdConfirmCode
                              "
                              required
                              :append-icon="
                                isPwdConfirmCode ? 'mdi-eye' : 'mdi-eye-off'
                              "
                              prepend-inner-icon="mdi-lock"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <div class="FontSize text-center black--text">
                          Enter the Raydeo Activation Code sent to your
                          registered Email ID.
                        </div>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-layout justify-space-between>
                        <v-btn
                          text
                          color="#474747"
                          id="backk"
                          small
                          @click="step = 1"
                          >Back To login</v-btn
                        >
                        <!-- <v-spacer></v-spacer> -->
                        <v-btn
                          text
                          color="#474747"
                          small
                          id="right_arrow"
                          @click="ValidateEnteredOTP()"
                          >Next
                          <v-icon dark x-small dense>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-card-actions>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { Auth } from "aws-amplify";
import Snackbar from "@/components/Extras/Snackbar.vue";
export default {
  components: {
    Snackbar,
  },
  data: () => ({
    height: 0,
    step: 1,
    Login: {
      EmailID: "",
      Password: "",
    },
    isPwd: false,
    loading: false,
    Password: {
      NewPassword: "",
      ConfirmPassword: "",
    },
    isPwdNew: false,
    isPwdConfirm: false,
    SnackBarComponent: {},
    OTPEmail: "",
    ConfirmOTP: "",
    ConfirmNewPassword: "",
    ReenterNewPassword: "",
    isPwdConfirmCode: false,
    rememberme: false,
    rules: {
      email: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    },
  }),
  watch: {
    rememberme(val) {
      if (val == true) {
        localStorage.setItem("currentuseremail", JSON.stringify(this.Login));
      } else if (val == false) {
        delete localStorage.currentuseremail;
      }
    },
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign In";
        case 2:
          return "Set New Password";
        case 3:
          return "Forgot Password ?";
        case 4:
          return "Forgot Password ?";
        default:
          return "Account created";
      }
    },
  },
  mounted() {
    this.CheckRememberMe();
    this.height = window.innerHeight;
  },
  methods: {
    CheckRememberMe() {
      if (localStorage.getItem("currentuseremail") != null) {
        this.Login = JSON.parse(localStorage.getItem("currentuseremail"));
        this.rememberme = true;
      }
    },
    ConfirmOTPMethod() {
      Auth.forgotPasswordSubmit(
        this.OTPEmail,
        this.ConfirmOTP,
        this.ConfirmNewPassword
      )
        .then(() => {
          this.$refs.formConfirmOTP.reset();
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              renderComp: true,
              SnackbarText: "Password  Changed Successfully",
            };
          });

          this.step = 1;
        })
        .catch((err) => {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              renderComp: true,
              SnackbarText: err.message,
            };
          });
        });
    },
    ValidateEnteredOTP() {
      if (this.$refs.formConfirmOTP.validate()) {
        if (this.ReenterNewPassword == this.ConfirmNewPassword) {
          this.ConfirmOTPMethod();
        } else {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              renderComp: true,
              SnackbarText: "Password Does not match",
            };
          });
        }
      } else if (this.ConfirmOTP == "") {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText:
              "Please Enter The Code Sent To Your Registered Email ID",
          };
        });
      } else if (
        this.ReenterNewPassword == "" &&
        this.ConfirmNewPassword == ""
      ) {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: "Please Set New Password to continue",
          };
        });
      }
    },
    ValidateOTP() {
      if (this.$refs.formOTP.validate()) {
        this.SendOTPEmail();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: "Please Enter Registered Email",
          };
        });
      }
    },
    SendOTPEmail() {
      Auth.forgotPassword(this.OTPEmail)
        .then(() => {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              renderComp: true,
              SnackbarText: "OTP Sent To Registered Email",
            };
          });

          this.step = 4;
        })
        .catch((err) => {
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              renderComp: true,
              SnackbarText: err.message,
            };
          });
        });
    },
    async ConfirmPassword() {
      try {
        this.loading = true;
        const result = await Auth.completeNewPassword(
          this.user,
          this.Password.ConfirmPassword
        )
          .then((user) => {
            return user;
          })
          .catch((e) => {
            this.$nextTick(() => {
              this.SnackBarComponent = {
                SnackbarVmodel: true,
                SnackbarColor: "red",
                Top: true,
                renderComp: true,
                SnackbarText: e,
              };
            });

            return e;
          });
        if (result.username) {
          this.loading = false;
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              renderComp: true,
              SnackbarText: "Logged in Successfully",
            };
          });

          this.$refs.formCP.reset();
          this.ActivateMethod();
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: error.message,
          };
        });
      }
    },
    async SignIn() {
      try {
        this.loading = true;
        this.user = await Auth.signIn(this.Login.EmailID, this.Login.Password);
        if (this.user.challengeName === "NEW_PASSWORD_REQUIRED") {
          this.step = 2;
          this.loading = false;
          this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
        } else {
          this.$store.commit("SET_USEREMAIL", this.Login.EmailID);
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "green",
              Top: true,
              renderComp: true,
              SnackbarText: "Logged in Successfully",
            };
          });

          this.ActivateMethod();
          this.loading = false;
        }
      } catch (error) {
        console.log("error", error);
        this.loading = false;
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: error.message,
          };
        });
      }
    },
    ActivateMethod() {
      setTimeout(() => this.$router.push("/Stations"), 500);
    },
    ValidateConfirmPasswordForm() {
      if (this.$refs.formCP.validate()) {
        if (this.Password.NewPassword == this.Password.ConfirmPassword) {
          this.ConfirmPassword();
        } else {
          this.$refs.form.reset();
          this.$nextTick(() => {
            this.SnackBarComponent = {
              SnackbarVmodel: true,
              SnackbarColor: "red",
              Top: true,
              renderComp: true,
              SnackbarText: "Password does not match",
            };
          });
        }
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            renderComp: true,
            SnackbarText: "Fields marked with asterisks (*) are mandatory",
          };
        });
      }
    },
    ValidateSignUpForm() {
      if (this.$refs.form.validate()) {
        this.SignIn();
      } else {
        this.$nextTick(() => {
          this.SnackBarComponent = {
            renderComp: true,
            SnackbarVmodel: true,
            SnackbarColor: "red",
            Top: true,
            SnackbarText: "Fields marked with asterisks (*) are mandatory.",
          };
        });
      }
    },
  },
};
</script>

<style>
html,
body {
  overflow-y: hidden;
}
.v-main__wrap {
  height: calc(100vh - 65px);
  overflow-y: auto;
  overflow-x: hidden;
}
#content {
  height: calc(100vh - 65px);
  overflow-y: hidden;
}
.LoginAlign {
  margin: 0 auto;
}
.loginBtn1:hover {
  background: #98bc90 !important;
  color: black !important;
}
#main_card {
  /* background: linear-gradient(to right, #474747, #98bc90); */
  /* background-image: url("https://cdn.pixabay.com/photo/2020/01/31/07/53/man-4807395_1280.jpg"); */
  /* background-image: url("https://cdn.pixabay.com/photo/2023/04/20/00/01/podcast-7938768_1280.png"); */
  /* background: #474747 !important; */
  /* background-image: url("https://cdn.pixabay.com/photo/2018/09/30/09/14/music-3712975_1280.jpg"); */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* z-index: 1; */
  /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); */
}

#right_arrow {
  position: relative;
  transition: transform 0.3s ease-in-out;
}

#right_arrow:hover {
  transform: translateX(10px);
  background: #98bc90;
}
#backk {
  position: relative;
  transition: transform 0.3s ease-in-out;
}
#backk:hover {
  transform: translateX(-10px);
  background: #474747;
  color: white !important;
}
</style>

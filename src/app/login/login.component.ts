import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/auth.service";
import { Message, MessageService } from "primeng/api";
import jwt_decode from "jwt-decode";
import { first } from "rxjs/operators";
import { PrimeNGConfig } from "primeng/api";
import { flatten } from "@angular/compiler";
import { join } from "path";
import { ThemeService } from "../theme.service";

@Component({
  selector: "app-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnInit {
  phoneNumberFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/^(08\d|09\d|0[2-5])\d{8}$/)
  ]);

  displayDialog: boolean = false;
  otp = ["", "", "", "", "", ""];
  twoFA = ["", "", "", "", "", ""];
  form: FormGroup;
  loading = false;
  submitted = false;
  msgs1: Message[];
  errorMessage: string;
  errorbox: any;
  typepassword: string;
  loginState: boolean = true;
  otpState: boolean = false;
  firstTimeLogin: boolean = false;
  twoFAState: boolean = false;
  isGenQRCode: boolean = true;
  concatenatedOTP = "";
  listpin: any[] = [];
  QRBase64 = "";
  phoneNumber: string = "";
  userName: string;
  refCode: string;
  countdownTimer: number = 10;
  showTimer: boolean = true;
  otp_input: string;
  twoFA_input: string;
  themeValue: string = this.themeService.theme;
  resetPassword: string = "";
  confirmResetPassword: string;
  resetOTP: string = "";
  resetPasswordUsername: string;
  resetPasswordEmail: string;

  passwordValidations = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false
  };
  // user = {
  //   firstName: "",
  //   lastName: "",
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  // };
  userData = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    zone: 0,
    role: "monitor",
    confirmPassword: "",
    email: "",
    agency: ""
  };
  roleType = [
    {
      id: 1,
      name: "ประชาชน",
      adminwebname: "กลุ่มเจ้าหน้าที่ทั่วไป",
      adminwebshow: 1,
      admindssshow: 1
    },
    {
      id: 2,
      name: "vip",
      adminwebname: "vip",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 3,
      name: "หน่วยกู้ภัยสุวรรณภูมิ",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยสุวรรณภูมิ",
      adminwebshow: 2,
      admindssshow: 1
    },
    {
      id: 4,
      name: "หน่วยกู้ภัยบางปะกง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยบางปะกง",
      adminwebshow: 3,
      admindssshow: 1
    },
    {
      id: 5,
      name: "หน่วยกู้ภัยคลองหลวง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยคลองหลวง",
      adminwebshow: 4,
      admindssshow: 1
    },
    {
      id: 6,
      name: "หน่วยกู้ภัยรามอินทรา",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยรามอินทรา",
      adminwebshow: 5,
      admindssshow: 1
    },
    {
      id: 7,
      name: "ตำรวจ",
      adminwebname: "กลุ่มตำรวจทางหลวง",
      adminwebshow: 7,
      admindssshow: 1
    },
    {
      id: 8,
      name: "MA",
      adminwebname: "MA",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 9,
      name: "CCB ลาดกระบัง",
      adminwebname: "CCB ลาดกระบัง",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 10,
      name: "CCB พัทยา",
      adminwebname: "CCB พัทยา",
      adminwebshow: 0,
      admindssshow: 1
    },
    {
      id: 11,
      name: "หน่วยกู้ภัยแหลมฉบัง",
      adminwebname: "กลุ่มเจ้าหน้าที่กู้ภัยแหลมฉบัง",
      adminwebshow: 6,
      admindssshow: 1
    },
    {
      id: 12,
      name: "cctv test",
      adminwebname: "cctvtest",
      adminwebshow: 8,
      admindssshow: 1
    },
    {
      id: 13,
      name: "หมวดคลองหลวง",
      adminwebname: "หมวดคลองหลวง",
      adminwebshow: 9,
      admindssshow: 1
    },
    {
      id: 14,
      name: "หมวดคันนายาว",
      adminwebname: "หมวดคันนายาว",
      adminwebshow: 10,
      admindssshow: 1
    },
    {
      id: 15,
      name: "หมวดลาดกระบัง",
      adminwebname: "หมวดลาดกระบัง",
      adminwebshow: 11,
      admindssshow: 1
    },
    {
      id: 16,
      name: "หมวดพานทอง",
      adminwebname: "หมวดพานทอง",
      adminwebshow: 12,
      admindssshow: 1
    },
    {
      id: 17,
      name: "หมวดแหลมฉบัง",
      adminwebname: "หมวดแหลมฉบัง",
      adminwebshow: 13,
      admindssshow: 1
    },
    {
      id: 18,
      name: "หมวดพัทยา",
      adminwebname: "หมวดพัทยา",
      adminwebshow: 14,
      admindssshow: 1
    },
    {
      id: 19,
      name: "มาบตาพุด",
      adminwebname: "มาบตาพุด",
      adminwebshow: 15,
      admindssshow: 1
    },
    {
      id: 25,
      name: "ตำรวจอ่อนนุช",
      adminwebname: "ตำรวจอ่อนนุช",
      adminwebshow: 16,
      admindssshow: 1
    },
    {
      id: 26,
      name: "ตำรวจเขาดิน",
      adminwebname: "ตำรวจเขาดิน",
      adminwebshow: 17,
      admindssshow: 1
    },
    {
      id: 27,
      name: "ตำรวจเขาเขียว และมาบประชัน",
      adminwebname: "ตำรวจเขาเขียว และมาบประชัน",
      adminwebshow: 18,
      admindssshow: 1
    },
    {
      id: 28,
      name: "Test",
      adminwebname: "Test",
      adminwebshow: 19,
      admindssshow: 1
    },
    {
      id: 29,
      name: "",
      adminwebname: "",
      adminwebshow: 20,
      admindssshow: 1
    }
  ];
  displayForgetPasswordDialog: boolean;
  displayResetForgetPasswordDialog: boolean;
  showRefCode: boolean;
  verificationKey: any;
  userid: any;
  displayOTPDlg: boolean;
  emailSent: any;
  countdownTime: number;
  isResendButtonDisabled: boolean;
  countdownInterval: NodeJS.Timeout;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private elementRef: ElementRef,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.typepassword = "password";
  }

  get f() {
    return this.form.controls;
  }

  onInputChanged() {
    // Check if the input starts with '0' and update it if needed
    if (this.otp_input.startsWith("0")) {
      // Handle the case when it starts with '0'
      // You can trim leading '0's or take any other action you prefer
      // For example, you can remove leading zeros like this:
      this.otp_input = this.otp_input.replace(/^0+/g, "");
    }
  }

  openDialog() {
    this.displayDialog = true;
  }

  // ฟังก์ชันปิด Dialog
  closeDialog() {
    this.displayDialog = false;
    this.userData = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      zone: 0,
      role: "monitor",
      confirmPassword: "",
      email: "",
      agency: ""
    };
  }

  onLogin() {
    if (this.form.invalid) return;
    this.loading = true;

    // Step 1: Attempt login with DSS
    this.authservice
      .loginWithDSS(this.f.username.value, this.f.password.value)
      .subscribe({
        next: response => {
          // console.log(response.login);

          // Step 2: Check if DSS login was unsuccessful
          if (response.login != true) {
            // this.messageService.add({
            //   severity: "success",
            //   summary: "Sucess",
            //   detail: "Login Success !"
            // });
            // Proceed to normal login if DSS login fails
            this.authservice
              .login(this.f.username.value, this.f.password.value)
              .subscribe({
                next: response => {
                  // alert("LOGIN WITH Data Exchange");
                  this.loading = false;
                  this.submitted = true;
                  this.loginState = false;
                  localStorage.setItem("token", response["token"]);
                  this.authservice.settoken(localStorage.getItem("token"));
                  // ไม่แน่ใจว่า Token ถูกรึยัง
                  let userdata = jwt_decode(localStorage.getItem("token"));
                  const returnUrl =
                    this.route.snapshot.queryParams["returnUrl"] ||
                    "/d-api-use";
                  this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                  if (error.error.status === 401) {
                    this.messageService.add({
                      severity: "error",
                      summary: "Error",
                      detail: error.error.error.detail
                    });
                    this.loading = false;
                  }
                }
              });
          } else {
            this.loading = false;
            this.submitted = true;
            this.loginState = false;
            //  console.log(this.createUnsignedJWT(response))

            localStorage.setItem("token", this.createUnsignedJWT(response));
            this.authservice.settoken(localStorage.getItem("token"));

            // ไม่แน่ใจว่า Token ถูกรึยัง
            let userdata = jwt_decode(localStorage.getItem("token"));
            const returnUrl =
              this.route.snapshot.queryParams["returnUrl"] || "/d-api-use";
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: error => {
          console.error("Error during DSS login:", error);
          this.loading = false;
        }
      });
  }
  getUserGroup(userdata, roleType) {
    // หา roleType ที่ตรงกับ cctv_group ของ userdata
    const matchedRole = roleType.find(role => role.id === userdata.cctv_group);

    if (matchedRole) {
      const name = matchedRole.name;

      // เงื่อนไข VIP, กู้ภัย, หมวด
      if (
        name.includes("VIP") ||
        name.includes("กู้ภัย") ||
        name.includes("หมวด")
      ) {
        return "DOH";
      }

      // เงื่อนไข ตำรวจ
      if (name.includes("ตำรวจ")) {
        return "POL";
      }
    }

    // เงื่อนไข username ที่ตรงกับรายชื่อพิเศษ
    const specialUsers = ["charoenwasit", "panuwat", "saengdao", "palm", "sk","minsight","fm_chairat"];
    if (specialUsers.includes(userdata.user_name)) {
      return "develop";
    }

    // กรณีที่ไม่เข้าเงื่อนไขใด ๆ
    return "monitor";
  }
  createUnsignedJWT(response) {
    const header = {
      alg: "none", // ไม่มีการเข้ารหัส
      typ: "JWT"
    };
    const updatedUser = {
      ...response.member, // คัดลอกค่าเดิมทั้งหมด
      username: response.member.name, // เพิ่มคีย์ใหม่ชื่อ username และตั้งค่าจาก name
      role: this.getUserGroup(response.member, this.roleType)
    };
    // console.log(updatedUser)
    // Convert objects to Base64URL encoded strings
    const base64UrlHeader = this.base64UrlEncode(JSON.stringify(header));
    const base64UrlPayload = this.base64UrlEncode(JSON.stringify(updatedUser));

    // Combine header, payload, and an empty signature
    const jwt = `${base64UrlHeader}.${base64UrlPayload}.`;

    // console.log('Unsigned JWT:', jwt);
    return jwt;
  }

  // Base64 URL Encode helper function
  base64UrlEncode(input: string): string {
    // Convert input string to UTF-8 before encoding
    const utf8 = new TextEncoder().encode(input); // แปลงเป็น UTF-8
    const base64 = btoa(String.fromCharCode(...utf8)); // เข้ารหัส Base64

    // แปลง Base64 ให้เป็น Base64URL
    return base64
      .replace(/=/g, "") // ลบ padding
      .replace(/\+/g, "-") // แทนที่ + ด้วย -
      .replace(/\//g, "_"); // แทนที่ / ด้วย _
  }
  myFunction(e) {
    if (e.target.checked) {
      this.typepassword = "text";
    } else {
      this.typepassword = "password";
    }
  }

  validatePassword() {
    const password = this.resetPassword || "";

    this.passwordValidations.length = password.length >= 8;
    this.passwordValidations.lowercase = /[a-z]/.test(password);
    this.passwordValidations.uppercase = /[A-Z]/.test(password);
    this.passwordValidations.number = /\d/.test(password);
    this.passwordValidations.specialChar = /[!@#$%^&*]/.test(password);
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordValidations).every(Boolean);
  }

  onSubmit2FA(twoFA) {
    // var joinpin = twoFA.join("");
    this.twoFA_input;
    this.authservice
      .check2FA(this.f.username.value, this.f.password.value, this.twoFA_input)
      .subscribe({
        next: response => {
          if (response["verified"]) {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Pin for 2FA is correct",
              life: 3000
            });
            this.authservice.settoken(localStorage.getItem("temp"));
            const returnUrl =
              this.route.snapshot.queryParams["returnUrl"] || "/realtime";
            this.router.navigateByUrl(returnUrl);
            this.otpState = false;
            this.twoFAState = false;
            this.loginState = false;
            this.loading = false;
          } else {
            this.twoFA_input = undefined;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Pin for 2FA is incorrect. Please try again",
              life: 3000
            });
            // this.otpState = true;
            this.twoFAState = true;
            this.loginState = false;
            this.loading = false;
          }
        },
        error: result => {
          if (result) {
            if (result.status == 200) {
              if (result.result.text == "True") {
                this.messageService.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Pin for 2FA is correct",
                  life: 3000
                });
                const returnUrl =
                  this.route.snapshot.queryParams["returnUrl"] || "/realtime";
                this.router.navigateByUrl(returnUrl);
                this.otpState = false;
                this.twoFAState = false;
                this.loginState = false;
                this.loading = false;
              } else if (result.result.text == "False") {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Pin for 2FA is incorrect. Please try again",
                  life: 3000
                });
                this.otpState = true;
                this.twoFAState = true;
                this.loginState = false;
                this.loading = false;
              }
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: result.message,
                life: 3000
              });
              this.otpState = false;
              this.twoFAState = false;
              this.loginState = true;
              this.loading = false;
            }
          }
        }
      });
  }

  onSubmitOTP(twoFA) {
    var joinpin = twoFA.join("");
    // this.otpState = false;
    // this.twoFAState = true;
    if (this.otp_input != undefined || this.otp_input != "") {
      this.authservice
        .submitOTP(
          this.userName,
          this.phoneNumber,
          this.refCode,
          this.otp_input
        )
        .subscribe({
          next: response => {
            if (response.valid == true) {
              this.otpState = false;
              this.twoFAState = true;
              var firsttime = localStorage.getItem("firsttime");
              if (firsttime == "true") {
                this.authservice
                  .generateKey2FA(this.f.username.value, this.f.password.value)
                  .subscribe({
                    next: response => {
                      if (response["base64_qrcode"] === null) {
                        this.isGenQRCode = false;
                      } else {
                        this.isGenQRCode = true;
                        this.QRBase64 = response["base64_qrcode"];
                      }

                      error: response => {};
                    }
                  });
              }
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Success",
                life: 3000
              });
              this.otp_input = undefined;
            } else {
              this.otp_input = undefined;
              this.messageService.add({
                severity: "warn",
                summary: "Warning",
                detail: "OTP is incorrect, please try again",
                life: 3000
              });
            }
          }
        });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Fill OTP.",
        life: 3000
      });
    }
  }

  forgetPasswordDialog() {
    console.log("HI");
    this.displayForgetPasswordDialog = true;
    this.resetPasswordUsername = "";
    this.resetPasswordEmail = "";
  }

  forgetPasswordStep() {
    this.displayResetForgetPasswordDialog = true;
    this.resetPassword = "";
    this.confirmResetPassword = "";
    this.resetOTP = "";
  }

  onResetPassword() {
    // Assuming you have form values or variables holding these values
    const password = this.resetPassword; // the password entered
    const confirmPassword = this.confirmResetPassword; // the confirm password entered
    const otp = this.resetOTP; // the OTP entered by the user
    const key = this.refCode; // the key entered by the user (or from context)

    // First, let's check if the passwords match
    if (password !== confirmPassword || password === "") {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Password doesn't match",
        life: 3000
      });
      return; // Stop further execution if passwords don't match
    }

    // Validate password strength using regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
        life: 3000
      });
      return; // Stop further execution if password is invalid
    }

    // Check OTP length
    if (otp.length !== 6) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please enter a 6 digit OTP.",
        life: 3000
      });
      return; // Stop further execution if OTP is not 6 digits
    }

    // Now let's verify the OTP and key
    this.authservice.verifyEmail(key, otp).subscribe(
      verifyResponse => {
        console.log("OTP Verification successful:", verifyResponse);

        // If OTP is correct, proceed to reset the password
        const userId = this.userid; // Get the actual user ID from the context, maybe from a session or form

        // Proceed with password reset only if OTP is verified
        if (verifyResponse.data.status === true) {
          this.authservice
            .resetPassword(userId, password)
            .subscribe(resetResponse => {
              this.displayForgetPasswordDialog = false;
              this.displayResetForgetPasswordDialog = false;
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Your password has been successfully changed.",
                life: 3000
              });
            });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please check the OTP or try again later.",
            life: 3000
          });
        }
      },
      verifyError => {
        console.error("OTP verification failed:", verifyError);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "OTP verification failed. Please try again.",
          life: 3000
        });
      }
    );
  }

  resetPasswordDialog() {
    if (!this.resetPasswordUsername || !this.resetPasswordEmail) {
      this.messageService.add({
        severity: "warn",
        summary: "Field Missing !",
        detail: "Username and Email are required !"
      });
      return;
    }

    this.loading = true;

    this.authservice
      .requestEmailOTP(this.resetPasswordUsername, this.resetPasswordEmail)
      .subscribe({
        next: response => {
          try {
            const responseData =
              typeof response === "string" ? JSON.parse(response) : response;
            this.refCode = responseData.data.ref_code;
            this.userid = responseData.data.user_id;
            this.emailSent = responseData.data.email_sent_otp;
            this.showRefCode = true;
            this.messageService.add({
              severity: "info",
              summary: "Information",
              detail: responseData.message
            });
          } catch (error) {
            console.error("Error parsing response:", error);
          }
        },
        error: error => {
          console.error("Error sending OTP", error);
          this.loading = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error, please try again"
          });
        },
        complete: () => {
          this.loading = false;
          this.displayOTPDlg = true; // เปิด OTP dialog เมื่อ OTP ถูกส่งแล้ว
          this.startCountdownOTP();
          this.displayForgetPasswordDialog = false;
        }
      });
  }

  onVerifyOTP() {
    const otp = this.resetOTP; // OTP ที่ผู้ใช้กรอก
    const key = this.refCode; // refCode ที่ได้จากการส่ง OTP

    if (otp.length !== 6) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please enter a 6 digit OTP.",
        life: 3000
      });
      return; // หาก OTP ไม่ถูกต้องจะหยุดการทำงาน
    }

    this.authservice.verifyEmail(key, otp).subscribe(
      verifyResponse => {
        if (verifyResponse.data.status === true) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "OTP verified. Now you can reset your password.",
            life: 3000
          });
          this.displayOTPDlg = false; // ปิด OTP dialog
          this.displayResetForgetPasswordDialog = true; // เปิด dialog รีเซ็ตรหัสผ่าน
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "OTP verification failed. Please try again.",
            life: 3000
          });
        }
      },
      verifyError => {
        console.error("OTP verification failed:", verifyError);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "OTP verification failed. Please try again.",
          life: 3000
        });
      }
    );
  }

  countdownnumber: any = "(" + 180 + ")";
  countdown() {
    let seconds: number = 179;

    const makeIteration = (): void => {
      if (seconds > 0) {
        // console.log(seconds);
        this.countdownnumber = "(" + seconds + ")";
        setTimeout(makeIteration, 1000); // 1 second waiting
      }
      seconds -= 1;
      if (seconds == 1) {
        setTimeout(() => {
          this.countdownnumber = "(0)";
          this.countdownnumber = "";
        }, 1000);
      }
    };

    setTimeout(makeIteration, 1000); // 1 second waiting
  }

  startCountdownOTP() {
    // รีเซ็ตเวลานับถอยหลัง
    this.countdownTime = 300;
    this.isResendButtonDisabled = true; // ปิดปุ่มเมื่อเริ่มนับถอยหลัง

    // ใช้ setInterval เพื่อลดเวลา 1 วินาทีทุกๆ วินาที
    this.countdownInterval = setInterval(() => {
      this.countdownTime--; // ลดเวลา

      // เมื่อเวลาเหลือ 0 ให้หยุดการนับถอยหลังและเปิดปุ่ม
      if (this.countdownTime <= 0) {
        clearInterval(this.countdownInterval); // หยุด setInterval
        this.isResendButtonDisabled = false; // เปิดปุ่มให้คลิกได้
      }
    }, 1000); // ทุกๆ 1000 มิลลิวินาที (1 วินาที)
  }

  startCountdown() {
    const countdownElement = document.getElementById("countdown");
    this.showTimer = true;
    this.countdownTimer = 180;
    // let countdown = this.countdownTimer;
    const timer = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer > 0) {
        countdownElement.textContent = this.countdownTimer.toString();
      } else {
        clearInterval(timer);
        this.showTimer = false;
        countdownElement.textContent = "0";
        // Optionally, re-enable the "Resend OTP" button here if it was disabled.
      }
    }, 1000); // Update the countdown every 1 second (1000 milliseconds)
  }

  createUser() {
    const password = this.userData.password;
    const confirmPassword = this.userData.confirmPassword;
    const email = this.userData.email;
    const { firstname, lastname, username, agency } = this.userData;

    // ตรวจสอบว่าพาสเวิร์ดตรงกัน

    // ตรวจสอบกรอกข้อมูลที่สำคัญ
    if (!firstname || !lastname || !username || !email || !agency) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields."
      });
      return;
    }

    if (password !== confirmPassword) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match."
      });
      return;
    }

    // ตรวจสอบความแข็งแรงของพาสเวิร์ด
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
      });
      return;
    }

    // ดำเนินการสร้างผู้ใช้ถ้าผ่านเงื่อนไขทั้งหมด
    this.authservice.createUser(this.userData).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Account Successfully Created",
          life: 3000
        });
        this.userData = {
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          zone: 0,
          role: "monitor",
          confirmPassword: "",
          email: "",
          agency: ""
        };
        this.displayDialog = false;
      },
      error: error => {
        if (error.status === 401) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Session expired, please logout and login again."
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "An error occurred while creating the account."
          });
        }
      }
    });
  }

  onResendOTP() {
    this.resetPasswordDialog();
    this.startCountdown();
  }

  resendOTP(event) {
    if (this.countdownnumber == 0) {
      this.countdown();
      this.requestOTP();
      this.refCode;
      this.messageService.add({
        severity: "success",
        summary: "Successful",
        detail: "OTP is resending ...",
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: `Please try again in ${this.countdownnumber} second`,
        life: 3000
      });
    }
  }

  requestOTP() {
    this.userName = this.f.username.value;
    this.phoneNumber;
    this.authservice.requestOTP(this.userName, this.phoneNumber).subscribe({
      next: response => {
        if (response?.ref_code != null) {
          this.firstTimeLogin = false;
          this.otpState = true;
          this.refCode = response.ref_code;
          this.countdown();
          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "OTP is sending ...",
            life: 3000
          });
          if (response["verified"]) {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: "Pin for 2FA is correct",
              life: 3000
            });
          }
        } else {
          this.firstTimeLogin = true;
          this.phoneNumber = "";
          this.messageService.add({
            severity: "error",
            summary: "error",
            detail: `${response?.details}`,
            life: 10000
          });
        }
      }
    });
  }
}

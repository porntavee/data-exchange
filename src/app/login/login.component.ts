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
    confirmPassword: ""
  };
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
                  localStorage.setItem("tk", response["token"]);
                  this.authservice.settoken(localStorage.getItem("tk"));
                  // ไม่แน่ใจว่า Token ถูกรึยัง
                  const returnUrl =
                    this.route.snapshot.queryParams["returnUrl"] || "/d-api";
                  this.router.navigateByUrl(returnUrl);
                  // const isFirstTime = response["firstLogin"]
                  //   ? response["firstLogin"]
                  //   : "true";
                  // localStorage.setItem("temp", response["token"]);
                  // localStorage.setItem("firsttime", isFirstTime);

                  // if (isFirstTime === "true") {
                  //   this.twoFAState = true;
                  //   this.authservice
                  //     .generateKey2FA(
                  //       this.f.username.value,
                  //       this.f.password.value
                  //     )
                  //     .subscribe({
                  //       next: response => {
                  //         this.isGenQRCode = response["base64_qrcode"] !== null;
                  //         this.QRBase64 = response["base64_qrcode"];
                  //       },
                  //       error: err => {
                  //         console.error("Error generating 2FA key:", err);
                  //       }
                  //     });
                  // } else {
                  //   console.log("ELSE");
                  //   this.twoFAState = true;
                  //   this.otpState = false;
                  //   this.isGenQRCode = false;
                  // }
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
            const returnUrl =
              this.route.snapshot.queryParams["returnUrl"] || "/d-api";
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: error => {
          console.error("Error during DSS login:", error);
          this.loading = false;
        }
      });
  }
  createUnsignedJWT(response) {
    const header = {
      alg: "none", // ไม่มีการเข้ารหัส
      typ: "JWT"
    };
    const updatedUser = {
      ...response.member, // คัดลอกค่าเดิมทั้งหมด
      username: response.member.name // เพิ่มคีย์ใหม่ชื่อ username และตั้งค่าจาก name
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

    // ตรวจสอบว่าพาสเวิร์ดตรงกัน
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
          confirmPassword: ""
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
        }
      }
    });
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

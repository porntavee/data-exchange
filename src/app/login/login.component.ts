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

  onLogin() {
    debugger
    this.authservice.settoken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyX2Vhc3QiLCJpZCI6MTg3LCJyb2xlIjoic3VwZXIgYWRtaW4iLCJ6b25lIjoxNiwiZXhwIjoxNzUzNTE3NDE5fQ.eEPjaMkew65T7QvpIhTzVVrGN4xFhjZfN-rvp831izA');
    const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/d-api";
    this.router.navigateByUrl(returnUrl);
    this.otpState = false;
    this.twoFAState = false;
    this.loginState = false;
    this.loading = false;

    // this.errorMessage = "";
    // if (this.form.invalid) return;
    // this.loading = true;
    // this.authservice
    //   .login(this.f.username.value, this.f.password.value)
    //   .subscribe({
    //     next: response => {
    //       this.loading = false;
    //       this.submitted = true;
    //       this.loginState = false;
          
    //       // let firstTimeLogin = "true";
    //       let isFirstTime = response["firstLogin"]
    //         ? response["firstLogin"]
    //         : "true";
    //       localStorage.setItem("temp", response["token"]);
    //       localStorage.setItem("firsttime", isFirstTime);
          
    //       if (isFirstTime === "true") {
    //         this.firstTimeLogin = true;
    //         const token = JSON.stringify(response);
    //       } else if (isFirstTime === "false") {
    //         this.otpState = false;
    //         this.twoFAState = true;
    //         this.isGenQRCode = false;
    //       }
    //       error: response => {
    //         if (response.error.status === 401) {
    //           this.messageService.add({
    //             severity: "error",
    //             summary: response.error.statusText,
    //             detail: response.error.error.detail,
    //             life: 3000
    //           });
    //           this.loading = false;
    //           this.submitted = false;
    //           this.loginState = true;
    //           this.otpState = false;
    //           this.twoFAState = false;
    //         }
    //       };
    //     }, error: error => {
    //       if (error.error.status == 401) {
    //         this.loading = false;
    //         this.messageService.add({
    //           severity: "error",
    //           summary: "Error",
    //           detail: error.error.error.detail
    //         });
    //       }
    //     }
    //   });
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
    if (this.otp_input != undefined || this.otp_input != ""){
    this.authservice
      .submitOTP(this.userName, this.phoneNumber, this.refCode, this.otp_input)
      .subscribe({
        next: response => {
          if (response.valid == true) {
            this.otpState = false;
            this.twoFAState = true;
            var firsttime = localStorage.getItem("firsttime");
            if (firsttime == "true"){
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
  countdownnumber:any = "(" + 180 + ")";
  countdown(){
    let seconds: number = 179;

  const makeIteration = (): void => {
    if (seconds > 0) {
        // console.log(seconds);
        this.countdownnumber = "(" +seconds + ")";
        setTimeout(makeIteration, 1000); // 1 second waiting
    }
    seconds -= 1;
    if (seconds == 1){
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

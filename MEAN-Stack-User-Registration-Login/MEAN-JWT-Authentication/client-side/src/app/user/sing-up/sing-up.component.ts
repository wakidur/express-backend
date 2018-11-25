import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { UserService } from "../../core/user.service";
import { User } from "../../core/userModel";

@Component({
  selector: "app-sing-up",
  templateUrl: "./sing-up.component.html",
  styleUrls: ["./sing-up.component.css"]
})
export class SingUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  public userServicemodel: User;
  constructor(private userService: UserService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => (this.showSucessMessage = false), 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join("<br/>");
        } else {
          this.serverErrorMessages =
            "Something went wrong.Please contact admin.";
        }

      }
    );
  }

  resetForm(form: NgForm) {
    this.userServicemodel = {
      fullName: "",
      email: "",
      password: ""
    };
    form.resetForm();
    this.serverErrorMessages = "";
  }
}

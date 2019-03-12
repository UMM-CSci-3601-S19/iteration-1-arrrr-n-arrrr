import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {User} from './user';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'add-user.component',
  templateUrl: 'add-user.component.html',
})

export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User }, private fb: FormBuilder) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_user_validation_messages = {

  };

  createForms() {

    // add ride form validations
    this.addUserForm = this.fb.group({
      // no restrictions on email for now
      email: new FormControl('email', Validators.compose([
        Validators.required,
      ])),

      username: new FormControl('username', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z0-9\\s.?!()\,\'\"]+'),
      ])),

      phone: new FormControl('phone', Validators.compose([
      ])),

      vehicle: new FormControl('vehicle', Validators.compose([
      ])),

    })

  }

  ngOnInit() {
    this.createForms();
  }

}

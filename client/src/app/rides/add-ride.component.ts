import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
})
export class AddRideComponent implements OnInit {

  addRideForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride }, private fb: FormBuilder) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_user_validation_messages = {
    'title': [
      {type: 'required', message: 'Title is required'},
      {type: 'minlength', message: 'Title must be at least 5 characters long'},
      {type: 'maxlength', message: 'Title cannot be more than 100 characters long'},
      {type: 'pattern', message: 'Title must contain only numbers, letters, punctuation or paranthesis'}
    ],

    'body': [
      {type: 'required', message: 'Body is required'}
    ],

    'destination' : [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 3 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 30 characters long'},
      {type: 'pattern', message: 'Destination must contain only numbers, letters, punctuation, or paranthesis'}
    ]
  };

  createForms() {

    // add ride form validations
    this.addRideForm = this.fb.group({
      // We allow alphanumeric input, with the option of punctuation, and limit the length for title.
      title: new FormControl('title', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern('[a-zA-Z0-9.?!(),\'\"]'),
        Validators.required
      ])),

      // Body is only required, with few restrictions.
      body: new FormControl('body', Validators.compose([
        Validators.required
      ])),

      // Body is only required, with few restrictions.
      destination: new FormControl('destination', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z0-9.?!(),\'\"]'),
      ])),

    })

  }

  ngOnInit() {
    this.createForms();
  }

}

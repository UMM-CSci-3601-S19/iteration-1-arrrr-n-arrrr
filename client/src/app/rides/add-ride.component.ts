import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Ride} from './ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";


@Component({
  selector: 'add-ride.component',
  styleUrls: ['./add-ride.component.css'],
  templateUrl: 'add-ride.component.html',
})
export class AddRideComponent implements OnInit {

  addRideForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ride: Ride }, private fb: FormBuilder) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_ride_validation_messages = {

    'notes': [
      {type: 'required', message: 'Notes are required'},
      {type: 'minlength', message: 'Notes must be at least 3 characters long'},
      {type: 'maxlength', message: 'Notes cannot be more than 1500 characters long'},
      {type: 'pattern', message: 'Notes must contain only numbers, letters, or punctuation'},
    ],

    'destination' : [
      {type: 'required', message: 'Destination is required'},
      {type: 'minlength', message: 'Destination must be at least 3 characters long'},
      {type: 'maxlength', message: 'Destination cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Destination must contain only numbers, letters, or punctuation'},
    ],

    'origin' : [
      {type: 'required', message: 'Origin is required'},
      {type: 'minlength', message: 'Origin must be at least 3 characters long'},
      {type: 'maxlength', message: 'Origin cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Origin must contain only numbers, letters, punctuation, or parenthesis'},
    ],

    'driving' : [
      {type: 'required', message: 'You must indicate whether you are the driver or not'},
    ]

  };

  createForms() {

    // add ride form validations
    this.addRideForm = this.fb.group({
      // Notes is only required, with few restrictions.
      notes: new FormControl('notes', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1500),
        Validators.pattern('^[\\S]+(\\s|\\s{1,2}[\\S]+|\\s{1,2}[\\S]+\\s)*$'),
      ])),

      destination: new FormControl('destination', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[\\S]+(\\s|\\s{1,2}[\\S]+|\\s{1,2}[\\S]+\\s)*$'),
      ])),

      origin: new FormControl('origin', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[\\S]+(\\s|\\s{1,2}[\\S]+|\\s{1,2}[\\S]+\\s)*$'),
      ])),

      driving: new FormControl('driving', Validators.compose([
        Validators.required
      ])),

    })

  }

  ngOnInit() {
    this.createForms();
  }
}

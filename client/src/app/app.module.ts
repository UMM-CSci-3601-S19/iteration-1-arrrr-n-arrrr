import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select'

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {RideComponent} from "./rides/ride.component";
import {RideListComponent} from "./rides/ride-list.component";
import {RideListService} from "./rides/ride-list.service";

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddRideComponent} from "./rides/add-ride.component";


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatRadioModule,
    MatSelectModule,
  ],

  declarations: [
    AppComponent,
    HomeComponent,
    RideListComponent,
    RideComponent,
    AddRideComponent
  ],
  providers: [
    RideListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

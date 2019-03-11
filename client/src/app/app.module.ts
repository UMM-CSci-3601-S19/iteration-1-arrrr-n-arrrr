import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatRadioModule} from '@angular/material/radio';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {UserComponent} from './usersOLD/user.component';
import {UserListComponent} from './usersOLD/user-list.component';
import {UserListService} from './usersOLD/user-list.service';

import {RideComponent} from "./rides/ride.component";
import {RideListComponent} from "./rides/ride-list.component";
import {RideListService} from "./rides/ride-list.service";

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './usersOLD/add-user.component';
import {AddRideComponent} from "./rides/add-ride.component";


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatRadioModule,
  ],

  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserComponent,
    AddUserComponent,
    RideListComponent,
    RideComponent,
    AddRideComponent
  ],
  providers: [
    UserListService,
    RideListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddUserComponent,
    AddRideComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

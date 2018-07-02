import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapsComponent } from './maps/maps.component';
import { MapService } from './map.service';
import { AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const config: SocketIoConfig = { url: 'http://localhost:8001',
//                               options: {transportOptions: {
//                                 polling: {
//                                   extraHeaders: {
//                                     'Access-Control-Allow-Origin': '*'
//                                   }
//                                 }
//                               }} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // SocketIoModule.forRoot(config),
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCqBHuW5V-U88gGRM84iSrsm8-95A5maPA'
    })
  ],
  providers: [MapService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }

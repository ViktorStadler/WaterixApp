import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgCalendarModule  } from 'ionic2-calendar';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from "@ionic-native/local-notifications";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EinstellungenPage } from '../pages/einstellungen/einstellungen';
import { HeutePage } from '../pages/heute/heute';
import { HinzufuegenPage } from '../pages/hinzufuegen/hinzufuegen';
import { KalenderPage } from '../pages/kalender/kalender';
import { ErinnerungService } from './erinnerung.service';
import {AchievementPage} from "../pages/achievement/achievement";
import {InformationPage} from "../pages/information/information";


import {WeatherProvider} from "../providers/weather-provider"
import { HttpModule} from '@angular/http';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EinstellungenPage,
    HeutePage,
    HinzufuegenPage,
    KalenderPage,
    AchievementPage,
    InformationPage

  ],
  imports: [
    HttpModule,
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EinstellungenPage,
    HeutePage,
    HinzufuegenPage,
    KalenderPage,
    AchievementPage,
    InformationPage
  ],
  providers: [
    WeatherProvider,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    ErinnerungService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'de-DE' },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

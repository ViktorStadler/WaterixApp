import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { EinstellungenPage } from '../pages/einstellungen/einstellungen';
import { HeutePage } from '../pages/heute/heute';
import { HinzufuegenPage } from '../pages/hinzufuegen/hinzufuegen';
import { KalenderPage } from '../pages/kalender/kalender';
import { InformationPage } from '../pages/information/information';
import { AchievementPage } from '../pages/achievement/achievement';
import {Storage} from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;



  rootPage: any = HomePage;
  //rootPage: any = InformationPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Kalender', component: KalenderPage },
      { title: 'Heute', component: HeutePage },
      { title: 'Hinzufügen', component: HinzufuegenPage },
      { title: 'Achievement', component: AchievementPage },
      { title: 'Information', component: InformationPage },
      { title: 'Einstellungen', component: EinstellungenPage }
    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openHome() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(HomePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}

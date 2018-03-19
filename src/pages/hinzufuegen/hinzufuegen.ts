import {LocalNotifications} from '@ionic-native/local-notifications';
import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';

import {HomePage} from '../home/home';
import {Drink} from '../../app/drink';


@Component({
  selector: 'page-hinzufuegen',
  templateUrl: 'hinzufuegen.html',
})
export class HinzufuegenPage {
  @ViewChild('myNav') nav: NavController
  homePage = HomePage;
  menge: number = 250;
  coffein: boolean = false;
  alcohol: number = 0;
  added: boolean = false;
  alkdisable: boolean = true;
  coffedisable: boolean = true;
  a_strong: number = 5;
  c_strong: number = 80;
  coffeecolor: string = "grey";
  alkcolor: string = "grey";
  erinnerung: boolean;
  time: Date;


  constructor(public navCtrl: NavController, public events: Events, private localNotifications: LocalNotifications, public storage: Storage, public platform: Platform, public alertCtrl: AlertController, public navParams: NavParams) {
  }


  /**
   * Ein Trink Event hinzufügen. drink Constructor wird aufgerufen und key wird generiert.
   * Holt über den key (Datum von Heute als String) den Storage. Wenn noch kein Array vorhanden ist erstellt
   * es ein Array.
   * Mit drinks.push(drink) wird das Trink Event in den Storage gespeichert. Push wird anstelle von einer
   * add Funktion verwendet.
   */
  addDrink() {
    console.log('DEBUG: addDrink(): menge:', this.menge);
    const drink = new Drink(Date.now(), this.menge, new Date(), this.alcohol);
    /*
    if (this.alcohol != 0) {
      //alert aussprechen
      let alert = this.alertCtrl.create({
        title: 'Alkohol Warnung',
        subTitle: 'Trinken von Alkohol erhöht deinen Wasserbedarf. Versuche neben alkoholischen Getränken immer ein Glas Wasser zu trinken.',
        buttons: ['Ok']
      });
      alert.present();
    };
    */

    const date = new Date();
    const key = date.toDateString();

    this.storage.get(key)
      .then((drinks: Drink[]) => {
        if (!drinks) {
          drinks = [];
        }

        if (Array.isArray(drinks)) {
          drinks.push(drink);
          this.storage.set(key, drinks);
          this.added = true;
          //Event 'drink:added' wird publisht. Wird in erinnerung.service.ts verwendet.
          this.events.publish('drink:added', new Date().getTime())
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //Wird verwendet um die Daten auf der Homepage nach dem Hinzufügen aktualisieren.
    this.navCtrl.setRoot(HomePage);
  }


addinfo(){

  let alert = this.alertCtrl.create({
    title: 'Info',
    subTitle: 'Füge hier getrunkenes hinzu. Achtung: alkoholische Getränke erhöhen deinen Wasserbedarf.',
    buttons: ['Ok']
  });
  alert.present();






}


}

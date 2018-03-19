/**
 * Install dependencies for ionic2 calender:
 * npm install -g typings
 * npm install --save intl
 * npm install ionic2-calendar --save
 *
 *
 */
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DatePipe} from '@angular/common';
import {Storage} from '@ionic/storage';

import {Drink} from '../../app/drink';

@Component({
  selector: 'page-kalender',
  templateUrl: 'kalender.html',
})
export class KalenderPage {
  drinks: Drink[] = [];
  calkey: string;
  dieserMonat;
  selectedDate;
  istHeute: boolean;
  getrunken: number;
  tagestrinkempfehlung: number;
  prozent: number;
  kopfweh: number;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    selectedDate: new Date(),
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public datepipe: DatePipe, public storage: Storage) {
    /**
     * Es muss schon im Construktor das erse mal auf den Storage zugegriffen werden. Da sonst nichts
     * in den Tagesdetails angezeigt wird. Diese werden erst geladen, wenn man den Tag im
     * Kalender ändernt. CalKey = CalenderKey ist der Key für den Kalenderspeicher. Setzt
     * sich aus dem Datum und String "CalKey" zusammen.
     * @type {string}
     */
    this.calkey = new Date().toDateString() + "CalKey";
    this.storage.ready().then(() => {
      this.storage.get(this.calkey).then((data) => {
        if (data != null) {
          //zuweisung aller variablen
          this.tagestrinkempfehlung = data.datedrinkempf;
          this.kopfweh = data.feeling;
        }
      })
    });
    this.prozent = ((this.getrunken / this.tagestrinkempfehlung) * 100);
    this.prozent = parseFloat("" + this.prozent.toFixed(2));

  }

  /**
   * Wechselt den Monat.
   * @param neuerMonat
   */
  onDieserMonatChanged(neuerMonat) {
    this.dieserMonat = neuerMonat;
  }

  /**
   * Aendert die Ansicht von Monat auf Tag oder Woche. Standartmässig ist der
   * Wert mit month belegt.
   * @param mode
   */
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  /**
   * Wird für das Zurückspringen auf Heute verwendet.
   */
  heute() {
    this.calendar.currentDate = new Date();
  }

  /**
   * Den im Kalender ausgewählten Tag im Format  'dd.MM.yyyy' berechnen.
   * Wird auch als key zum Speichern der täglichen Mengen verwendet.
   * @param date
   */
  onTimeSelected(ev) {
    this.selectedDate = ev.selectedTime;
  }

  /**
   * Holt sich die Liste mit allen Trinkevents von dem Tag der ausgewählt wurde.
   * @param event
   */
  onCurrentDateChanged(event: Date) {
    var heute = new Date();
    heute.setHours(0, 0, 0, 0);

    this.istHeute = heute.getTime() === event.getTime();

    const key = event.toDateString();
    this.storage.get(key)
      .then((drinks) => {
        this.drinks = drinks;
        if (this.drinks) {
          let getrunken = 0;

          for (let drink of this.drinks) {
            getrunken = getrunken + drink.menge;
          }
          this.getrunken = getrunken;

          let calkey: string = event.toDateString() + "CalKey";
          this.calkey = calkey;
          this.storage.ready().then(() => {
            this.storage.get(this.calkey).then((data) => {
              if (data != null) {
                //zuweisung aller variablen
                this.tagestrinkempfehlung = data.datedrinkempf;
                this.kopfweh = data.feeling;
              }
            })
          });
          this.prozent = ((this.getrunken / this.tagestrinkempfehlung) * 100);
          this.prozent = parseFloat("" + this.prozent.toFixed(2));
          return
        }
        //Default Werte wenn an diesem Tag keine Daten vorhanden sind.
        this.getrunken = 0;
        this.prozent = 0;
        this.kopfweh = 0;
      })
      .catch(console.log);
  }

}

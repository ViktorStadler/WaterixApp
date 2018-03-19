import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AlertController} from 'ionic-angular';
import {MenuController} from 'ionic-angular';

import {HomePage} from '../home/home';
import {Settings} from '../../app/settings';


@Component({
  selector: 'page-einstellungen',
  templateUrl: 'einstellungen.html',
})
export class EinstellungenPage {

  firstlogin: boolean = false;
  name: string;
  gender: string;
  age: number;
  weight: number;
  size: number;
  a_level: number = 0;
  empfehlung: number = 0;
  erinnerung: boolean;


  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public alertCtrl: AlertController, private menuCtrl: MenuController) {
    this.buildsettingspage();
  }

  get erinnerungOn() {
    return this.erinnerung;
  }

  set erinnerungOn(value) {
    this.erinnerung = value;
  }


  /**
   * Methode um wenn vorhanden, die Settingspage mit den bereits gespeicherten Variabeln zu befüllen.
   */
  buildsettingspage() {
    this.storage.ready().then(() => {
      this.storage.get("Settings").then((setstore) => {
        if (setstore != null) {
          //Zuweisung aller Variablen
          this.name = setstore.name;
          this.gender = setstore.gender;
          this.weight = setstore.weight;
          this.size = setstore.size;
          this.age = setstore.age;
          this.a_level = setstore.a_level;
          this.erinnerung = setstore.erinnerung;
          this.menuCtrl.enable(true);
          this.menuCtrl.swipeEnable(true);
        } else {
          this.menuCtrl.close();
          this.menuCtrl.enable(false);
          this.menuCtrl.swipeEnable(false);
        }
      })
    });
  }

  /**
   * Setzt die Userdaten, überprüft ob alle Felder ausgefüllt wurden und ruft die Speicherfunktion setstorage() auf.
   * Beim ersten Start des Apps wenn noch keine Userdaten vorhanden sind, kann man nicht über die Menuleite Navigieren. Man
   * kommt auch nicht auf die Home Seite. Erst wenn man alle Daten eingegeben hat und auf Speichern klickt werden die Seitennavigation freigegeben
   * und die HomePage als Root Seite gesetzt.
   */
  setUserdata() {
    if (this.a_level != null && this.name != null && this.gender != null && this.weight > 0 && this.size > 0 && this.age > 0) {
      this.menuCtrl.enable(true);
      this.menuCtrl.swipeEnable(true);
      var calkey = new Date().toDateString() + "CalKey";
      this.storage.remove(calkey);
      this.setstorage();
      this.navCtrl.setRoot(HomePage);
    } else {
      let alert = this.alertCtrl.create({
        title: 'ungültige Speicherung',
        subTitle: 'Bitte füllen Sie alle Einstellungen mit realistischen Werten aus',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  /**
   * Methode speichert alle Userdata in den Storage mit dem Key="calkey" und berechnet die allgemeine Trinkempfehlung.
   *
   */
  setstorage() {
    var alg_trinkemp = this.empfehlung;
    var age = this.age;//years
    var name = this.name;
    var size = this.size;//cm
    var weight = this.weight;//kg
    var gender = this.gender;
    var erinnerung = this.erinnerung;
    var a_level = this.a_level; // numerischer wert der wiederspiegelt wie oft man sport betreibt
    var empf = 0;
    var bmi = 0;
    var recbmi = 0;
    var recweight = 0;
    var recemp = 0;

    //berechnung der alg_trinkempf über die Eingegebnenen Daten:

    //alterabhängigkeit
    if (age >= 51) {
      empf = 30
    }
    ;
    if (age <= 50) {
      empf = 35
    }
    ;
    if (age <= 19) {
      empf = 40
    }
    ;
    if (age <= 13) {
      empf = 50
    }
    ;
    if (age <= 10) {
      empf = 60
    }
    ;
    if (age <= 7) {
      empf = 75
    }
    ;
    if (age <= 4) {
      empf = 95
    }
    ;

    //größengewichtsabhängigkeit + gewichtsabhängig:
    bmi = weight / ((size / 100) * (size / 100));

    //if(bmi>=18.5&&bmi<=25){};//normal kein einfluss
    if (bmi >= 25) {
      recbmi = 25;
      recweight = recbmi * ((size / 100) * (size / 100));
      recemp = (empf * recweight);
      empf = (empf * weight);
      empf = (empf + recemp) / 2;
    } else {
      if (bmi <= 18.5) {
        recbmi = 18.5;
        recweight = recbmi * ((size / 100) * (size / 100));
        recemp = (empf * recweight);
        empf = (empf * weight);
        empf = (empf + recemp) / 2;
      } else {
        empf = (empf * weight);
      }
    }
    alg_trinkemp = empf;
    //male/female; bei female kleiner abzug
    if (gender == "Frau") {
      alg_trinkemp = empf - (empf * 5 / 100);
    }


    if (alg_trinkemp > 6000) {
      alg_trinkemp = 6000;
    }

    if (erinnerung != true) {
      erinnerung = false;
    }
    ;
    alg_trinkemp=parseFloat("" + ((alg_trinkemp)).toFixed(0));
    var setstore = new Settings(name, gender, age, weight, size, a_level, alg_trinkemp, erinnerung);
    console.log(setstore);
    this.storage.set("Settings", setstore);
  }

  aktivinfo(){

    //alert aussprechen
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: 'Wenn Erinnerungen aktiviert sind und 2 Stunden nichts hinzugefügt wurde, kommt eine Trinkerinnerung. Die Erinnerungsfunktion kann jederzeit unter Einstellungen deaktiviert werden.',
      buttons: ['Ok']
    });
    alert.present();

  }


//hier muss der key des  tages noch gelöscht werden
}

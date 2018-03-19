/**
 * ionic plugin add --save de.appplant.cordova.plugin.local-notification
 * npm install --save @ionic-native/local-notifications
 * ggf: $npm install moment --save
 */


import {LocalNotifications} from '@ionic-native/local-notifications';
import {Component} from '@angular/core';
import {NavController, NavParams, Platform, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';


import {HinzufuegenPage} from '../hinzufuegen/hinzufuegen';
import {HeutePage} from '../heute/heute';
import {EinstellungenPage} from '../einstellungen/einstellungen';
import {CalKey} from '../../app/calkey';
import {Drink} from '../../app/drink';
import {ErinnerungService} from '../../app/erinnerung.service'
import {ToastController}  from 'ionic-angular';
import {Achievements} from "../../app/achievements";
import { WeatherProvider } from "../../providers/weather-provider";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  hinzufuegenPage = HinzufuegenPage;
  heutePage = HeutePage;
  public heutegetrunken: number; //wieviel huetegetrunken
  public trinkempfehlung: number; // wieviel zu trinken
  public prozentgetrunken: number; //prozent
  today: string = new Date().toDateString(); //datum für schlüssel
  calkey: string = this.today + "CalKey"; //zweiter schlüssel
  alevel: number = 0; //aktivitätslevel
  public entries: number = 0; //einträge
  sntrinkempf: number; //beim berechnen benötigt
  drinks: Drink[] = [];
  erinnerung: boolean = false; //notifications
  menge: any;
  alcomenge: any = 0; //alkoholmenge in mL
  notifications: any[] = [];
  feeling: number = 0; //kopfweh?
  public thud: string = "grey";//colors for the feeling buttons
  public thup: string = "grey";
  public selectOptions;
  public selectOptions2;
  public difference: String = "0 mL";
  day2: String;
  day3: String;
  day4: String;
  day5: String;
  chainday: number;
  public once: number = 0;
  public temp:any = 0;
  public tempsel:any="wien";


  constructor(public navCtrl: NavController, private erinnerungsService: ErinnerungService, public events: Events, private localNotifications: LocalNotifications, public storage: Storage, public platform: Platform, public alertCtrl: AlertController, public navParams: NavParams, private toastCtrl: ToastController, public weatherprov: WeatherProvider) {
    //this.deletesettings();


    if(this.once<2){  this.weatherprov.settemp();}

// der Titel wäre in der HTML zu lange; soll aber beim öffnen erscheinen
    this.selectOptions = {
      title: 'Heutiges Aktivitätslevel',
      subTitle: 'Ändere die Aktivität des Tages',
      mode: 'md'
    };
    this.selectOptions2 = {
      title: 'Stadtwahl zur Temperaturbestimmung',
      subTitle: 'Derzeit wird leider nur Wien unterstützt',
      mode: 'md'
    };

//Im Speicher nachsehen, ob Settings gespeichert sind (von der Einstellungen seite)

    this.getstorage();


  }


  getstorage() {
    this.storage.ready().then(() => {
      this.storage.get("Settings").then((setstore) => {
        if (setstore != null) {

          this.erinnerung = setstore.erinnerung;
          this.updatePage(setstore);
        } else {
          //keine settings sind vorhanden es müssen neue eingetragen werden
          //es müssen immer settings vorhanden sein; daher wird man wieder zurückgepusht zum Einstellungsmenü
          this.navCtrl.setRoot(EinstellungenPage);
        }
      })
    });
  }


  updatePage(storeobject) {
    this.alcomenge = 0;
    this.menge = 0;
    this.trinkempfehlung = storeobject.trinkempfehlung;


    //abfrage des speziellen keys für heute
    //es werden im prinzip pro Tag 2 Keys gespeichert; in dem einen werden berechnungsinfos gespeichert und für den kalendar
    // in dem anderen alle getränkeeinträge etc.
    // hier der mit den getränkeeinträgen



    this.storage.get(this.today).then((data) => {

      if (data != null) {
        this.entries = data.length;
//wieviele einträge gemacht wurden

        for (let item of data) {
//durchgehen aller einträge und berechnung der gesamtmenge an getrunkenem
          this.menge = this.menge + (item.menge);


          if (item.alcohol != 0) {
//ein gläschen Wasser soll zum Bier gut sein; daher soll bei uns alkohol die vorgeschlagene Trinkmenge um ein gewisses Maß erhöhen
            this.alcomenge = this.alcomenge + ((item.alcohol * item.menge) / 100) * 6;

          }


        }

        this.trinkempfehlung = parseFloat("" + ((this.trinkempfehlung)).toFixed(0));
//kommastellen weg
      }

      this.heuteGetrunken(this.menge);
    });

    this.storage.get(this.calkey).then((data) => {

      if (data != null) {
        // einberechnung des aktivitätslevel des Tages


        this.alevel = data.dateactive;


      } else {
        //es muss noch einer gesettet werden

        if (this.trinkempfehlung != null && this.alevel != null) {


          this.alevel = storeobject.a_level;
          this.sntrinkempf = this.trinkempfehlung;
          this.trinkempfehlung = this.trinkempfehlung + this.alcomenge;
          this.trinkempfehlung = parseFloat("" + ((this.trinkempfehlung)).toFixed(0));
          this.temp=this.weatherprov.temp - 273.15;




          if (this.trinkempfehlung > 6000) {
            this.trinkempfehlung = 6000
          }
          ;


          //für die individuellen sachen die beiuns gespeichert werden, benötigen wir eine eigene speicherung
          //man kann zB auch individuell jeden tag das aktivitätslevel setzen







          var newcalkey = new CalKey(this.trinkempfehlung, this.alevel, this.sntrinkempf, this.feeling, this.temp);
console.log(newcalkey);

          this.storage.ready().then(() => {
            this.storage.set(this.calkey, newcalkey);
          });
        }
      }


      this.storage.ready().then(() => {


        this.storage.get(this.calkey).then((ndata) => {

          if (ndata != null) {
            //es ist bereits ein daylykey gesetzt
            this.temp=ndata.temp;
            this.feeling = ndata.feeling;
            if (this.feeling == 1) {
              this.thup = "primary"
            }
            if (this.feeling == 2) {
              this.thud = "primary"
            }

            if (this.alevel == 0) {
              this.trinkempfehlung = ndata.calcempf + 0 + this.alcomenge;
            }
            if (this.alevel == 1) {
              this.trinkempfehlung = ndata.calcempf + 72 + this.alcomenge;
            }
            if (this.alevel == 2) {
              this.trinkempfehlung = ndata.calcempf + 400 + this.alcomenge;
            }
            if (this.alevel == 3) {
              this.trinkempfehlung = ndata.calcempf + 1000 + this.alcomenge;
            }
            if (this.alevel == 4) {
              this.trinkempfehlung = ndata.calcempf + 2000 + this.alcomenge;
            }
            //einberechnung von alkoholischen getränken:

            // console.log(this.trinkempfehlung);
//noch den key updaten?!

            this.trinkempfehlung = parseFloat("" + ((this.trinkempfehlung)).toFixed(0));

            //einberechnung der temperatur ab einem wert von 25°C
            console.log(this.temp);
            if(this.temp!=0){

              if(this.temp>=25&&this.temp<30){
                this.trinkempfehlung= parseFloat("" + ((this.trinkempfehlung+this.trinkempfehlung*7/100)).toFixed(0));
              }
              if(this.temp>=30){
                this.trinkempfehlung= parseFloat("" + ((this.trinkempfehlung+this.trinkempfehlung*12/100)).toFixed(0)); }
            }




            ndata.datedrinkempf = this.trinkempfehlung;

            this.storage.remove(this.calkey);
            this.storage.set(this.calkey, ndata);


          } else {

//wenn man aus den einstellungen kommt
            if (this.alevel == 0) {
              this.trinkempfehlung = this.sntrinkempf + 0 + this.alcomenge;
            }
            if (this.alevel == 1) {
              this.trinkempfehlung = this.sntrinkempf + 72 + this.alcomenge;
            }
            if (this.alevel == 2) {
              this.trinkempfehlung = this.sntrinkempf + 400 + this.alcomenge;
            }
            if (this.alevel == 3) {
              this.trinkempfehlung = this.sntrinkempf + 1000 + this.alcomenge;
            }
            if (this.alevel == 4) {
              this.trinkempfehlung = this.sntrinkempf + 2000 + this.alcomenge;
            }


            this.trinkempfehlung = parseFloat("" + ((this.trinkempfehlung)).toFixed(0));

            //einberechnung der temperatur ab einem wert von 25°C
            console.log(this.temp);
            if(this.temp!=0){

              if(this.temp>=25&&this.temp<30){
                this.trinkempfehlung= parseFloat("" + ((this.trinkempfehlung+this.trinkempfehlung*7/100)).toFixed(0));
              }
              if(this.temp>=30){
                this.trinkempfehlung= parseFloat("" + ((this.trinkempfehlung+this.trinkempfehlung*12/100)).toFixed(0)); }
            }


          }
          if (this.trinkempfehlung >= 6000) {
            this.trinkempfehlung = 6000
          }
          ;
        });


      });
    });

  }

  public heuteGetrunken(menge): void {


    this.heutegetrunken = menge;
    this.prozentgetrunken = parseFloat("" + ((menge / this.trinkempfehlung) * 100).toFixed(0));
    //aufrufen einer motivationsfunktion
    this.once = this.once + 1;
    this.motivate(this.once);

    var diff = this.trinkempfehlung - menge;
    //berechnung der Differenz und achievements setzen
    if (diff <= 0) {
      diff = 0;
    }


    if(this.once==2){
    var setachievement1 = false;
    if (this.prozentgetrunken >=99) {
      diff = 0;
      setachievement1 = true;
      //einmal 100% erfüllt das erste achievement
    }
//test
//überprüfen der days in a row;

    this.storage.keys().then((setkeys) => {

      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.day2 = yesterday.toDateString();
      yesterday.setDate(yesterday.getDate() - 1);
      this.day3 = yesterday.toDateString();
      yesterday.setDate(yesterday.getDate() - 1);
      this.day4 = yesterday.toDateString();
      yesterday.setDate(yesterday.getDate() - 1);
      this.day5 = yesterday.toDateString();

      this.chainday = 0;

      for (let item of setkeys) {
//komischa schas

        if (this.day2 == item) {
          this.chainday = this.chainday + 10;
        }

        if (this.day3 == item) {
          this.chainday = this.chainday + 100;
        }

        if (this.day4 == item) {
          this.chainday = this.chainday + 1000;
        }


        if (this.day5 == item) {
          this.chainday = this.chainday + 10000;
        }

// wenn 11110 allse 5 tage geloggt; einfachee möglichkeit zu sehen welcher tag nicht geloggt
        //ein tag nicht geloogt zB 11100 wäre eine 3er kette
      }
// i zeigt wieiviele Tage in der vergangenheit bereits etwas eingelogt wurde

//hier dann wirklich setzen
      this.storage.ready().then(() => {
        this.storage.get("Achievements").then((achieved) => {
          if (achieved != null) {
            console.log("test");

            if (achieved.percentagewarrior == false && setachievement1==true) {
              achieved.percentagewarrior = setachievement1;
              let toast = this.toastCtrl.create({
                message: "PERCENTAGEWARRIOR Unlocked",
                duration: 4000,
                position: 'top'
              })
              toast.present();


            }
            if (achieved.chaindays < this.chainday) {
              achieved.chaindays = this.chainday;
              let toast = this.toastCtrl.create({
                message: "Achievement Unlocked",
                duration: 4000,
                position: 'top'
              })
              toast.present();


            }
            this.storage.set("Achievements", achieved);
            //alles setzen ob bereits achieved oder noch nicht
            console.log(achieved);

          } else {


            var newachieve = new Achievements(setachievement1, this.chainday);
            this.storage.set("Achievements", newachieve);
console.log(newachieve);
console.log("hier");
          }

        })
      });
    });
}

    this.difference = diff + " mL";



  }

  deletesettings() {
    this.storage.remove("Settings");
    this.storage.remove(this.calkey);

  }


  activeChange() {



    //wird ausgeführt wenn die variablen geändert wurden
    this.storage.get(this.calkey).then((data) => {
      if (data != null) {
        // einberechnung des aktivitätslevel des Tages


        if (data.dateactive != this.alevel) {

          //der inhalt muss geupdatet werden

          data.dateactive = this.alevel;


          if (this.alevel == 0) {
            this.trinkempfehlung = data.calcempf + 0 + this.alcomenge;
          }
          if (this.alevel == 1) {
            this.trinkempfehlung = data.calcempf + 72 + this.alcomenge;
          }
          if (this.alevel == 2) {
            this.trinkempfehlung = data.calcempf + 400 + this.alcomenge;
          }
          if (this.alevel == 3) {
            this.trinkempfehlung = data.calcempf + 1000 + this.alcomenge;
          }
          if (this.alevel == 4) {
            this.trinkempfehlung = data.calcempf + 2000 + this.alcomenge;
          }

          if (this.trinkempfehlung > 6000) {
            this.trinkempfehlung = 6000;
          }

          data.datedrinkempf = this.trinkempfehlung;
          //console.log(data);
          this.storage.remove(this.calkey);
          if (this.trinkempfehlung != null && this.alevel != null) {
            // console.log(data);

            this.storage.set(this.calkey, data);
          }
        }

        this.heuteGetrunken(this.menge);
      } else {


      }


    });


  }

  DrEich() {
//beim klick auf waterix
    console.log(this.entries);
    if (this.entries == 0) {
      let toast = this.toastCtrl.create({
        message: "Red - This isn't the time to use that!",
        duration: 3000,
        position: 'middle'
      })
      toast.present();
    }
    if (this.entries == 1|| this.entries ==2) {
      let toast = this.toastCtrl.create({
        message: "Keep the Entries Coming - Eight glasses of water a day keeps the doctor away!",
        duration: 3000,
        position: 'middle'
      })
      toast.present();
    }


    if (this.entries >= 3) {
      let toast = this.toastCtrl.create({
        message: "WATERCHAMPON! Weiter so ;)",
        duration: 3000,
        position: 'middle'
      })
      toast.present();
    }


  }


  Feelgood() {
    //beim klick auf thumpsup; ändern der farben
    this.storage.get(this.calkey).then((data) => {
      if (data != null) {
        this.feeling = data.feeling;
      }


      if (this.feeling == 0 || this.feeling == 1) {


      } else {
      }
      this.thup = "primary"
      this.thud = "grey"
      this.feeling = 1;
      //setzen des speichers
      data.feeling = this.feeling;
      this.storage.set(this.calkey, data);


    });
  }

  Feelbad() {
    //klick auf thumpsdown ändern der farben
    console.log(this.feeling);
    this.storage.get(this.calkey).then((data) => {
      if (data != null) {
        this.feeling = data.feeling;
        console.log(this.feeling);
      }
      if (this.feeling == 0 || this.feeling == 1) {


      } else {
      }


      this.thup = "grey"
      this.thud = "primary"
      this.feeling = 2;
      data.feeling = this.feeling;
      this.storage.set(this.calkey, data);

    });
  }

  motivate(once) {

    //mal was testen
    if (once == 2) {
      if (this.alcomenge != 0) {
        let toast = this.toastCtrl.create({
          message: "Deine Trinkempfehlung wurde aufgrund von Alkohol erhöht - Trink ein Glas Wasser dazu :)",
          duration: 2000,
          position: 'top'
        })
        toast.present();
      }

      if (this.prozentgetrunken >= 20 && this.prozentgetrunken <= 30) {
        let toast = this.toastCtrl.create({
          message: "Way to go!",
          duration: 2000,
          position: 'middle'
        })
        toast.present();
      }
      if (this.prozentgetrunken >= 50 && this.prozentgetrunken <= 70) {
        let toast = this.toastCtrl.create({
          message: "Schon die Hälfte woop woop",
          duration: 2000,
          position: 'middle'
        })
        toast.present();
      }
      if (this.prozentgetrunken >= 70 && this.prozentgetrunken <= 90) {
        let toast = this.toastCtrl.create({
          message: "Gluck Gluck Gluck Lecker Wasser",
          duration: 2000,
          position: 'middle'
        })
        toast.present();
      }
      if (this.prozentgetrunken >= 100) {
        let toast = this.toastCtrl.create({
          message: "Ahhh - Genug getrunken",
          duration: 2000,
          position: 'middle'
        })
        toast.present();
      }


    }


  }

  aktivinfo(){

      //alert aussprechen
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Unter Aktivität kannst du eine individuelle Tagesaktivität festlegen.',
        buttons: ['Ok']
      });
      alert.present();




  }

tempChange(){


if(this.tempsel=="wien"){
  //zur berechnung nehmen


}

}


}



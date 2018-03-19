import {LocalNotifications} from '@ionic-native/local-notifications';
import { Events } from 'ionic-angular';
import {Platform, AlertController} from 'ionic-angular';
import {Injectable} from "@angular/core";
import {Storage} from '@ionic/storage';

@Injectable()
export class ErinnerungService {
  drinktime: Number = (new Date().getTime());
  erinnerung: boolean;
  notifications: any[] = [];

  constructor(private localNotifications: LocalNotifications, public events: Events, public storage: Storage, public platform: Platform, public alertCtrl: AlertController) {
    //Schaut im Storage nach ob die Person eine Erinnerung möchte.
    this.storage.ready().then(() => {
      this.storage.get("Settings").then((setstore) => {
        if (setstore != null) {
          //zuweisung aller notwendigen Variabeln
          this.erinnerung = setstore.erinnerung;
        }
      })
    });

    /**
     * Timer der alle 60Sekunden überprüft ob die Drinktime(Zeit des letzten hinzugefügten Drinks) kleiner ist als
     * 120min vor jetzt und ob eine Erinnerung gewünscht wurde.
     */
    setInterval(() => {
      this.storage.ready().then(() => {
        this.storage.get("Settings").then((setstore) => {
          if (setstore != null) {
            //zuweisung aller notwendigen Variabeln
            this.erinnerung = setstore.erinnerung;
          }
        })
      });
      // Check if last drinktime < new Date().getTime() - x*1000 (x=7200 120min)
      if (((this.drinktime) < (new Date().getTime()- (7200*1000))) && this.erinnerung==true) {
        // this.localNotifications.event();
        this.localNotifications.schedule({
          title: "Trink Erinnerung",
          text: "Sie haben seit 120 Minuten nichts getrunken",
          at: new Date(new Date().getTime())
        });
      }
    }, 1000 * 60);

    /**
     * Event Subscriber der die neue Drinktime von der hinzufügen.ts erhält und auf die
     * lokale drinktime setzt.
     */
    this.events.subscribe('drink:added', (drinktime) => {
      // time argument passed in `events.publish(time)
      console.log('Drink added at:', drinktime);
      this.drinktime = drinktime;

    });
  }

}

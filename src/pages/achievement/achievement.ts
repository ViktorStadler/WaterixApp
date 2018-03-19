/**
 * Install dependencies for ionic2 calender:
 * npm install -g typings
 * npm install --save intl
 * npm install ionic2-calendar --save
 *
 *
 */
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-achievement',
  templateUrl: 'achievement.html',
})
export class AchievementPage {
  public chaindays: number;
  public percentagewarrior: string;
  public chaincolor1: string = "grey";
  public chaincolor2: string = "grey";
  public chaincolor3: string = "grey";
  public percentagecolor: string = "grey";

  constructor(public navCtrl: NavController, public storage: Storage) {


    this.getAchievements();

  }

  getAchievements() {
    this.storage.ready().then(() => {
      this.storage.get("Achievements").then((achieved) => {
        if (achieved != null) {
// es ist bereits etwas im speicher
          this.chaindays = achieved.chaindays;


//im Prinzip funktioniert es auf binärer Ebene; man könnte das ganze vermutlich schöner ausprogrammieren, aus zeitmangel einfach mal so
          if (this.chaindays == 11110) {
            this.chaindays = 4
          }
          ;//es wurden 4 tage etwas eingeloggt
          if (this.chaindays == 1110 || this.chaindays == 11100) {
            this.chaindays = 3;
          }
          if (this.chaindays == 110 || this.chaindays == 11000 || this.chaindays == 1100) {
            this.chaindays = 2;
          }
          if(this.chaindays==10){this.chaindays=1;}

          this.percentagewarrior = achieved.percentagewarrior;

          this.setAchievementcolors();

        } else {
//es wurden noch keine Achievements gesetzt von der homeseite (unwahrscheinlich)
this.chaindays=0;

        }
      })
    });

  }


  setAchievementcolors() {
    console.log(this.chaindays);
    if (this.chaindays >= 2) {
      this.chaincolor1 = "secondary"
    }
    if (this.chaindays >= 3) {
      this.chaincolor2 = "secondary"
    }
    if (this.chaindays >= 4) {
      this.chaincolor3 = "secondary"
    }
    if (this.percentagewarrior) {
      this.percentagecolor = "secondary"
    }


  }


}

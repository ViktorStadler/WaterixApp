import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {Drink} from '../../app/drink';


@Component({
  selector: 'page-heute',
  templateUrl: 'heute.html',
})
export class HeutePage {
  drinks: Drink[] = [];
  today: string = new Date().toDateString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Heute');

    /**
     * Beim laden der Seite wird das Array mit allen Trink Events geladen.
     */
    this.storage.get(this.today)
      .then((drinks: Drink[]) => {
        this.drinks = drinks;
      })
      .catch(console.log);
  }

  /**
   * Um einen Trink Event zu löschen wird das Array vom heutigen Tag genommen und alle
   * ausser das was in drinks.filter über die id definiert wurde in reduced drinks gespeichert.
   * @param id Zeitstempel des Trink Events damit man weiss was gelöscht werden soll
   */
  removeDrink(id: number) {
    this.storage.get(this.today)
      .then((drinks: Drink[]) => {
        console.log('DEBUG: old drinks:', drinks);
        const reducedDrinks = drinks.filter(drink => drink.id !== id);
        console.log('DEBUG: reduced drinks:', reducedDrinks);
        this.storage.set(this.today, reducedDrinks);
        this.drinks = reducedDrinks;
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      })
      .catch(console.log)
  }

  /**
   * Button um alle Drinks von einem Tag gleich zu löschen.
   */
  removeAllDrinks() {
    this.storage.remove(this.today);
    this.drinks = [];
  }
}

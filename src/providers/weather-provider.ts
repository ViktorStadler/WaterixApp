import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the BikeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/



@Injectable()
export class WeatherProvider {

calcbike: any;

public temp:any;



 constructor(public http: Http) {
}

//Funktion erkennt über die übermittelte Variable welche url verwendet werden muss und durchsucht dann website
settemp(){
  console.log("huibu");

  var url = 'http://api.openweathermap.org/data/2.5/weather?id=2761367&APPID=7c9f2d0f8d558a18b2b8cc9e54f19d73'
  this.http.get(url).map(res=>res.json()).subscribe(data=>{
  this.temp=data.main.temp_max;



});


 }

}

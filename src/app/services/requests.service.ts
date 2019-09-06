import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  write;
  firereq = firebase.database().ref('request');
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,) { }

  addRequest(item){
    this.write=this.afs.collection<any>('request');

    this.write.add(item).then(()=>{
      // alert(alert);
      console.log("added")
    });
  }

   getMyRequest(){
   return  this.afs.collection('request').snapshotChanges();
  }

  
}

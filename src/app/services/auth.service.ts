import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as firebase from "firebase/app"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,) {
    afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.nav.navigateRoot("home/chats");
      }else{
        this.nav.navigateRoot("");
      }
    })
   }
    async signup(email: string , password : string){
      await this.afAuth.auth.createUserWithEmailAndPassword(email,password).then((success)=>{

      console.log(success);
    }).catch((error)=>{
     console.log(error)
    })
  }

  async login(email: string , password : string){
    await this.afAuth.auth.signInWithEmailAndPassword(email,password).then(()=>{
     
      this.nav.navigateRoot('home')
    }).catch(err=>{
      alert(err.message)
    })
  }
  
  getUID(): string {
		return this.afAuth.auth.currentUser.uid;
	}
    
  async  Anonymus(): Promise <firebase.auth.UserCredential> {
    return await firebase.auth().signInAnonymously();
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';
import * as firestore from 'firebase';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email:string;
  pwd:string;
  public loginForm: FormGroup;
  constructor(public authService: AuthService,public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController, private alertCtrl : AlertController) {
    this.loginForm = new FormGroup({
      email:new FormControl(),
      pwd: new FormControl()
    })
   }

  ngOnInit() {
  }
  login(){
    this.authService.login(this.loginForm.value["email"], this.loginForm.value["pwd"]).then((success)=>{
      console.log("success");
    }).catch((error)=>{
      this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Please Enter Password or Email ',
        buttons: ['Ok']}).then(
        alert=> alert.present()
      );
    })
  }

  goto_singup(){
    console.log("jj")
    this.nav.navigateForward('signup')
  }
  AnonymusLogin(){
    this.authService.Anonymus().then(()=>{
      this.afAuth.auth.currentUser.updateProfile({
        displayName:"anonymus",
        photoURL:''
      })
      
       this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).set({
        displayName:"anonymus",   
        uid: this.afAuth.auth.currentUser.uid,
        Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
        photoURL:''})
    })
  }
}

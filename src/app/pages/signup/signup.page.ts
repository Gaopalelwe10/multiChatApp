import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import * as firestore from 'firebase';
import { EmailValidator, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  // email:string;
  // pwd:string;
  // username:string;


  public signupForm: FormGroup;
  constructor(public authService: AuthService,public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,private alertCtrl : AlertController) {
    this.signupForm = new FormGroup({
      email:new FormControl(),
      pwd: new FormControl(),
      username: new FormControl(),
    })
   }

  ngOnInit() {
  }

   signup() {
     this.authService.signup(this.signupForm.value["email"], this.signupForm.value["pwd"] ).then(()=>{

      this.afAuth.auth.currentUser.updateProfile({
        displayName:this.signupForm.value["username"],
        photoURL:''
      })
      
       this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).set({
        displayName:this.signupForm.value["username"],   
        uid: this.afAuth.auth.currentUser.uid,
        Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
        Email:this.signupForm.value["email"],
        photoURL:''
      }).then(()=>{
        this.nav.navigateRoot('home');
      }).catch(err=>{
        alert(err.message)
      })
    }).catch((error)=>{
      this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Please Enter all the required details ',
        buttons: ['Ok']}).then(
        alert=> alert.present()
      );
    })
  }
}

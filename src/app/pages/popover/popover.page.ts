import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,private popoverController: PopoverController ) { }

  ngOnInit() {
  }
  logout(){
    this.afAuth.auth.signOut().then((success)=>{
      console.log("success");
     this.DismissClick()
      this.nav.navigateRoot("home");
    }).catch((error)=>{
      console.log(error)
    })
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }
}

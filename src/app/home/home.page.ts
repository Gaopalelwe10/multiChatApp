import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, PopoverController, IonTabs } from '@ionic/angular';
import { PopoverPage } from '../pages/popover/popover.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  {

  constructor(public authService: AuthService,public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,private popoverController: PopoverController) {

  }
  logout(){
    this.afAuth.auth.signOut().then((success)=>{
      console.log(success);
      console.log("success");
      this.nav.navigateRoot("home");
    }).catch((error)=>{
      console.log(error)
    })
 
  }

  adduser(){
    this.nav.navigateRoot("users");
  }

  async openPopover(ev: any){
    const popover= await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}

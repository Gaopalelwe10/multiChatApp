import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';

export interface Item{
  key?:string;
  sender :string;
  friend :string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users:any[];
  loadedusers:any[];
  request:any;
  item = {
    sender :"",
    friend :"",
  }
  currentuser:any;
  sender :any;
  friend :any;
  ItemsList;
  check:number=0;
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController,private authService: AuthService, private requestService: RequestsService, private alertCtrl : AlertController) { 
    this.currentuser= this.authService.getUID();
    this.request=this.afs.collection('request').snapshotChanges().subscribe(data=>{
      this.ItemsList=data.map(e =>{
        return{
          key: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Item;
      });
      // console.log(this.ItemsList);
    })
  }

  ngOnInit() {
    this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges().subscribe((users)=>{
      this.users=users;
      this.loadedusers=users;

    });
    this.currentuser= this.afAuth.auth.currentUser.uid;
  }

  initializeItems(): void {
    this.users = this.loadedusers;
  }

  filterList(evt) {
    this.initializeItems();
  
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.users = this.users.filter(currentGoal => {
      if (currentGoal.displayName && searchTerm) {
        if (currentGoal.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  sendreq(user){
    this.currentuser= this.afAuth.auth.currentUser.uid
    this.item.sender=this.currentuser;
    this.item.friend=user.uid;
    console.log("sender ",this.currentuser);
    console.log("friend ", user.uid);

      for (let i of this.ItemsList) {
  
        if( ((i.sender === this.currentuser) && (i.friend === user.uid)) || ((i.friend == this.currentuser) && (i.sender == user.uid))){           
            this.check=1;
        }
     
      }
        console.log("check " +this.check)
    if(this.check == 0){
      this.requestService.addRequest(this.item);
      this.alertCtrl.create({
        subHeader: 'Added to your chat List',
        buttons: ['Ok']}).then(
        alert=> alert.present()
      );
    }
    if(this.check == 1){
        this.alertCtrl.create({
          subHeader: 'You Are Already Friends',
          buttons: ['Ok']}).then(
          alert=> alert.present()
        );
        this.check=0;
    } 
  }

  getMy(){
    this.requestService.getMyRequest()
  }
}

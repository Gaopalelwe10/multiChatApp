import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  users: any;
  requestUsers: any;
  uid;
  constructor(public authService: AuthService,public afs: AngularFirestore, public afAuth: AngularFireAuth, public nav : NavController, private requestService: RequestsService, private route: Router) { 
    this.requestUsers=this.afs.collection('request').valueChanges();
    this.users=this.afs.collection('users').valueChanges()
    this.uid=this.afAuth.auth.currentUser.uid;

    this.requestService.getMyRequest().subscribe((data)=>{
     
    })
  }

  ngOnInit() {
  }

  message(user){
    this.route.navigate(['/message'], { queryParams: { user: user.uid , displayName: user.displayName}});
    console.log(user.uid)
  }
}

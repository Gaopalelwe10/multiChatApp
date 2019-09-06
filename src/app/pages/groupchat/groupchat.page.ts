import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IonContent, NavController, PopoverController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import * as firestore from 'firebase';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.page.html',
  styleUrls: ['./groupchat.page.scss'],
})
export class GroupchatPage implements OnInit {
  @ViewChild('scrollArea', {static: false}) content: IonContent;
  text:string;
  chatRef:any;
  uid: string;
  skel:boolean;

   nativepath: any;
   firestore = firebase.storage();

   uploadPercent: Observable<number>;
   downloadURL: any;
   uniqkey :any;
   today :any = new Date() ;
   date = this.today.getDate()+""+(this.today.getMonth()+1)+""+this.today.getFullYear();
   time = this.today.getHours() +""+ this.today.getMinutes();
   dateTime = this.date+""+this.time;

  constructor(public fs: AngularFirestore, 
    public af: AngularFireAuth, 
    private socialSharing: SocialSharing,
    private storage: AngularFireStorage,
    public authService: AuthService,
    public afs: AngularFirestore, 
    public afAuth: AngularFireAuth, 
    ) {
    // this.uid=localStorage.getItem('userid');
    this.uid=this.af.auth.currentUser.uid;
    this.chatRef=this.fs.collection('chatRoom', ref=>ref.orderBy('Timestamp')).valueChanges();
    // if(this.content.ionScroll) this.content.scrollToBottom(0);
    this.scorllTo();
    
  }

  ngOnInit() {
    this.scorllTo();
  }

  ionViewWillEnter() {
    this.content.scrollToBottom();
    // this.scorllTo();
  }

  scorllTo(){
    setTimeout(()=>{
      // this.skel=true;
      this.content.scrollToBottom();
    },100);
    // this.skel=false;
  }

  send(){
    if(this.text !=''){
      this.fs.collection('chatRoom').add({
        displayName:this.af.auth.currentUser.displayName,
        Message:this.text,
        picUpload:'',
        Userid: this.af.auth.currentUser.uid,
        Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
      });
      this.content.scrollToBottom();
      this.text="";
      
    }
  }

  share(chat){
    this.socialSharing.share(chat.Message, chat.picUpload).then(()=>{

    }).catch(()=>{

    })
  }
 
  uploadFile(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + this.dateTime;
    const filePath = this.uniqkey ;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL =fileRef.getDownloadURL().subscribe(url => {
          console.log(url); 
          this.afs.collection('chatRoom').add({
            displayName:this.afAuth.auth.currentUser.displayName,
            picUpload: url,
            Userid: this.afAuth.auth.currentUser.uid,
            Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
          });
          this.content.scrollToBottom();
        
        });
      })
    ).subscribe();  
  }
}

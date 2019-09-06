import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, IonContent } from '@ionic/angular';
import { RequestsService } from 'src/app/services/requests.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as firestore from 'firebase';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  @ViewChild('scrollArea', {static: false}) content: IonContent;

    user:any;
    uid:any;
    text:string;
    chatRef:any;
    displayName:string;
    skel=false;

    uploadPercent: Observable<number>;
    downloadURL: any;
    uniqkey :any;
    today :any = new Date() ;
    date = this.today.getDate()+""+(this.today.getMonth()+1)+""+this.today.getFullYear();
    time = this.today.getHours() +""+ this.today.getMinutes();
    dateTime = this.date+""+this.time;
  
  constructor(private route: ActivatedRoute,
    public authService: AuthService,
    public afs: AngularFirestore, 
    public afAuth: AngularFireAuth, 
    public nav : NavController, 
    private requestService: RequestsService,
    private storage: AngularFireStorage,
    private socialSharing: SocialSharing) { 
    this.route.queryParams
    .subscribe(params => {
      this.user=params.user;
      this.displayName=params.displayName;
      console.log("user "+ this.user);

    });

    this.uid=this.afAuth.auth.currentUser.uid;
    this.chatRef=this.afs.collection('chats', ref=>ref.orderBy('Timestamp')).valueChanges();
    console.log("me",this.uid)

    this.scorllTo();
  }

  ngOnInit() {
    this.scorllTo();
  }
  send(){
    if(this.text !=''){
      this.afs.collection('chats').add({
        displayName:this.displayName,
        Message:this.text,
        Userid: this.afAuth.auth.currentUser.uid,
        sendto:this.user,
        picUpload:'',
        Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
       
      });
      this.content.scrollToBottom();
      this.text="";
      console.log("mee2 " +  this.afAuth.auth.currentUser.uid)
    }
  }
  scorllTo(){
    setTimeout(()=>{
      this.skel=true;
      this.content.scrollToBottom();
    },1000);   
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

    // observe percentage changes
  
    this.uploadPercent = task.percentageChanges();
    
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL =fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          this.afs.collection('chats').add({
            displayName:this.displayName,
            picUpload:url,
            Userid: this.afAuth.auth.currentUser.uid,
            sendto:this.user,
            Timestamp:firestore.firestore.FieldValue.serverTimestamp(),
           
          });
          this.content.scrollToBottom();
        
        });
      })
    ).subscribe();  
  
  }
  
}

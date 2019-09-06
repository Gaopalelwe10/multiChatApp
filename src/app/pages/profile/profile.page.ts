import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  users:any;
  currentuser:string;

  mainuser: AngularFirestoreDocument
	sub
	username: string;
	photoURL: string;

	password: string;
  newpassword: string;
  

  selectedFile= null;
  uploadPercent: Observable<number>;
  downloadURL: any;
  uniqkey :any;
  today :any = new Date() ;
  date = this.today.getDate()+""+(this.today.getMonth()+1)+""+this.today.getFullYear();
  time = this.today.getHours() +""+ this.today.getMinutes();
  dateTime = this.date+""+this.time;

  @ViewChild('fileBtn', {static:false}) fileBtn: {
		nativeElement: HTMLInputElement
  }
  
  constructor(public afs: AngularFirestore,
    public afAuth: AngularFireAuth, 
    public nav : NavController,
    private authService: AuthService, 
    private http: HttpClient,
    private storage: AngularFireStorage,
    private alertCtrl : AlertController
    ) { 
    this.users=this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges()
    this.currentuser= this.afAuth.auth.currentUser.uid;

    this.mainuser = afs.doc(`users/${authService.getUID()}`)
    
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.username = event.displayName
			this.photoURL = event.photoURL
    })
    console.log("hello "+ this.authService.getUID())
  }

  ngOnInit() {
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
          this.mainuser.update({
            photoURL: url
          })
        });
      })
    ).subscribe();  
  }

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: this.username,
          placeholder: 'Placeholder 1'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
           
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            console.log(inputData.name1)
            this.afAuth.auth.currentUser.updateProfile({
              displayName: inputData.name1
            })
            this.mainuser.update({
              displayName: inputData.name1
            })
           
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  
}

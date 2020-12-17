import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Gesture, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';
import { UserServiceService } from 'src/app/service/user-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currUser: any;
  imageUrl: any;
  loc = [];
  pressGesture: Gesture;
  uid = localStorage.getItem('UID');
  constructor(
    el: ElementRef,
    private router: Router,
    private authService: AuthService,
    private userService: UserServiceService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getListLocation();
    this.userService.getUser(this.uid).subscribe(res => {
      localStorage.setItem('currUser', JSON.stringify(res));
    });
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if (this.currUser.profileImage == null) {
      this.imageUrl = 'https://secure.gravatar.com/avatar/2e69cc3dd9ef2b804e6e75a1f2fbe37e?s=46&d=identicon';
    } else {
      this.imageUrl = this.currUser.profileImage; // set image user
    }
  }

  ionViewWillEnter(){
    this.userService.getUser(this.uid).subscribe(res => {
      localStorage.setItem('currUser', JSON.stringify(res));
    });
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if (this.currUser.profileImage == null) {
      this.imageUrl = 'https://secure.gravatar.com/avatar/2e69cc3dd9ef2b804e6e75a1f2fbe37e?s=46&d=identicon';
    } else {
      this.imageUrl = this.currUser.profileImage;
    }
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  getListLocation(){
    const self = this;
    this.userService.getDataLocation().subscribe(data => {
      data.payload.child(this.uid).forEach(function(childSnapshot){
        const tanggal = childSnapshot.key.split('-');
        self.loc.push({
          id: childSnapshot.key,
          date: tanggal[0] + ' ' + tanggal[1] + ' ' + tanggal[2] + ' ' + tanggal[3],
          lat: childSnapshot.child('lat').val(),
          lng: childSnapshot.child('lng').val(),
          nama: childSnapshot.child('nama').val()
        });
      });
    });
  }
  deleteLocation(locId)
  {
    this.userService.deleteDataLocation(locId);
    this.loc.forEach((data, index) => {
      if (data.id === locId) {
        this.loc.splice(index, 1);
      }
    });
  }
  async presentAlert(locId) {
    const alert = await this.alertController.create({
      message: 'Delete?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Delete',
        handler: () => this.deleteLocation(locId)
      }]
    });
    await alert.present();
  }
}

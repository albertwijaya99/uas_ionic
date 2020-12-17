import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.page.html',
  styleUrls: ['./addfriend.page.scss'],
})
export class AddfriendPage implements OnInit {
  public friendsArr = [
    {
      id: 1,
      nama: 'Andre Agustinus'
    },
    {
      id: 2,
      nama: 'Djasen Tjendry'
    },
    {
      id: 3,
      nama: 'Steven Wijaya'
    }
  ];
  private friends = [];
  private backupFriends = [];
  currUser: string = JSON.parse(localStorage.getItem('currUser'));
  currUserId: string = localStorage.getItem('UID');
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private userService: UserServiceService,
  ) {
   }

  ngOnInit() {}
  ionViewWillEnter(){
    const self = this;
    this.userService.getAllFriend().subscribe(data => {
      self.friends = self.friendsArr;
      data.payload.child(this.currUserId).forEach(function(childSnapshot) {
        for (let i = 0; i < self.friends.length; i++)
        {
          if (childSnapshot.key === self.friends[i].nama) {
            self.friends.splice(i, 1);
          }
        }
      });
      self.backupFriends = self.friends;
    });
  }
  add(friendId){
    this.friends.forEach((data, index) => {
      if (data.nama === friendId) {
        this.presentToast(data.nama);
        this.userService.addFriend(data.nama);
        this.friends.splice(index, 1);
        return true;
      }
    });
  }
  filterItems(searchTerm){
    return this.backupFriends.filter(item => {
      return item.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
    });
  }
  onChange(event)
  {
    const filteration = event.target.value;
    this.friends = this.filterItems(filteration);
    if (filteration.length === 0) {
      this.friends = this.backupFriends;
    }
  }
  back() {
    window.location.href = '/tabs/friend';
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg + ' added',
      duration: 1000
    });
    toast.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UserServiceService } from 'src/app/service/user-service.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss'],
})

export class FriendPage implements OnInit {
  public friendList = [];
  public backupFriend = [];
  searching: any = false;
  currUser: string = JSON.parse(localStorage.getItem('currUser'));
  currUserId: string = localStorage.getItem('UID');
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private userService: UserServiceService,
  ) { }
  ngOnInit() { }
  ionViewWillEnter() {
    this.backupFriend = [];
    this.friendList = [];
    this.friendList.splice(0, this.friendList.length);
    const self = this;
    this.userService.getAllFriends().subscribe(data => {
      data.payload.child(this.currUserId).forEach(function(childSnapshot) {
        self.friendList.push(childSnapshot.key);
      });
    });
    this.backupFriend = this.friendList;
    console.log('a');
  }
  delete(nama: string) {
    this.backupFriend = [];
    this.friendList = [];
    const self = this;
    this.userService.deleteFriend(nama);
    let index: any;
    index = this.friendList.forEach((element, i) => {
      if (element === nama) {
        return i;
      }
    });
    self.friendList.splice(index, this.friendList.length);
    this.friendList = self.friendList;
  }
  onChange(event) {
    this.backupFriend = [];
    this.friendList = [];
    this.friendList = [];
    const filter = event.target.value;
    this.friendList = this.filterItems(filter);
    if (filter.length === 0) {
         this.friendList = this.backupFriend;
    }
  }
  filterItems(searchTerm){
    this.backupFriend = [];
    this.friendList = [];
    return this.backupFriend.filter(item => {
      return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}

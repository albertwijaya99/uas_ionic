import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from './userModel';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private dbPath = '/user/';
  private dbFriendPath = '/friend/';
  private dbLocPath = '/Location/';
  userRef: AngularFireList<User> = null;
  friendRef: AngularFireList<any> = null;
  LocRef: AngularFireList<any> = null;
  private currUserId = localStorage.getItem('UID');

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.userRef = db.list(this.dbPath);
    this.friendRef = db.list(this.dbFriendPath + this.currUserId);
    this.LocRef = db.list(this.dbLocPath + this.currUserId);
   }
   getAllUser(){
     return this.userRef;
   }
   newUser(user: {nama: string; email: string; }, uid): any{
     console.log(user);
     return this.db.object(this.dbPath + uid).set({
       nama: user.nama,
       email: user.email
     });
   }
   getUser(uid){
     return this.db.object(this.dbPath + uid).valueChanges();
   }
   updateUser(name, uid, uploadImage)
   {
      this.db.object(this.dbPath + uid).update({nama: name});
   }
   getAllFriend(){
      return this.db.object(this.dbFriendPath).snapshotChanges();
   }
   addFriend(data){
     this.db.object(this.dbFriendPath + this.currUserId).update({[data]: true});
   }
   deleteFriend(nama){
    this.db.object(this.dbFriendPath + this.currUserId).update({[nama]: null});
   }
   updateLocation(newLocation){
     const lat = Object.values(newLocation)[0].toString();
     const lng = Object.values(newLocation)[1].toString();
     const nama = Object.values(newLocation)[2].toString();
     const date: string = Object.values(newLocation)[3].toString();
     this.db.object(this.dbLocPath + this.currUserId)
         .update({[date]: {lat, lng, nama}
     });
   }
   getDataLocation(){
    return this.db.object(this.dbLocPath).snapshotChanges();
   }
   deleteDataLocation(idLocation){
     this.db.object(this.dbLocPath + this.currUserId).update({
      [idLocation]: null
    });
   }
   getAllFriends(){
    return this.db.object(this.dbFriendPath).snapshotChanges();
   }
}

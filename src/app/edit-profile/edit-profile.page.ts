import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, LoadingController, NavController, Platform, PopoverController} from '@ionic/angular';
import { UserServiceService } from '../service/user-service.service';
import {NgForm} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl, ɵDomSanitizerImpl} from '@angular/platform-browser';
import {Camera, CameraResultType, CameraSource} from '@capacitor/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user: any;
  uploadImage = false;
  imageUrl: any;
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  constructor(
      private userService: UserServiceService,
      private navCtrl: NavController,
      private loadingController: LoadingController,
      private router: Router,
      private alertController: AlertController,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private sanitizerImpl: ɵDomSanitizerImpl
  ) { }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currUser'));
    if (this.user.profileImage == null ){
      this.imageUrl = 'https://secure.gravatar.com/avatar/2e69cc3dd9ef2b804e6e75a1f2fbe37e?s=46&d=identicon';
    } else {
      this.imageUrl = this.user.profileImage;
    }
  }
  onSubmit(form: NgForm) {
    const temp = this.user.nama;
    this.userService.updateUser(temp, localStorage.getItem('UID'), this.uploadImage);
    this.uploadImage = false;
    this.userService.getUser(localStorage.getItem('UID')).subscribe(data => {
      localStorage.setItem('currUser', JSON.stringify(data));
    });
    this.presentLoading().then(() => {
      this.router.navigate(['/tabs/profile']);
    });
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Changing profile picture',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
  async changeProfile(ev: any) {
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.imageUrl = this.sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, this.photo);
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }
  ngOnInit(){
  }

  ionViewWillEnter(){
    if (localStorage.getItem('currUser')) {
      this.router.navigate(['/tabs/map']);
    }
  }
  onSubmit(form: NgForm) {
    this.authService.signInWithEmail(form.value.email, form.value.password)
      .then(res => {
        if (res.user.emailVerified) {
          this.authService.setUserSession(res.user.uid);
        }
        else{
          this.presentToast('Please Verify your email');
        }
      })
      .catch(err => {
        this.presentToast('Wrong email or password');
      });
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      color: 'danger'
    });
    toast.present();
  }
}

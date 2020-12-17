import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router} from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formSignUp: FormGroup;
  errorMsg: string;

  constructor(
    private auth: AuthService,
    private userService: UserServiceService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }
  ngOnInit() {}
  onSubmit(form: NgForm)
  {
    if (form.value.password !== form.value.confirmPassword) {
      return this.presentToast('Passwords does not match');
    } else {
      this.auth.signUpWithEmail(form.value.email, form.value.password)
      .then((resp) => {
        resp.user.sendEmailVerification()
        .then(() => {
          this.auth.setMessage('Please verify your email');
          const userData = {
            nama: form.value.name,
            email: form.value.email
          };
          this.userService.newUser(userData, resp.user.uid);
          form.reset();
          this.presentLoading().then(() => {
              this.router.navigate(['./login']);
              this.presentToast('Please verify your email');
            });
        })
        .catch(err => {
          console.log(err);
        });

      })
      .catch(err => {
        this.errorMsg = err.message;
      });
    }
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating Account',
      duration: 1000
    });
    await loading.present();
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'danger',
      duration: 1000
    });
    await toast.present();
  }
}

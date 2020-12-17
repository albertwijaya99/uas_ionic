import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from 'src/app/service/user-service.service';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  private lat: number;
  private lng: number;
  private map: any;
  private userMarker: any;
  private locationValue = '';
  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  initPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };
  constructor(
    private userService: UserServiceService,
    private toastController: ToastController
  ) { }

  ngOnInit() {

  }
  ionViewDidEnter(){
    this.showMap();
  }
  getCurrDate(){
    // GET CURRENT DATE
    const today = new Date();
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayMonth = String(today.getMonth()).padStart(2, '0');
    const todayYear = today.getFullYear();
    const todayHour = today.getHours();
    const todayMinute = today.getMinutes();
    const todayDate = todayDay + '-' + this.monthNames[todayMonth] + '-' + todayYear + '-' + todayHour + ':' + todayMinute;
    return todayDate;
  }
  openModal(){
    document.getElementById('transparentLayer').classList.remove('ion-hide');
    document.getElementById('modalLayer').classList.remove('ion-hide');
    document.getElementById('fabCurLoc').classList.add('ion-hide');
    document.getElementById('fabOpenModal').classList.add('ion-hide');
  }
  hideModal(){
    document.getElementById('modalLayer').classList.add('ion-hide');
    document.getElementById('fabCurLoc').classList.remove('ion-hide');
    document.getElementById('fabOpenModal').classList.remove('ion-hide');
  }
  checkIn(){
    const todayDate = this.getCurrDate();
    const newLocation: any = {
      lat: this.lat,
      lng: this.lng,
      nama: this.locationValue,
      tanggal: todayDate
    };
    this.userService.updateLocation(newLocation);
    this.hideModal();
    this.locationValue = '';
    this.presentToast('Checked in.', 'primary');
  }
  showMap(){
    const location = new google.maps.LatLng(this.initPos.lat, this.initPos.lng);
    const options = {
      center: location,
      zoom: 12,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.map.addListener('click', (mapsMouseEvent) => {
      if (this.userMarker){
        this.userMarker.setMap(null);
      }

      this.lat = mapsMouseEvent.latLng.toJSON().lat;
      this.lng = mapsMouseEvent.latLng.toJSON().lng;
      this.userMarker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: this.map
      });
    });
  }
  getCurrentLoc(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (this.userMarker){
          this.userMarker.setMap(null);
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.lat = pos.lat;
        this.lng = pos.lng;

        this.userMarker = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          map: this.map
        });

        this.map.setCenter(pos);
      });
    }
  }
  async presentToast(msg: string, clr: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color: clr
    });
    await toast.present();
  }
}

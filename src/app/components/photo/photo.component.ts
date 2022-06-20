import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DBconectService } from 'src/app/services/dbconect.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  geolocation:any;
  imagetaken:boolean=false;
  image:any;
  db:any;
  showWebcam = true;
  isCameraExist = true;
  flowers:any;
  error="";
  @Output() getPicture = new EventEmitter<WebcamImage>();
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(db:DBconectService) { 
    this.db=db;
    Promise.resolve(this.db.getFlowers()).then(item=>{
      this.flowers=item;
    });
    navigator.geolocation.getCurrentPosition(resp => {
      this.geolocation={lng: resp.coords.longitude, lat: resp.coords.latitude};
    });
    if(this.geolocation==null){
      this.error="📍 Es necesario habilitar la geolocalización";
    }
  }


  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        if(mediaDevices && mediaDevices.length > 1){
          this.isCameraExist = mediaDevices && mediaDevices.length > 0;
          if(this.geolocation==null){
            this.error="📍 Es necesario habilitar la geolocalización";
          }
        }else{
          if(mediaDevices[0].deviceId==""){
            this.isCameraExist=false;
            this.error="📷 Es necesario habilitar la cámara";
          }else{
            this.isCameraExist = mediaDevices && mediaDevices.length > 0;
            if(!this.isCameraExist){
              this.error="📷 Es necesario habilitar la cámara";
            }else{
              if(this.geolocation==null){
                this.error="📍 Es necesario habilitar la geolocalización";
              }
            }
          }
        }

      });
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.error=error.toString();
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  Takepicture(webcamImage: WebcamImage) {
    console.log(webcamImage);
    this.image=webcamImage["_imageAsDataUrl"];
    this.showWebcam = false;
    this.imagetaken=true;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}

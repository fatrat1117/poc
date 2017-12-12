import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sub;
  devices = [];
  connectedDevice;
  messagMap = {};
  timeout = 1000;
  constructor(public navCtrl: NavController,
    private ble: BLE,
    private http: Http,
    private mc: MediaCapture) {

  }

  startScan() {
    if (this.sub)
      return;
    console.log('startScan');

    //let self = this;
    this.devices.splice(0);
    this.sub = this.ble.startScan([]).subscribe(device => {
      // setTimeout(function () {
      //   self.devices.push(device);
      // }, 1000);
      this.devices.push(device);
      console.log(device.name, this.devices);
    })
  }

  stopScan() {
    this.ble.stopScan();
    if (this.sub)
      this.sub.unsubscribe();
    this.sub = null;
  }

  pair(device) {
    this.ble.connect(device.id).subscribe(connectedDevice => {
      console.log(connectedDevice);
      if (connectedDevice.id === device.id) {
        this.connectedDevice = connectedDevice;
        alert('paired')
      }
    });
  }
  oneThread() {
    let self = this;
    setTimeout(() => {
      if (Object.keys(this.messagMap).length < 3) {
        self.http.get('https://api.github.com/zen').subscribe(result => {
          if (result && 200 == result.status && result["_body"]) {

            let message = result["_body"];
            console.log(message);
            self.messagMap[message] = true;
          }
        });
      }
    }, self.timeout);
  }

  callEndpoint() {
    console.log(Object.keys(this.messagMap));
    while (Object.keys(this.messagMap).length < 3) {
      this.oneThread();
      this.timeout += 1000;
    }
  }

  startCaptureVideo() {
    this.mc.captureVideo().then(files => {
      console.log(files);
    });
  }

  stopCaptureVideo() {
  }
}

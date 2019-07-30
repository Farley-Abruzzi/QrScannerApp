import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor( private barcodeScanner: BarcodeScanner, private dataLocal: DataLocalService ) {}

  ionViewDidEnter() {
    // console.log('viewDidEnter');
  }
  ionViewDidLeave() {
    // console.log('viewDidLeave');
  }
  ionViewWillEnter() {
    // console.log('viewWillEnter');
    this.scan();
  }
  ionViewWillLeave() {
    // console.log('viewWillLeave');
  }
  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if ( !barcodeData.cancelled ) {
        this.dataLocal.guardarRegistro( barcodeData.format, barcodeData.text );
      }

     }).catch(err => {
         console.log('Error', err);

        
        // this.dataLocal.guardarRegistro( 'QRCode', 'https://fernando-herrera.com' );
        // this.dataLocal.guardarRegistro( 'QRCode', 'geo:40.72943664472433,-74.16249647578127' );
     });
  }
}

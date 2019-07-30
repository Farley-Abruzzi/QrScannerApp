import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.modal';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor( private storage: Storage, 
               private navCtrl: NavController, 
               private inAppBrowser: InAppBrowser,
               private file: File,
               private emailComposer: EmailComposer ) { 

    this.carregarStorage();
  }

  async carregarStorage() {
    this.guardados = await this.storage.get('registros') || [];
  }

  async guardarRegistro( format: string, text: string ) {

    await this.carregarStorage();

    const novoRegistro = new Registro( format, text );
    this.guardados.unshift( novoRegistro );

    console.log(this.guardados);
    this.storage.set('registros', this.guardados);

    this.abrirRegistro( novoRegistro );
  }

  abrirRegistro( registro: Registro ) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( registro.type ) {

      case 'http': 
        this.inAppBrowser.create( registro.text, '_system');
      break;

      case 'geo': 
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
      break;
    }
  }

  enviarCorreio() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Criado em, Texto\n';

    arrTemp.push( titulos );

    this.guardados.forEach( registro => {

      const linha = `${ registro.type }, ${ registro.format }, ${ registro.created }, ${ registro.text.replace(',', ' ') }\n`;

      arrTemp.push( linha );

    });
    this.criarArquivoFisico( arrTemp.join('') );
  }

  criarArquivoFisico( text: string ) {

    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then( existe => {
        console.log('Existe arquivo?', existe);
        return this.escreverEmArquivo( text );
      })
      .catch(err => {

        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false)
          .then( criado => this.escreverEmArquivo(text) )
          .catch( err2 => console.log('Não se pode criar o arquivo.', err2) );
        
      });
  }

  async escreverEmArquivo( text: string ) {

    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );

    const archivo = `${ this.file.dataDirectory }/registros.csv`;
    // console.log( this.file.dataDirectory + 'registros.csv');

    const email = {
      to: 'farleyabruzzi@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aqui tem os backups dos scans - <strong>ScanApp</strong>',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {

    let geo: any = this.route.snapshot.paramMap.get('geo');

    geo = geo.substr(4);
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log(this.lat, this.lng);
  }

  ngAfterViewInit() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZmFybGV5LWFicnV6emkiLCJhIjoiY2p5ZzFuaDMyMDMwYjNoc2JnNjVieWhlbCJ9.llMKv2uKn_IgkD1MIThCjA';

    // OUTRO TIPO DE MAPA:
    // const map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/streets-v11'
    // });
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
      });

      map.on('load', () => {

        map.resize();

        // Marcador
        new mapboxgl.Marker({
          draggable: true
          })
          .setLngLat([this.lng, this.lat])
          .addTo(map);

        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
         
        let labelLayerId;
          for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
          }
        }
         
        map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
        ],
        'fill-extrusion-opacity': .6
        }
        }, labelLayerId);
      });

  }

}

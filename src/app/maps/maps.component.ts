import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
// import { GoogleMapsAPIWrapper } from '@agm/core';
import * as carto from '@carto/carto.js';
import { MapService } from '../map.service';
// import { Observable } from 'rxjs/observable';
import {timer} from 'rxjs/observable/timer';
import * as mapboxgl from 'mapbox-gl';
import * as socket from 'socket.io-client';
import {Subscription} from 'rxjs';
import * as mapStruct from '../map';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  // latlng = new google.maps.LatLng(31.633979, 74.872264);
  public map: mapboxgl.Map;
  coordinates: Array<number>;
  display = [];
  constructor(private mapApi: MapService) { }
  // sub: Subscription;
  source: any;
  marker: any;
  coord: any;
  timerSource: any;
  feat: any;
  hashtag: any;
  tweet_counter: any = 0;
  isDisabled = true;
  stream_status = '';
  stop_stream = false;
  disableInput = false;

  ngOnInit() {
    if (this.hashtag) {
      this.isDisabled = false;
    }
  const bounds = [
      [-198.28125,
        -84.8657818673152],
      [209.53125,
        84.8024737243345]
    ];
  this.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 1
  });
  this.coord = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': [123456, 456788]
        }
      }
    ]
  };
  this.map.on('load', () => {
    this.map.addSource('coordsSource', {
      type: 'geojson',
      data: this.coord
    });
    this.map.addLayer({
      id: 'something',
      source: 'coordsSource',
      type: 'heatmap',
      paint: {
        'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'mag'],
            0, 0,
            6, 1
        ],
        'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 0
      ],
     },
     }, 'waterway-label');
  });
  }

  plotOnMap(data) {
    this.feat = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'Point',
              'coordinates': [
                data[0],
                data[1]
              ]
            }
          };

    this.coord['features'].push(this.feat);
    // console.log(this.coord);

    this.map.getSource('coordsSource').setData(this.coord);
  }
  onMapClick(event) {

    // console.log(this.latlng);
    console.log(event);
  }

  buttonClick(hashtag_check) {
    if (hashtag_check) {
      this.isDisabled = true;
      this.disableInput = true;
      this.stream_status = 'Stream Started';
      this.mapApi.getCounter().subscribe(
        data => {this.tweet_counter = data; }
      );
      this.mapApi.socket.emit('hashtag', this.hashtag);
      this.mapApi.getHashtag().subscribe(
        data => {this.hashtag = data;
        console.log(this.hashtag); }
      );
      this.mapApi.emitEvent();
      this.mapApi.getTweets().subscribe(
        coords => {
          this.display.push(coords);
          this.plotOnMap(coords);
          // this.plotOnMap(coords);
        },
        err => {console.log(err); },
        () => {console.log('completed'); }
      );
    } else {
      this.stream_status = 'Plesae enter a hashtag first';
    }

    console.log(this.stream_status);
    console.log(this.hashtag);
    // this.plotOnMap(this.map, [76.2890625, 26.43122806450644]);
    // this.timerSource = setInterval(() => {
    //   // console.log('refreshing');
    //   this.mapApi.pingEvent();
    // }, 2000);
    // this.mapApi.getTweets2().subscribe(
    //   data => console.log(data)
    // );

  }

  stopStream() {
    this.disableInput = false;
    this.stream_status = 'Stream Stopped';

    this.coord = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': [123456, 456788]
          }
        }
      ]
    };

    this.map.getSource('coordsSource').setData(this.coord);

    this.mapApi.stopStream();
  }
}

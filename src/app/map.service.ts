import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import * as socketIo from 'socket.io-client';
// import { Socket } from 'ngx-socket-io';

const SERVER_URL = 'https://safe-peak-61356.herokuapp.com/socket.io/';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  observer: Observer<any>;
  socket: any;
  constructor() {
    this.socket = socketIo(SERVER_URL);
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2Frc2hhbW1hbGlrIiwiYSI6ImNqaXg2azhxaTNid2IzdnJmbWZucmM2aW0ifQ.ZxrHZZH64eSgCHpqJc9clw';
   }

  getTweets() {
    return new Observable(observer => {
      this.socket.on('tweet sent', (coords) => observer.next(coords));
    });
  }

  getHashtag() {
    return new Observable(observer => {
      this.socket.on('get hashtag', (hashtag) => observer.next(hashtag));
    });
  }

  getCounter() {
    return new Observable(observer => {
      this.socket.on('counter', (hashtag) => observer.next(hashtag));
    });
  }

  emitEvent() {
      this.socket.emit('tweet');
  }
  hashtagEvent(hashtag) {
    this.socket.emit('hashtag', hashtag);
  }
  stopStream() {
    this.socket.emit('stop stream');
  }
}

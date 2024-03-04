import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition: any = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  timeout: any;
  private voiceToTextSubject: Subject<string> = new Subject();
  private speakingPaused: Subject<any> = new Subject();
  private tempWords: string = '';

  constructor() {
    // this.recognition.onend = this.onRecognitionEnd.bind(this);
  }

  // onRecognitionEnd(): void {
  //   console.log('Speech recognition ended');
  //   this.timeout = setTimeout(() => {
  //     this.recognition.stop();
  //     console.log('Speech recognition stopped due to inactivity');
  //   }, 5000);
  // }

  speechInput() {
    return this.voiceToTextSubject.asObservable();
  }
  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      this.voiceToTextSubject.next(this.text || transcript);
    });
    return this.initListeners();
  }

  initListeners() {
    this.recognition.addEventListener('end', (condition: any) => {
      console.log('end');
      this.recognition.stop();
    });
    return this.speakingPaused.asObservable();
  }

  start() {
    this.text = '';
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.isActive = true;
        this.recognition.stop();
      } else {
        this.isStoppedSpeechRecog = false;
        this.wordConcat();
        // Checked time with last api call made time so we can't have multiple start action within 200ms for countinious listening
        // Fixed : ERROR DOMException: Failed to execute 'start' on 'SpeechRecognition': recognition has already started.
        if (
          !this.recognition.lastActiveTime ||
          Date.now() - this.recognition.lastActive > 200
        ) {
          this.recognition.start();
          this.recognition.lastActive = Date.now();
        }
      }
      this.voiceToTextSubject.next(this.text);
    });
  }

  stop() {
    this.text = '';
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    this.recognition.isActive = false;
    this.speakingPaused.next('Stopped speaking');
  }

  wordConcat() {
    this.text = this.text.trim() + ' ' + this.tempWords;
    this.text = this.text.trim();
    this.tempWords = '';
  }
}

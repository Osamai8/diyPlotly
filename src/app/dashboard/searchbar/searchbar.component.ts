import { Component } from '@angular/core';
declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
  isRecording: 'idle' | 'recording' | 'stop' = 'idle';

  results: any = '';
  vSearch = new webkitSpeechRecognition();
  ngOnInit(): void {
    this.vSearch.continuous = false;
    this.vSearch.interimresults = true;
    this.vSearch.lang = 'en-US';
    this.vSearch.maxAlternatives = 1;
    this.vSearch.addEventListener('result', (event: any) => {
      let transcript = event.results[0][0].transcript;
      this.results = transcript;
      this.isRecording = 'stop';
      this.vSearch.stop();
    });
  }

  startListening() {
    if ('webkitSpeechRecognition' in window) {
      if (this.isRecording === 'recording') {
        console.log('Recording is already started.');
        return;
      }

      this.isRecording = 'recording';
      this.vSearch.start();

      this.vSearch.addEventListener('end', () => {
        this.isRecording = 'stop';
        console.log('Recording ended.');
      });
    } else {
      alert('Your browser does not support voice recognition!');
    }
  }
  concatWords() {
    console.log(this.results);
  }
}

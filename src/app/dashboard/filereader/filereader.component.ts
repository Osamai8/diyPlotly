import { Component, EventEmitter, Output, SimpleChange } from '@angular/core';
import { Papa, ParseConfig, ParseResult } from 'ngx-papaparse';
import { VoiceRecognitionService } from 'src/app/services/VR/voice-recognition.service';

@Component({
  selector: 'app-filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css'],
})
export class FilereaderComponent {
  constructor(
    private papaParse: Papa,
    private voiceRecognition: VoiceRecognitionService
  ) {}
  @Output() csvDataCarries = new EventEmitter();
  // tabs
  index = 0;
  tabs: any[] = [];

  parseOptions: ParseConfig = {
    header: true,
    skipEmptyLines: true,
    complete: (results: ParseResult, file) => {
      let headers: any = {};

      results?.meta?.fields?.forEach((elem: string) => {
        headers = { ...headers, [elem]: [] };
      });

      results?.data?.forEach((elem: any) => {
        Object.keys(elem).forEach((key: string) => {
          headers[key]?.push(elem[key]);
          ``;
        });
      });
      this.newTab(
        file?.name,
        { results, headers },
        { data: results.data, fields: results.meta.fields }
      );
      return results;
    },
  };

  ngOnInit(): void {
    if (localStorage.getItem('tabs')) {
      this.tabs = JSON.parse(localStorage.getItem('tabs') || ([] as any));

      this.tabs.length > 0 &&
        this.csvDataCarries.emit({ ...this.tabs[0].data, id: this.tabs[0].id });
    }
  }

  handleFileInput(target: any) {
    if (!target.files) return;
    this.papaParse.parse(target?.files[0], this.parseOptions);
  }

  newTab(
    fileName: string | undefined,
    data: { results: any; headers: any },
    tableData: { data: any[]; fields: string[] }
  ): void {
    const csvObj = {
      title: fileName || 'Chart',
      data,
      tableData,
      id: Math.random(),
    };
    this.tabs.push(csvObj);
    this.index = this.tabs.length - 1;
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    this.csvDataCarries.emit({ ...data, id: csvObj.id });
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  handleTabChange(e: number) {
    this.csvDataCarries.emit({ ...this.tabs[e].data, id: this.tabs[e].id });
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { Papa, ParseConfig, ParseResult } from 'ngx-papaparse';

@Component({
  selector: 'app-filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css'],
})
export class FilereaderComponent {
  constructor(private papaParse: Papa) {}
  csvValue: any = {};
  @Output() csvDataCarries = new EventEmitter();

  parseOptions: ParseConfig = {
    header: true,
    skipEmptyLines: true,
    complete: (results: ParseResult, file) => {
      this.csvValue = { data: results.data, fields: results.meta.fields };
      let headers: any = {};

      results?.meta?.fields?.forEach((elem: string) => {
        headers = { ...headers, [elem]: [] };
      });

      console.log(headers, results);
      results?.data?.forEach((elem: any) => {
        Object.keys(elem).forEach((key: string) => {
          headers[key]?.push(elem[key]);
          ``;
        });
      });
      this.csvDataCarries.emit({ results, headers });
      // localStorage.setItem('csvData', JSON.stringify({ results, headers }));
      return results;
    },
  };

  ngOnInit(): void {
    // if (localStorage.getItem('csvData')) {
    //   const data: any = JSON.parse(localStorage.getItem('csvData') || '');
    //   this.csvValue = {
    //     data: data?.results.data,
    //     fields: data?.results.meta.fields,
    //   };
    // }
  }

  handleFileInput(target: any) {
    if (!target.files) return;
    this.papaParse.parse(target?.files[0], this.parseOptions);
  }
}

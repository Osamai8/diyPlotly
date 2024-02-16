import { Component, EventEmitter, Output, SimpleChange } from '@angular/core';
import { Papa, ParseConfig, ParseResult } from 'ngx-papaparse';

@Component({
  selector: 'app-filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css'],
})
export class FilereaderComponent {
  constructor(private papaParse: Papa) {}
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

  ngOnInit(): void {}

  handleFileInput(target: any) {
    if (!target.files) return;
    this.papaParse.parse(target?.files[0], this.parseOptions);
  }

  newTab(
    fileName: string | undefined,
    data: { results: any; headers: any },
    tableData: { data: any[]; fields: string[] }
  ): void {
    this.tabs.push({ title: fileName || 'Chart', data, tableData });
    this.index = this.tabs.length - 1;
    this.csvDataCarries.emit(data);
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
    console.log(index);
  }

  handleTabChange(e: number) {
    this.csvDataCarries.emit(this.tabs[e].data);
  }
}

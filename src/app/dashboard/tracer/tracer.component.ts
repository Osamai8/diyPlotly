import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { IGraphTypes, graphTypeList } from 'src/assets/dashboard.assets';

@Component({
  selector: 'app-tracer',
  templateUrl: './tracer.component.html',
  styleUrls: ['./tracer.component.css'],
})
export class TracerComponent {
  constructor() {}
  @Input() csvData: any = {};
  @Output() selectedAxisValuesCarrier = new EventEmitter();
  @Output() selectedGraphTypeCarrier = new EventEmitter();
  @Output() filterCarrier = new EventEmitter();

  axisValues: any = { x: [], y: [], z: [] };
  axisList: any[] = [];
  listOfSelectedValue: string[] = ['Name'];
  graphHeaders: string[] = [];
  isMultiple: boolean = true;
  graphType: any = {};
  filterType = ['Opacity', 'Size'];
  filterValues: any = { Opacity: '', Size: '' };
  filteList: any[] = [];
  graphList: any[] = [];

  fieldList: any[] = [];
  // k = [
  //   {
  //     group: 'axis',
  //     title: 'Axis',
  //     child: [
  //       {
  //         name: 'x',
  //         optionArray: this.graphHeaders,
  //         title: 'X',
  //         placeholder: 'X',
  //         multiple: true,
  //       },
  //       {
  //         name: 'y',
  //         optionArray: this.graphHeaders,
  //         title: 'Y',
  //         placeholder: 'Y',
  //         multiple: true,
  //       },
  //       {
  //         name: 'z',
  //         optionArray: this.graphHeaders,
  //         title: 'Z',
  //         placeholder: 'Z',
  //         multiple: true,
  //       },
  //     ],
  //   },
  //   {
  //     group: 'filter',
  //     title: 'Filter',
  //     child: [
  //       {
  //         name: 'opacity',
  //         optionArray: this.graphHeaders,
  //         title: '',
  //         placeholder: 'Opacity',
  //         multiple: false,
  //       },
  //       {
  //         name: 'size',
  //         optionArray: this.graphHeaders,
  //         title: '',
  //         placeholder: 'Size',
  //         multiple: false,
  //       },
  //     ],
  //   },
  // ];

  ngOnInit(): void {
    // graphTypeList &&
    //   this.fieldList.push({
    //     group: 'graph',
    //     title: 'Graph',
    //     child: [
    //       {
    //         name: 'graphType',
    //         optionArray: graphTypeList?.map((elem: any) => elem.title),
    //         title: 'Graph Type',
    //         placeholder: 'Select Graph',
    //         multiple: false,
    //         onChange: this.selectGraphTypeHandler,
    //       },
    //     ],
    //   });
    this.graphList = graphTypeList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['csvData']?.currentValue) {
      this.graphHeaders =
        changes?.['csvData'].currentValue?.results?.meta.fields;
      if (this.graphHeaders && this.graphType) {
        this.createAxis();
      }
    }
  }
  createAxis() {
    // this.fieldList.push({
    //   group: 'axis',
    //   title: 'Axis',
    //   child: Object.keys(this.axisValues)
    //     .map((axis: any, index: number) => {
    //       if (index + 1 <= this.graphType.axisCount) {
    //         return {
    //           name: axis,
    //           optionArray: this.graphHeaders?.map((elem: string) => elem),
    //           title: axis.toUpperCase(),
    //           placeholder: axis.toUpperCase(),
    //           multiple: true,
    //           value: this.axisValues[axis],
    //           onChange: this.selectAxisHandler,
    //         };
    //       }
    //       return;
    //     })
    //     .filter((elem: any) => Boolean(elem)),
    // });
    this.axisList = Object.keys(this.axisValues)
      .map((axis: any, index: number) => {
        if (index + 1 <= this.graphType.axisCount) {
          return {
            optionArray: this.graphHeaders,
            axis: axis,
            id: index,
            value: this.axisValues[axis],
          };
        }
        return;
      })
      .filter((elem: any) => Boolean(elem));
    this.filteList = this.filterType.map((filter: string) => {
      return {
        name: filter,
        optionArray: this.graphHeaders,
        value: this.filterValues[filter],
      };
    });
  }
  selectAxisHandler(target: any, axis: 'x' | 'y' | 'z') {
    const value: string[] = Array.isArray(target) ? target : [target];
    this.axisValues = { ...this.axisValues, [axis]: value };

    this.selectedAxisValuesCarrier.emit({ [axis]: value });
  }
  selectGraphTypeHandler(value: any) {
    this.isMultiple = value !== 'Pie';
    this.graphType = graphTypeList.find(
      (elem: IGraphTypes) => elem.title === value
    );
    if (value === 'Pie') {
      this.axisValues = { x: [], y: [], z: [] };
      this.filterValues = { Opacity: '', Size: '' };
    }
    this.createAxis();
    this.selectedGraphTypeCarrier.emit(value);
  }
  selectFilterHandler(target: any, type: string) {
    this.filterValues = { ...this.filterValues, [type]: target };
    this.filterCarrier.emit({ [type]: target });
  }
}

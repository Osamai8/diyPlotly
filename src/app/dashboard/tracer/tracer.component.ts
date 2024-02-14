import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
  axisType: any[] = ['x', 'y', 'z'];
  axisList: any[] = [];
  listOfSelectedValue: string[] = ['Name'];
  graphHeaders: string[] = [];
  isMultiple: boolean = true;
  graphType: any = {};
  filterType = ['Opacity', 'Size'];
  filterValues: any = { Opacity: '', Size: '' };
  filteList: any[] = [];
  graphList: any[] = [];

  ngOnInit(): void {
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
    this.axisList = this.axisType
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
    this.isMultiple = value !== 'pie';
    this.graphType = graphTypeList.find(
      (elem: IGraphTypes) => elem.title === value
    );
    this.createAxis();
    this.selectedGraphTypeCarrier.emit(value);
  }
  selectFilterHandler(target: any, type: string) {
    this.filterValues = { ...this.filterValues, [type]: target };
    this.filterCarrier.emit({ [type]: target });
  }
}

import {
  Component,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { IGraphTypes, graphTypeList } from 'src/assets/dashboard.assets';
import { copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tracer',
  templateUrl: './tracer.component.html',
  styleUrls: ['./tracer.component.css'],
})
export class TracerComponent {
  constructor(private message: NzMessageService) {}
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
  filterValues: any = { Opacity: [], Size: [] };
  filteList: any[] = [];
  graphList: any[] = [];
  fieldList: any[] = [];

  ngOnInit(): void {
    this.graphList = graphTypeList;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['csvData']?.currentValue) {
      this.graphHeaders =
        changes?.['csvData'].currentValue?.results?.meta.fields;
      if (
        changes?.['csvData']?.currentValue?.id !==
        changes?.['csvData']?.previousValue?.id
      ) {
        this.filterValues = { Opacity: [], Size: [] };
        this.axisValues = { x: [], y: [], z: [] };
      }
      if (this.graphHeaders && this.graphType) {
        this.createAxis();
      }
    }
  }

  createAxis() {
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
      .filter(Boolean);
    this.filteList = this.filterType.map((filter: string) => {
      return {
        name: filter,
        optionArray: this.graphHeaders,
        value: this.filterValues[filter],
      };
    });
  }
  selectGraphTypeHandler(value: any) {
    this.isMultiple = value !== 'Pie';
    this.graphType = graphTypeList.find(
      (elem: IGraphTypes) => elem.title === value
    );
    if (value === 'Pie') {
      this.axisValues = { x: [], y: [], z: [] };
      this.filterValues = { Opacity: [], Size: [] };
    }
    this.createAxis();
    this.selectedGraphTypeCarrier.emit(value);
  }

  no() {
    return false;
  }

  removeClonedNdEmit(
    currentContainer: string,
    type: 'filter' | 'axis' | '' = ''
  ) {
    if (!type) return;
    let variableByType: any =
      type === 'axis' ? this.axisValues : this.filterValues;
    const clonedValue = [...variableByType[currentContainer]];

    variableByType = {
      ...variableByType,
      [currentContainer]: [...new Set(clonedValue)],
    };

    if (type === 'axis') {
      this.selectedAxisValuesCarrier.emit({
        [currentContainer]: variableByType[currentContainer],
      });
    }
    if (type === 'filter') {
      this.filterCarrier.emit({
        [currentContainer]: variableByType[currentContainer][0],
      });
    }
  }

  drop(event: any, type: 'filter' | 'axis' | '' = '') {
    const variableRef = type === 'filter' ? this.filterValues : this.axisValues;
    const currentContainer: string = event.container.id;

    if (event.isPointerOverContainer) {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        if (type === 'filter' && event.container.data.length) {
          this.message.create(
            'error',
            `Can only select one field for Size/Opacity`
          );
          return;
        }

        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        if (currentContainer !== 'headerList') {
          this.removeClonedNdEmit(currentContainer, type);
        }
      }
    } else {
      if (currentContainer !== 'headerList') {
        variableRef[currentContainer] = variableRef[currentContainer].filter(
          (elem: string, index: number) => event.previousIndex !== index
        );
        if (type === 'axis')
          this.selectedAxisValuesCarrier.emit({
            [currentContainer]: variableRef[currentContainer],
          });
        if (type === 'filter')
          this.filterCarrier.emit({
            [currentContainer]: variableRef[currentContainer][0] || '',
          });
      }
    }
  }
}

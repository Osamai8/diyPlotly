import {
  Component,
  ElementRef,
  Injectable,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IGraphTypes, graphTypeList } from 'src/assets/dashboard.assets';

declare const Plotly: any;

@Component({
  selector: 'app-graphview',
  templateUrl: './graphview.component.html',
  styleUrls: ['./graphview.component.css'],
})
export class GraphviewComponent {
  @Input() csvData: any = {};
  @Input() selectedAxisValues: any = {};
  @Input() selectedMapType: any = '';
  @Input() filter: any = '';
  @ViewChild('#graph-box') el: ElementRef | undefined;

  constructor() {}
  selectedMap: string = '';
  axisValue: { x: string[]; y: string[] } = { x: [], y: [] };
  filterValue: any = {};

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['csvData']?.currentValue) this.generateChart();
    if (changes['selectedAxisValues']?.currentValue) {
      const selected = changes['selectedAxisValues']?.currentValue;
      this.axisValue = { ...this.axisValue, ...selected };
      this.generateChart();
    }
    if (changes['selectedMapType']?.currentValue.length) {
      this.selectedMap = changes['selectedMapType']?.currentValue;
      if (this.selectedMap === 'Pie') {
        this.axisValue = { x: [], y: [] };
        this.filterValue = {};
      }
      this.generateChart();
    }
    if (changes['filter']?.currentValue) {
      const selected = changes['filter']?.currentValue;
      this.filterValue = { ...this.filterValue, ...selected };
      this.generateChart();
    }
  }

  generateChart() {
    if (Object.keys(this.csvData || {}).length > 0) {
      const { x: selectedxAxis, y: selectedyAxis } = this.axisValue;

      const selectedGraph = this.selectedMap
        ? graphTypeList.find(
            (graph: IGraphTypes) => graph.title === this.selectedMap
          )
        : graphTypeList[0];

      let newData: any = [];
      const { headers } = this.csvData;

      const maxValueOfOpacity = this.filterValue?.Opacity
        ? Math.max(...headers[this.filterValue?.Opacity])
        : 1;
      const maxValueOfSize = this.filterValue?.Size
        ? Math.max(...headers[this.filterValue?.Size])
        : 1;

      const opacityFilter =
        headers?.[this.filterValue?.['Opacity']]?.map((elem: string) => {
          if (/^-?\d*\.?\d+$/.test(elem)) {
            return parseInt(elem) / maxValueOfOpacity;
          }
          return 0.75;
        }) || [];
      const sizeFilter =
        headers?.[this.filterValue?.['Size']]?.map((elem: string) => {
          if (/^-?\d*\.?\d+$/.test(elem)) {
            return (parseInt(elem) / maxValueOfSize) * 50;
          }
          return 18;
        }) || [];

      if (selectedxAxis.length || selectedyAxis.length) {
        newData = selectedxAxis.map((x: any) => {
          const yAxis = selectedyAxis.length
            ? selectedyAxis
            : [selectedyAxis[0]];

          const containsOnlyNum = headers?.[x]?.every((item: string) =>
            /^-?\d*\.?\d+$/.test(item)
          );
          let pieValue: [];
          let pieLabels: [];

          if (selectedGraph?.type === 'pie') {
            if (containsOnlyNum) {
              pieLabels = headers?.[x];
              pieValue = headers?.[selectedyAxis[0]];
            } else {
              pieLabels = headers?.[x];
              pieValue = headers?.[selectedyAxis[0]];
            }
          }
          return yAxis.map((y: any, i: number) => {
            return {
              ...(selectedGraph?.type === 'pie'
                ? {
                    ...{
                      values: pieValue,
                      labels: pieLabels,
                    },
                  }
                : {
                    ...{
                      x: headers?.[x] || [],
                      y: headers?.[y] || [],
                    },
                  }),
              type: selectedGraph?.type,
              mode: selectedGraph?.mode,
              fill: selectedGraph?.fill,
              // line: { shape: 'linear' },
              name: y,
              barmode: selectedGraph?.mode,
              autobinx: false,
              ...(sizeFilter?.length && selectedGraph?.type == 'bar'
                ? { width: sizeFilter.map((elem: number) => elem / 25) }
                : {}),
              marker: {
                ...selectedGraph?.marker,
                opacity: opacityFilter.length ? opacityFilter : 0.75, // from filter
                color:
                  '#' +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0'),
                size: sizeFilter?.length ? sizeFilter : 18,
              },
              // transforms: [
              //   {
              //     type: 'groupby',
              //     groups: headers?.[x],
              //   },
              // ],
            };
          });
        });
      }
      newData = newData?.flatMap((innerArray: any[]) => [...innerArray]);

      var layout = {
        autosize: true,
        xaxis: {
          title: {
            text: selectedxAxis.join(', '),
          },
        },
        yaxis: {
          title: {
            text: selectedyAxis.join(', '),
          },
        },
        legend:
          selectedGraph?.type !== 'pie'
            ? {
                orientation: 'h',
                x: 0.5,
                y: 1.2,
                xanchor: 'center',
              }
            : {},
      };

      const frames = [
        {
          transition: {
            duration: 5000,
            easing: 'cubic-in-out',
          },
          frame: {
            duration: 5000,
          },
        },
      ];
      Plotly?.newPlot('graph-box', newData, layout);
    }
  }
}

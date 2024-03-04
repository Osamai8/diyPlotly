import {
  Component,
  ElementRef,
  Input,
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

  ngOnInit(): void {
    // this.generateStatic();
  }

  clearInputValues() {
    this.axisValue = { x: [], y: [] };
    this.filterValue = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['csvData']?.currentValue) {
      this.clearInputValues();
      this.generateChart();
    }
    if (changes['selectedAxisValues']?.currentValue) {
      const selected = changes['selectedAxisValues']?.currentValue;
      this.axisValue = { ...this.axisValue, ...selected };
      this.generateChart();
    }
    if (changes['selectedMapType']?.currentValue.length) {
      this.selectedMap = changes['selectedMapType']?.currentValue;
      if (this.selectedMap === 'Pie') {
        this.clearInputValues();
      }
      this.generateChart();
    }
    if (changes['filter']?.currentValue) {
      const selected = changes['filter']?.currentValue;
      this.filterValue = { ...this.filterValue, ...selected };
      this.generateChart();
    }
  }
  createLayout = (selectedGraph: IGraphTypes | undefined, frames: any[]) => ({
    autosize: true,
    xaxis: {
      title: {
        text: this.axisValue.x.join(', '),
      },
    },
    yaxis: {
      title: {
        text: this.axisValue.y.join(', '),
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
    hovermode: 'closest',
    // ...(selectedGraph?.type !== 'pie'
    //   ? {
    //       updatemenus: [
    //         {
    //           x: 0,
    //           y: 3, //0
    //           yanchor: 'top',
    //           xanchor: 'left',
    //           showactive: false,
    //           direction: 'left',
    //           type: 'buttons',
    //           pad: { t: 87, r: 10 },
    //           buttons: [
    //             {
    //               method: 'animate',
    //               args: [
    //                 null,
    //                 {
    //                   mode: 'immediate',
    //                   fromcurrent: true,
    //                   transition: { duration: frames?.length > 100 ? 50 : 200 },
    //                   frame: {
    //                     duration: frames?.length > 100 ? 10 : 500,
    //                     redraw: false,
    //                   },
    //                 },
    //               ],
    //               label: 'Play',
    //             },
    //             {
    //               method: 'animate',
    //               args: [
    //                 [null],
    //                 {
    //                   mode: 'immediate',
    //                   transition: { duration: 0 },
    //                   frame: { duration: 0, redraw: false },
    //                 },
    //               ],
    //               label: 'Pause',
    //             },
    //           ],
    //         },
    //       ],
    // sliders: [
    //   {
    //     pad: { l: 130, b: -55 }, // -55
    //     currentvalue: {
    //       visible: true,
    //       prefix: 'Frame:',
    //       xanchor: 'right',
    //       font: { size: 20, color: '#666' },
    //     },
    //     steps: [],
    //     yanchor: 'top',
    //     x: 0,
    //     y: 3,
    //   },
    // ],
    //   }
    // : {}),
  });

  createFrames = (fullData: any) => {
    const framesArray: any[] = [];
    if (this.selectedMap?.toLowerCase() === 'pie') return framesArray;
    if (fullData[0]?.x.length && fullData[0]?.y.length) {
      fullData.forEach(
        (data: { x: (string | number)[]; y: (string | number)[] }) => {
          const duplicates: { [key: string]: number[] } = {};
          // save duplicate value indexes as key:value
          data.x.forEach((val: any, i: number) => {
            if (duplicates[val]) {
              duplicates[val].push(i);
            } else {
              duplicates[val] = [i];
            }
          });

          Object.keys(duplicates).forEach((dupe: string, index: number) => {
            const k = {
              name: dupe,
              data: [
                {
                  x: [
                    ...(framesArray[index - 1]
                      ? framesArray[index - 1].data[0].x
                      : []),

                    ...duplicates[dupe].map(
                      (position: number) => data.x[position]
                    ),
                  ],
                  y: [
                    ...(framesArray[index - 1]
                      ? framesArray[index - 1].data[0].y
                      : []),
                    ...duplicates[dupe].map(
                      (position: number) => data.y[position]
                    ),
                  ],
                },
              ],
            };
            framesArray.push(k);
          });
        }
      );
    }
    if (framesArray.length) return framesArray.flat();
    return framesArray;
  };

  createFiltersValues(csvData: any, filterValue: any) {
    const { headers } = csvData;

    const maxValueOfOpacity = filterValue?.Opacity
      ? Math.max(...headers[filterValue?.Opacity])
      : 1;
    const maxValueOfSize = filterValue?.Size
      ? Math.max(...headers[filterValue?.Size])
      : 1;

    const opacityFilter = (headers?.[filterValue?.['Opacity']] || [])?.map(
      (elem: string) => {
        return /^-?\d*\.?\d+$/.test(elem)
          ? parseInt(elem) / maxValueOfOpacity
          : 0.75;
      }
    );
    const sizeFilter = (headers?.[filterValue?.['Size']] || [])?.map(
      (elem: string) => {
        return /^-?\d*\.?\d+$/.test(elem)
          ? (parseInt(elem) / maxValueOfSize) * 50
          : 18;
      }
    );

    return { opacityFilter, sizeFilter };
  }

  generateChart() {
    const {
      csvData,
      axisValue,
      selectedMap,
      filterValue,
      createFrames,
      createLayout,
      createFiltersValues,
    } = this;
    if (Object.keys(csvData || {}).length > 0 && this.selectedMap) {
      const { x: selectedxAxis, y: selectedyAxis } = axisValue;
      if (!(selectedxAxis.length || selectedyAxis.length)) return;
      const { headers } = csvData;
      const selectedGraph = selectedMap
        ? graphTypeList.find(
            (graph: IGraphTypes) => graph.title === selectedMap
          )
        : graphTypeList[0];

      const { opacityFilter, sizeFilter } = createFiltersValues(
        csvData,
        filterValue
      );

      const newData = selectedxAxis
        ?.map((x: any) => {
          const yAxis = selectedyAxis.length
            ? selectedyAxis
            : [selectedyAxis[0]];

          // const containsOnlyNum = headers?.[x]?.every((item: string) =>
          //   /^-?\d*\.?\d+$/.test(item)
          // );
          let pieValue: any[] = headers?.[selectedyAxis[0]];
          let pieLabels: any[] = headers?.[x];

          // if (selectedGraph?.type === 'pie' && containsOnlyNum) {
          //   [pieLabels, pieValue] = [pieValue, pieLabels];
          // }

          return yAxis.map((y: any, i: number) => ({
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
            name: y,
            barmode: selectedGraph?.mode,
            autobinx: false,
            ...(sizeFilter?.length && selectedGraph?.type == 'bar'
              ? { width: sizeFilter.map((elem: number) => elem / 25) }
              : {}),
            marker: {
              ...selectedGraph?.marker,
              opacity: opacityFilter.length ? opacityFilter : 0.75, // from filter
              size: sizeFilter?.length ? sizeFilter : 12,
            },
            // transforms: [
            //   {
            //     type: 'groupby',
            //     groups: headers?.[x],
            //   },
            // ],
          }));
        })
        .flat();

      // newData = newData?.flatMap((innerArray: any[]) => [...innerArray]);
      const frames: any = []; // createFrames(newData);
      const layout: any = createLayout(selectedGraph, frames);
      // if (frames.length) {
      //   layout.sliders[0].steps = frames.map((frame: any) => ({
      //     label: frame.name,
      //     method: 'animate',
      //     args: [
      //       [frame.name],
      //       {
      //         mode: 'immediate',
      //         transition: { duration: 0 },
      //         frame: { duration: 0, redraw: false },
      //       },
      //     ],
      //   }));
      // }
      Plotly?.newPlot('graph-box', {
        data: newData,
        layout,
        // frames,
        config: { showSendToCloud: true },
      });
    }
  }
}

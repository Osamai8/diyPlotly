import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  GRAPH,
  IGraphTypes,
  graphTypeList,
  pieColorPalette,
} from 'src/assets/dashboard.assets';

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
  PIE_GRID_COL_COUNT = 2;
  isDarkMode = false;
  lightLayout = {
    plot_bgcolor: '#FFFFFF',
    paper_bgcolor: '#FFFFFF',
    font: {
      color: '#000000',
    },
  };
  darkLayout = {
    plot_bgcolor: '#2B2B2B',
    paper_bgcolor: '#2B2B2B',
    font: {
      color: '#FFFFFF',
    },
  };

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
      this.configureChart();
    }
    if (changes['selectedAxisValues']?.currentValue) {
      const selected = changes['selectedAxisValues']?.currentValue;
      this.axisValue = { ...this.axisValue, ...selected };
      this.configureChart();
    }
    if (changes['selectedMapType']?.currentValue.length) {
      this.selectedMap = changes['selectedMapType']?.currentValue;
      if (this.selectedMap === GRAPH.PIE.type) {
        this.clearInputValues();
      }
      this.configureChart();
    }
    if (changes['filter']?.currentValue) {
      const selected = changes['filter']?.currentValue;
      this.filterValue = { ...this.filterValue, ...selected };
      this.configureChart();
    }
  }
  createLayout = (
    selectedGraph: IGraphTypes | undefined,
    dataLength: number
  ) => {
    if (selectedGraph?.type) {
      switch (selectedGraph.type) {
        case GRAPH.COXCOMB.type:
          return {
            // title: "Wind Speed Distribution in Laurel, NE",
            font: { size: 16 },
            legend: { font: { size: 16 } },
            polar: {
              // barmode: "overlay",
              bargap: 0,
              radialaxis: { showticklabels: false, visible: false },
              angularaxis: { showticklabels: false, color: '#ffffff' },
            },
            hovermode: 'closest',
            // colorway: string[], // color pallete
          };
        case GRAPH.PIE.type:
          return {
            grid: {
              rows: Math.ceil(dataLength / this.PIE_GRID_COL_COUNT),
              columns: dataLength > 1 ? this.PIE_GRID_COL_COUNT : 0,
            },
            hovermode: 'closest',
            // colorway: string[], // color pallete
          };
        default:
          return {
            autosize: true,
            xaxis: {
              tickson: 'boundaries',
              ticklen: 15,
              showdividers: true,
              dividercolor: 'grey',
              dividerwidth: 2,
              title: {
                text: this.axisValue.x.join(', '),
              },
            },
            yaxis: {
              tickson: 'boundaries',
              ticklen: 15,
              showdividers: true,
              dividercolor: 'grey',
              dividerwidth: 2,
              title: {
                text: this.axisValue.y.join(', '),
              },
            },
            barmode: selectedGraph?.mode || '',
            template: 'none',
            hovermode: 'closest',
            // colorway: string[], // color pallete,
            // plot_bgcolor: '#2B2B2B',
            // paper_bgcolor: '#2B2B2B',
            // font: {
            //   color: '#FFFFFF',
            // },
          };
      }
    }
    return {};
  };

  createFrames = (fullData: any) => {
    const framesArray: any[] = [];
    if (this.selectedMap?.toLowerCase() === GRAPH.PIE.type) return framesArray;
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

  createPieChartVariantsData(
    labels: any[],
    values: any[],
    currentGraph: IGraphTypes | undefined
  ): { labels: any[]; values: any[]; colors: string[] } {
    if (!values) return { values, labels, colors: [] };
    const clonedValues = [...values];
    const clonedLabels = labels ? [...labels] : [];
    const colorPalette: string[] = [];
    if (currentGraph?.mode === GRAPH.ELECTION_DONUT.mode) {
      const sum: number = values.reduce(
        (accumulator, currentValue, i: number) => {
          colorPalette.push(pieColorPalette[i % pieColorPalette.length]);
          return (accumulator += /^\d/.test(currentValue) ? +currentValue : 0);
        },
        0
      );

      const get45percent = sum * 0.67;
      clonedValues?.push(get45percent.toString()) || [];
      clonedLabels?.push('') || [];
      colorPalette.push('#FFFFFF');

      return {
        values: clonedValues,
        labels: clonedLabels,
        colors: colorPalette,
      };
    }
    return {
      values: values,
      labels: labels,
      colors: colorPalette,
    };
  }

  configureChart() {
    const {
      csvData,
      axisValue,
      selectedMap,
      filterValue,
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
        ?.map((x: any, index: number) => {
          const yAxis = selectedyAxis.length
            ? selectedyAxis
            : [selectedyAxis[0]];

          // for pie type only
          if (selectedGraph?.type === GRAPH.PIE.type) {
            // const containsOnlyNum = headers?.[x]?.every((item: string) =>
            //   /^-?\d*\.?\d+$/.test(item)
            // );
            let pieValue: any[] = headers?.[x];
            let pieLabels: any[] = headers?.[x];

            const {
              values,
              labels,
              colors: piePalette,
            } = this.createPieChartVariantsData(
              pieValue,
              pieLabels,
              selectedGraph
            );
            return {
              hoverinfo: 'label+percent+name',
              textinfo: 'none',
              hovertemplate: labels.map((elem: string) =>
                elem.length
                  ? '%{label}: %{value} units<br>Percentage: %{percent}'
                  : ''
              ),

              values: values,
              labels: labels,
              hole: selectedGraph.hole || 0,
              type: selectedGraph?.type,
              name: x,
              marker: selectedGraph?.marker || {
                colors: piePalette,
              },
              domain: {
                column: index % 2,
                row: Math.floor(index / 2),
              },
              rotation: 110, //need to be same for election chart
            };
          }
          if (selectedGraph?.type === GRAPH.COXCOMB.type) {
            return {
              r: headers?.[x] || [],
              // theta: [', 'N-E', 'East', 'S-E', 'South', 'S-W', 'West', 'N-W'],
              name: x,
              marker: selectedGraph?.marker || {},
              type: selectedGraph.type,
              hoverinfo: 'all',
            };
          }

          return yAxis.map((y: any, i: number) => ({
            x: headers?.[x] || [],
            y: headers?.[y] || [],
            type: selectedGraph?.type,
            mode: selectedGraph?.mode,
            fill: selectedGraph?.fill,
            name: y,
            orientation: selectedGraph?.orientation || '',
            autobinx: false,
            ...(sizeFilter?.length && selectedGraph?.type === GRAPH.BAR.type
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
      this.plotGraph(newData, selectedGraph);
    }
  }
  togglechartTheme() {
    if (this.isDarkMode) Plotly.relayout('graph-box', this.lightLayout);
    else Plotly.relayout('graph-box', this.darkLayout);
    this.isDarkMode = !this.isDarkMode;
  }
  addOnConfigs = {
    showSendToCloud: true,
    editable: true,
    displaylogo: false,
    showEditInChartStudio: false,
    template: 'plotly_dark',
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoom2d'],
    // modeBarButtonsToAdd: [
    //   {
    //     name: 'color toggler',
    //     icon: 'k',
    //     click: this.togglechartTheme,
    //   },
    // ],
  };

  async plotGraph(mapData: any, selectedGraphObj: IGraphTypes | undefined) {
    // const frames: any = []; // createFrames(newData);
    const layout: any = this.createLayout(selectedGraphObj, mapData.length);
    const plotResponse = await Plotly?.newPlot('graph-box', {
      data: mapData,
      layout,
      config: this.addOnConfigs,
    });

    plotResponse.on('plotly_click', (data: any) => {
      if (selectedGraphObj?.mode === GRAPH.LINE.mode) {
        var curveNumber = data.points[0].curveNumber;
        var vals = plotResponse.data.map((_: any, i: number) =>
          i === curveNumber ? 1 : 0.3
        );
        Plotly.restyle(plotResponse, 'opacity', vals);
      }
    });
  }
}

export interface IGraphTypes {
  title: string;
  type: string;
  mode: string;
  fill?: string;
  marker?: any;
  axisCount: 1 | 2 | 3;
}

export const graphTypeList: IGraphTypes[] = [
  { title: 'Bar', type: 'bar', mode: 'stack|group', axisCount: 2 },
  {
    title: 'Scatter',
    type: 'scatter',
    mode: 'markers',
    marker: {},
    axisCount: 2,
  },
  {
    title: 'Lines + Scatter',
    type: 'scatter',
    mode: 'lines+markers',
    axisCount: 2,
  },
  { title: 'Line', type: 'scatter', mode: 'lines', axisCount: 2 },
  { title: 'Pie', type: 'pie', mode: '', axisCount: 1 },

  {
    title: 'Bubble',
    type: 'scatter',
    mode: 'markers',
    marker: {
      line: {
        width: 1.5,
      },
    },
    axisCount: 2,
  },
  {
    title: 'Area',
    type: 'scatter',
    mode: 'none',
    fill: 'toself',
    axisCount: 2,
  },
  // { title: 'Treemap', type: 'treemap', mode: '' ,axisCount:1},
  { title: 'Box', type: 'box', mode: 'overlay', axisCount: 2 },
  { title: 'Histogram', type: 'histogram', mode: '', axisCount: 2 },
  { title: 'Histogram2d', type: 'histogram2d', mode: '', axisCount: 2 },
  { title: 'Waterfall', type: 'waterfall', mode: '', axisCount: 2 },
  // { title: 'Candlestick', type: 'candlestick', mode: '' ,axisCount:2},
];

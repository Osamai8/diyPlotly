export interface IGraphTypes {
  title: string;
  type: string;
  mode: string;
  fill?: string;
  marker?: any;
  orientation?: 'h' | '';
  axisCount: 1 | 2 | 3;
  hole?: number;
}

export const GRAPH = {
  BAR: { type: 'bar', mode: 'group' }, //SINGLE SELECT
  STACKED: { type: 'bar', mode: 'stack' },
  SPLIT: { type: 'bar', mode: 'overlay' }, //SINGLE SELECT
  COLUMN: { type: 'bar', mode: 'group' }, //SINGLE SELECT
  STACKED_COLUMN: { type: 'bar', mode: 'stack' },
  BUBBLE: { type: 'scatter', mode: 'markers' },
  LINE_SCATTER: { type: 'scatter', mode: 'lines+markers' },
  LINE: { type: 'scatter', mode: 'lines' },
  PIE: { type: 'pie', mode: 'pie' },
  DONUT: { type: 'pie', mode: 'donut' },
  AREA: { type: 'scatter', mode: '' },
  BOX: { type: 'box', mode: 'overlay' },
  ELECTION_DONUT: { type: 'pie', mode: 'election' },
  COXCOMB: { type: 'barpolar', mode: '' },
  RANGE: { type: '', mode: '' },
};

export const graphTypeList: IGraphTypes[] = [
  {
    title: 'Bar',
    type: GRAPH.BAR.type,
    mode: GRAPH.BAR.mode,
    axisCount: 2,
    orientation: 'h',
  },
  {
    title: 'Stacked Bar',
    type: GRAPH.STACKED.type,
    mode: GRAPH.STACKED.mode,
    axisCount: 2,
    orientation: 'h',
  },
  {
    title: 'Split Bar',
    type: GRAPH.SPLIT.type,
    mode: GRAPH.SPLIT.mode,
    axisCount: 2,
    orientation: 'h',
  },
  {
    title: 'Column',
    type: GRAPH.COLUMN.type,
    mode: GRAPH.COLUMN.mode,
    axisCount: 2,
    orientation: '',
  },
  {
    title: 'Stacked Column',
    type: GRAPH.STACKED_COLUMN.type,
    mode: GRAPH.STACKED_COLUMN.mode,
    axisCount: 2,
    orientation: '',
  },
  {
    title: 'Line',
    type: GRAPH.LINE.type,
    mode: GRAPH.LINE.mode,
    axisCount: 2,
  },
  {
    title: 'Pie',
    type: GRAPH.PIE.type,
    mode: GRAPH.PIE.mode,
    axisCount: 1,
  },
  {
    title: 'Donut',
    type: GRAPH.DONUT.type,
    mode: GRAPH.DONUT.mode,
    axisCount: 1,
    hole: 0.4,
  },

  {
    title: 'Bubble',
    type: GRAPH.BUBBLE.type,
    mode: GRAPH.BUBBLE.mode,
    marker: {
      line: {
        width: 1.5,
      },
    },
    axisCount: 2,
  },
  {
    title: 'Area',
    type: GRAPH.AREA.type,
    mode: GRAPH.AREA.mode,
    fill: 'tozeroy',
    axisCount: 2,
  },
  {
    title: 'Election Donut',
    type: GRAPH.ELECTION_DONUT.type,
    mode: GRAPH.ELECTION_DONUT.mode,
    axisCount: 1,
    hole: 0.3,
  },
  {
    title: 'Coxcomb',
    type: GRAPH.COXCOMB.type,
    mode: GRAPH.COXCOMB.mode,
    axisCount: 1,
  },
  // {
  //   title: 'Lines + Scatter',
  //   type: GRAPH.LINE_SCATTER.type,
  //   mode: GRAPH.LINE_SCATTER.mode,
  //   axisCount: 2,
  // },
  // { title: 'Treemap', type: 'treemap', mode: '' ,axisCount:1},
  // { title: 'Histogram', type: 'histogram', mode: '', axisCount: 2 },
  // { title: 'Histogram2d', type: 'histogram2d', mode: '', axisCount: 2 },
  // { title: 'Waterfall', type: 'waterfall', mode: '', axisCount: 2 },
  // { title: 'Candlestick', type: 'candlestick', mode: '', axisCount: 2 },
];

export const pieColorPalette = [
  '#B76E79',
  '#E0A8B0',
  '#F1C2D1',
  '#FADCD8',
  '#F8D7DA',
  '#D8A8A6',
  '#E6B8B8',
  '#E8B6B7',
  '#F4D7D9',
  '#F4C2C2',
];

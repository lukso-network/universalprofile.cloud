import { describe, it, expect, beforeEach } from 'vitest';
import { toGridLayoutItems, toLSP27TheGrid } from '../gridLayout';

const TEST_LSP27_THE_GRID: LSP27TheGrid = [
  {
    type: GridWidgetType.TITLE_LINK,
    width: 1,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.TEXT,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IFRAME,
    width: 1,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IMAGE,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
];

const TEST_GRID_VARIANT_1: LSP27TheGrid = [
  {
    type: GridWidgetType.IMAGE,
    width: 2,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.TEXT,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IMAGE,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
];

const TEST_GRID_VARIANT_2: LSP27TheGrid = [
  {
    type: GridWidgetType.IMAGE,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IFRAME,
    width: 2,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.TEXT,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IMAGE,
    width: 2,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
];

const TEST_GRID_VARIANT_3: LSP27TheGrid = [
  {
    type: GridWidgetType.TITLE_LINK,
    width: 1,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.TEXT,
    width: 2,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
];

const TEST_GRID_VARIANT_4: LSP27TheGrid = [
  {
    type: GridWidgetType.IFRAME,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IMAGE,
    width: 1,
    height: 2,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.TEXT,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
  {
    type: GridWidgetType.IMAGE,
    width: 1,
    height: 1,
    properties: { prop1: 'value1', prop2: 'value2' },
  },
];

describe('toGridLayoutItems', () => {
  beforeEach(() => {
    // jest.resetModules();
  })


  it.each([
    { case: 1, gridColumns: 2, grid: TEST_LSP27_THE_GRID, expectedLayout: [
      { i: 0, x: 0, y: 0, w: 1, h: 2, type: GridWidgetType.TITLE_LINK, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 1, x: 1, y: 0, w: 1, h: 1, type: GridWidgetType.TEXT, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 2, x: 1, y: 1, w: 1, h: 2, type: GridWidgetType.IFRAME, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 3, x: 0, y: 2, w: 1, h: 1, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
    ] },
    { case: 2, gridColumns: 2, grid: TEST_GRID_VARIANT_1, expectedLayout: [
      { i: 0, x: 0, y: 0, w: 2, h: 2, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 1, x: 0, y: 2, w: 1, h: 1, type: GridWidgetType.TEXT, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 2, x: 1, y: 2, w: 1, h: 1, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
    ] },
    { case: 3, gridColumns: 2, grid: TEST_GRID_VARIANT_2, expectedLayout: [
      { i: 0, x: 0, y: 0, w: 1, h: 1, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 1, x: 0, y: 1, w: 2, h: 2, type: GridWidgetType.IFRAME, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 2, x: 0, y: 3, w: 1, h: 1, type: GridWidgetType.TEXT, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 3, x: 0, y: 4, w: 2, h: 1, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
    ] },
    { case: 4, gridColumns: 3, grid: TEST_GRID_VARIANT_3, expectedLayout: [
      { i: 0, x: 0, y: 0, w: 1, h: 2, type: GridWidgetType.TITLE_LINK, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 1, x: 1, y: 0, w: 2, h: 1, type: GridWidgetType.TEXT, properties: { prop1: 'value1', prop2: 'value2' } },
    ] },
    { case: 5, gridColumns: 2, grid: TEST_GRID_VARIANT_4, expectedLayout: [
      { i: 0, x: 0, y: 0, w: 1, h: 1, type: GridWidgetType.IFRAME, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 1, x: 1, y: 0, w: 1, h: 2, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
      { i: 2, x: 0, y: 1, w: 1, h: 1, type: GridWidgetType.TEXT, properties: { prop1: 'value1', prop2: 'value2' } }, 
      { i: 3, x: 0, y: 2, w: 1, h: 1, type: GridWidgetType.IMAGE, properties: { prop1: 'value1', prop2: 'value2' } },
    ]},
  ])('should position case=$case widgets correctly in gridColumns=$gridColumns', ({ gridColumns, grid, expectedLayout }) => {
    const gridItems = toGridLayoutItems(grid, gridColumns);
    expect(gridItems).toMatchObject(expectedLayout);
  });

  it.each([
    { gridColumns: 2, grid: TEST_LSP27_THE_GRID },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_1 },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_2 },
    { gridColumns: 3, grid: TEST_GRID_VARIANT_3 },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_4 },
  ])('Invariance: LSP27TheGrid to GridLayoutItem and back with gridColumns=$gridColumns should produce the same original object', ({ gridColumns, grid }) => {
    const gridItems = toGridLayoutItems(grid, gridColumns);
    const gridItemsBack = toLSP27TheGrid(gridItems);
    expect(gridItemsBack).toEqual(grid);
  });

  it.each([
    { gridColumns: 2, grid: TEST_LSP27_THE_GRID },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_1 },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_2 },
    { gridColumns: 3, grid: TEST_GRID_VARIANT_3 },
    { gridColumns: 2, grid: TEST_GRID_VARIANT_4 },
  ])('Invariance: GridLayoutItem to LSP27TheGrid and back with gridColumns=$gridColumns should produce the same original layout', ({ gridColumns, grid }) => {
    const gridItems = toGridLayoutItems(grid, gridColumns);
    const gridFromLayout = toLSP27TheGrid(gridItems);
    const gridLayoutItemsBack = toGridLayoutItems(gridFromLayout, gridColumns);
    expect(gridLayoutItemsBack).toEqual(gridItems);
  });

  it('should handle an empty grid gracefully', () => {
    const emptyGrid: LSP27TheGrid = [];
    const gridItems = toGridLayoutItems(emptyGrid, 2);
    expect(gridItems).toEqual([]);
    const gridItemsBack = toLSP27TheGrid(gridItems);
    expect(gridItemsBack).toEqual(emptyGrid);
  });

  it('should handle a grid with a single widget', () => {
    const singleWidgetGrid: LSP27TheGrid = [
      {
        type: GridWidgetType.TITLE_LINK,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ];
    const gridItems = toGridLayoutItems(singleWidgetGrid, 2);
    expect(gridItems).toMatchObject([
      { i: 0, x: 0, y: 0, w: 1, h: 1, type: GridWidgetType.TITLE_LINK, properties: { prop1: 'value1', prop2: 'value2' } },
    ]);
    const gridItemsBack = toLSP27TheGrid(gridItems);
    expect(gridItemsBack).toEqual(singleWidgetGrid);
  });
});

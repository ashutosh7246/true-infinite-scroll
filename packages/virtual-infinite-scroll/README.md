# Virtual Infinite Scroll

`virtual-infinite-scroll` is a highly customizable React component for infinite scrolling, with the ability to handle dynamic or fixed data sets. It supports features like a **Go to Top** button, **Refresh** functionality, and more. With virtual rendering, it ensures optimal performance even with large datasets.

## Installation

Install the package via npm:

```bash
npm install --save virtual-infinite-scroll

or

yarn add virtual-infinite-scroll

// in code ES6
import InfiniteScroll from 'virtual-infinite-scroll';
// or commonjs
var InfiniteScroll = require('virtual-infinite-scroll');
```

## Features

- **Virtual Infinite Scroll with Fixed Size Window:** Efficiently render only the visible items in the scrollable area.
- **Go to Top Button:** Optional button to quickly scroll back to the top of the list.
- **Refresh Button:** Allows users to refresh or reload the list.

## Using

```jsx
<VirtualInfiniteScroll
  /**
   * listType -->
   * DYNAMIC: Renders a list of items based on dynamic data, typically fetched from an API. The list updates as new data becomes available, allowing for real-time or asynchronous data rendering.
   * FIXED: Renders a static list of items based on a fixed dataset.
   */
  listType="DYNAMIC"
  list={
    list
  } /** Array of objects representing the list, must have size <= totalItems when using dynamic list */
  height={convertVhToPx(
    100
  )} /** The height of the container in px, must be at least 200 */
  chunkSize={
    chunkSize
  } /** Number of items to load per scroll, must be at least 10 */
  Card={Card} /** Card component, rendering individual items */
  /** Optional properties */
  listElementHeight={
    250
  } /** Height of each list element in px, must be at least 10 and default is 200 */
  listGap={
    10
  } /** Gap between list elements in px, must be at least 1 and default is 10 */
  LoadingListComponent={
    LoadingListComponent
  } /** Component to display while loading the list */
  LoadingMoreComponent={
    LoadingMoreComponent
  } /** Component to display while loading more items */
  goToTopProperties={{
    showGoToTop: true /** Flag to show the Go To Top button */,
    GoToTopButtonComponent:
      GoToTopButtonComponent /** Component for Go To Top button */,
    goToTopStyle: {
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      borderRadius: "50%",
    } /** Style properties for the Go to Top button */,
  }} /** Properties to show the Go To Top button */
  refreshListProperties={{
    showRefresh: true /** Flag to show the Refresh button */,
    onRefresh: reset /** Function to be called on refresh button click */,
    RefreshButtonComponent:
      RefreshButtonComponent /** Component for Refresh button */,
    refreshButtonStyle: {
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      borderRadius: "5px",
    } /** Style properties for the Refresh button */,
  }} /** Properties to show the Refresh button */
  /**
   * Properties that vary based on the value of listType.
   * When listType is 'DYNAMIC', these fields are required;
   * otherwise, they are optional for a static list.
   */
  totalItems={
    totalItems
  } /** Total number of items available, must be at least 1 */
  hasMore={hasMore} /** Indicator if more items can be loaded */
  loading={loading} /** Indicator if data is being loaded */
  nextPage={nextPage} /** The next page number to be fetched */
  fetchData={fetchData} /** Function to fetch data, accepts a page number */
/>
```

## Props

### VirtualInfiniteScrollProps

#### List Type Properties

- **`listType`** (`"FIXED"` | `"DYNAMIC"`)
  Defines whether the list has a fixed size or dynamic size.

#### Common Properties (for both `FIXED` and `DYNAMIC`)

- **`totalItems`** (`number`, required in `DYNAMIC`)
  Total number of items in the dataset.

- **`hasMore`** (`boolean`, required in `DYNAMIC`)
  Indicator whether more items can be loaded.

- **`loading`** (`boolean`, required in `DYNAMIC`)
  Indicator if the list is currently loading.

- **`nextPage`** (`number`, required in `DYNAMIC`)
  The next page number to fetch the data.

- **`fetchData`** (`(page: number) => void`, required in `DYNAMIC`)
  Function to fetch more data when scrolling.

- **`chunkSize`** (`number`, required)
  The number of items to load in each scroll fetch. Must be at least 10.

- **`list`** (`Array<{ [key: string]: any }>`, required)
  Array of items to display in the list. In case of `DYNAMIC` only newly fetched data will be passed into `VirtualInfiniteScroll` component.

- **`Card`** (`React.ComponentType<{ item: any }>`, required)
  Component to render each item in the list.

- **`height`** (`number`, required)
  The height of the scrollable container.

- **`listElementHeight`** (`number`, required)
  The height of each individual list item. Must be at least 10.

- **`listGap`** (`number`, required)
  The gap between each list item. Must be at least 1.

- **`LoadingListComponent`** (`React.ComponentType`)
  Component to display while the list is loading.

- **`LoadingMoreComponent`** (`React.ComponentType`)
  Component to display when fetching more items.

#### Go to Top Button Properties (`goToTopProperties`)

- **`showGoToTop`** (`boolean`)
  Optional flag to show the Go to Top button.

- **`GoToTopButtonComponent`** (`React.ComponentType`)
  Component for rendering the Go to Top button.

- **`goToTopStyle`** (`CommonButtonStyle`)
  Style properties for the Go to Top button. See [CommonButtonStyle](#commonbuttonstyle).

#### Refresh Button Properties (`refreshListProperties`)

- **`showRefresh`** (`boolean`)
  Flag to show the refresh button. If `true`, the refresh functionality is enabled.

- **`onRefresh`** (`() => void`)
  Function to reset or refresh the list data.

- **`RefreshButtonComponent`** (`React.ComponentType`)
  Component for rendering the Refresh button.

- **`refreshButtonStyle`** (`CommonButtonStyle`)
  Style properties for the Refresh button. See [CommonButtonStyle](#commonbuttonstyle).

### CommonButtonStyle

Common styling options for both the Go to Top and Refresh buttons.

- **`borderRadius`** (`string`)
  Border radius of the button.

- **`boxShadow`** (`string`)
  Box shadow of the button.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

```

```

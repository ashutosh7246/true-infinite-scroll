interface CommonButtonStyle {
  /** Border radius of the button */
  borderRadius?: string;
  /** Box shadow of the button */
  boxShadow?: string;
}

interface GoToTop {
  /** Flag to show the Go To Top button */
  showGoToTop?: boolean;
  /** Component for Go To Top button */
  GoToTopButton?: React.ComponentType;
  /** Style properties for the Go to Top button */
  goToTopStyle?: CommonButtonStyle;
}

interface RefreshButton {
  /** Component for Refresh button */
  RefreshButton?: React.ComponentType;
  /** Style properties for the Go to Top button */
  refreshButtonStyle?: CommonButtonStyle;
}

interface RefreshPresent extends RefreshButton {
  /** Flag to show the Refresh button */
  showRefresh?: true;
  /** Function to reset data */
  onRefresh: () => void;
}

interface RefreshNotPresent extends RefreshButton {
  /** Flag to show the Refresh button */
  showRefresh?: false;
  /** Function to reset data */
  onRefresh?: () => void;
}

type ListRefreshProps = RefreshPresent | RefreshNotPresent;

interface FixedProps {
  listType: "FIXED";
  /** Total number of items available, must be at least 1 */
  totalItems?: number; // totalItems >= 1
  /** Indicator if more items can be loaded */
  hasMore?: boolean;
  /** Indicator if data is being loaded */
  loading?: boolean;
  /** The next page number to be fetched */
  nextPage?: number; // listSize <= currentPage * chunkSize
  /** Function to fetch data, accepts a page number */
  fetchData?: (page: number) => void;
}

interface DynamicProps {
  listType: "DYNAMIC";
  /** Total number of items available, must be at least 1 */
  totalItems: number; // totalItems >= 1
  /** Indicator if more items can be loaded */
  hasMore: boolean;
  /** Indicator if data is being loaded */
  loading: boolean;
  /** The next page number to be fetched */
  nextPage: number; // listSize <= currentPage * chunkSize
  /** Function to fetch data, accepts a page number */
  fetchData: (page: number) => void;
}

interface BaseProps {
  /** Properties to show the Go To Top button */
  goToTop?: GoToTop;
  /** Properties to show the Refresh button */
  refreshList?: ListRefreshProps;
  /** Height of each list element, must be at least 10 */
  listElementHeight?: number; // listElementHeight >= 10
  /** Gap between list elements, must be at least 1 */
  listGap?: number; // listGap >= 1
  /** Number of items to load per fetch, must be at least 10 */
  chunkSize: number; // chunkSize >= 10
  /** Card component, rendering individual items */
  Card: React.ComponentType<{ item: any }>;
  /** The height of the container, must be at least 200 */
  height: number; // height >= 200
  /** Component to display while loading the list */
  LoadingList?: React.ComponentType;
  /** Component to display while loading more items */
  LoadingMore?: React.ComponentType;
  /** Array of objects representing the list, must have size <= totalItems */
  list: Array<{ [key: string]: any }>; // listSize <= totalItems
}

type ListProps = FixedProps | DynamicProps;

export type InfiniteScrollProps = ListProps & BaseProps;

export interface ScrollProps extends BaseProps {
  /** Total number of items available, must be at least 1 */
  totalItems: number; // totalItems >= 1
  /** Indicator if more items can be loaded */
  hasMore: boolean;
  /** Indicator if data is being loaded */
  loading: boolean;
  /** The next page number to be fetched */
  nextPage: number; // listSize <= currentPage * chunkSize
  /** Function to fetch data, accepts a page number */
  fetchData: (page: number) => void;
}

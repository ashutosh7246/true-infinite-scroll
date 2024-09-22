interface CommonButtonStyle {
  /** Border radius of the button */
  borderRadius?: string;
  /** Box shadow of the button */
  boxShadow?: string;
}

interface GoToTopProps {
  /** Flag to show the Go To Top button */
  showGoToTop?: boolean;
  /** Component for Go To Top button */
  GoToTopButtonComponent?: React.ComponentType;
  /** Style properties for the Go to Top button */
  goToTopStyle?: CommonButtonStyle;
}

interface RefreshButtonProps {
  /** Component for Refresh button */
  RefreshButtonComponent?: React.ComponentType;
  /** Style properties for the Refresh button */
  refreshButtonStyle?: CommonButtonStyle;
}

interface RefreshPresent extends RefreshButtonProps {
  /** Flag to show the Refresh button */
  showRefresh?: true;
  /** Function to be called on refresh button click */
  onRefresh: () => void;
}

interface RefreshNotPresent extends RefreshButtonProps {
  /** Flag to show the Refresh button */
  showRefresh?: false;
  /** Function to be called on refresh button click */
  onRefresh?: () => void;
}

type ListRefreshProps = RefreshPresent | RefreshNotPresent;

interface FixedProps {
  /**
   * Renders a static list of items based on a fixed dataset.
   */
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
  /**
   * Renders a list of items based on dynamic data, typically fetched from an API.
   * The list updates as new data becomes available, allowing for real-time or asynchronous data rendering.
   */
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
  goToTopProperties?: GoToTopProps;
  /** Properties to show the Refresh button */
  refreshListProperties?: ListRefreshProps;
  /** Height of each list element in px, must be at least 10 */
  listElementHeight?: number; // listElementHeight >= 10
  /** Gap between list elements in px, must be at least 1 */
  listGap?: number; // listGap >= 1
  /** Number of items to load per scroll, must be at least 10 */
  chunkSize: number; // chunkSize >= 10
  /** Card component, rendering individual items */
  Card: React.ComponentType<{ item: any }>;
  /** The height of the container  in px, must be at least 200 */
  height: number; // height >= 200
  /** Component to display while loading the list */
  LoadingListComponent?: React.ComponentType;
  /** Component to display while loading more items */
  LoadingMoreComponent?: React.ComponentType;
  /** Array of objects representing the list, must have size <= totalItems when using dynamic list */
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

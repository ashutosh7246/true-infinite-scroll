import React, { useEffect } from "react";
import { InfiniteScrollProps } from "./types";
import Scroll from "./Scroll";
import useFixedList from "./useFixedList";

const VirtualInfiniteScroll: React.FC<InfiniteScrollProps> = ({
  totalItems,
  list,
  hasMore,
  loading,
  nextPage,
  fetchData,
  chunkSize,
  Card,
  height,
  listElementHeight,
  listGap,
  LoadingListComponent,
  LoadingMoreComponent,
  goToTopProperties,
  refreshListProperties,
  listType,
}) => {
  const {
    totalItems: fixedTotalItems,
    list: fixedList,
    hasMore: fixedHasMore,
    nextPage: fixedNextPage,
    fetchData: fixedFetchData,
    reset: fixedReset,
  } = useFixedList(chunkSize, listType, list);

  useEffect(() => {
    if (fixedNextPage === 1 && listType === "FIXED") {
      fixedFetchData(fixedNextPage);
    }
    return;
  }, [fixedNextPage, listType]);

  return (
    <Scroll
      totalItems={listType === "FIXED" ? fixedTotalItems : totalItems}
      hasMore={listType === "FIXED" ? fixedHasMore : hasMore}
      loading={listType === "FIXED" ? false : loading}
      nextPage={listType === "FIXED" ? fixedNextPage : nextPage}
      fetchData={listType === "FIXED" ? fixedFetchData : fetchData}
      list={listType === "FIXED" ? fixedList : list}
      chunkSize={chunkSize}
      Card={Card}
      height={height}
      listElementHeight={listElementHeight}
      listGap={listGap}
      LoadingListComponent={LoadingListComponent}
      LoadingMoreComponent={LoadingMoreComponent}
      goToTopProperties={goToTopProperties}
      refreshListProperties={{
        ...refreshListProperties,
        onRefresh:
          listType === "FIXED"
            ? () => {
                fixedReset();
                if (refreshListProperties && refreshListProperties.onRefresh) {
                  refreshListProperties.onRefresh();
                }
              }
            : refreshListProperties && refreshListProperties.onRefresh
            ? refreshListProperties.onRefresh
            : () => {},
      }}
    />
  );
};

export default VirtualInfiniteScroll;

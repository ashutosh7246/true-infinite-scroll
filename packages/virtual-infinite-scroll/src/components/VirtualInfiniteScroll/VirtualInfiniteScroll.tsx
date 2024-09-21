import React, { useEffect } from "react";
import { InfiniteScrollProps } from "./types";
import Scroll from "./Scroll";
import useFixedList from "./useFixedList";

const InfiniteVertualScroll: React.FC<InfiniteScrollProps> = ({
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
  LoadingList,
  LoadingMore,
  goToTop,
  refreshList,
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
      LoadingList={LoadingList}
      LoadingMore={LoadingMore}
      goToTop={goToTop}
      refreshList={{
        ...refreshList,
        onRefresh:
          listType === "FIXED"
            ? () => {
                fixedReset();
                if (refreshList && refreshList.onRefresh) {
                  refreshList.onRefresh();
                }
              }
            : refreshList && refreshList.onRefresh
            ? refreshList.onRefresh
            : () => {},
      }}
    />
  );
};

export default InfiniteVertualScroll;

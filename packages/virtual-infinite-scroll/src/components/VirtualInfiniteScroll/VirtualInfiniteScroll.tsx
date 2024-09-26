import React, { useEffect, useMemo, useRef, useState } from "react";
import { InfiniteScrollProps } from "./types";
import Scroll from "./Scroll";
import useFixedList from "./useFixedList";

const VirtualInfiniteScroll: React.FC<InfiniteScrollProps> = (props) => {
  const { listType, list, nextPage, chunkSize, totalItems } = props;

  const [listKey, setKey] = useState(0);

  useEffect(() => {
    if (listType === "FIXED") {
      setKey((val) => val + 1);
    }
  }, [list, listType]);

  if (
    listType === "DYNAMIC" &&
    (nextPage < 2 ||
      list.length !== chunkSize * (nextPage - 1) ||
      totalItems < chunkSize * (nextPage - 1))
  ) {
    return null;
  }

  return (
    <Proxy
      key={listKey} // Use the reference counter to force re-render in case of FIXED list
      {...props}
    />
  );
};

const Proxy: React.FC<InfiniteScrollProps> = ({
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
  cardUniqueField,
  onListItemClick,
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
      cardUniqueField={cardUniqueField}
      onListItemClick={onListItemClick}
    />
  );
};

export default VirtualInfiniteScroll;

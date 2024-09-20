import React, { useCallback, useMemo } from "react";
import { MutableRefObject } from "react";
import "./index.css";

interface ListProps {
  listItems: Array<{ [key: string]: any }>; // Array of objects representing the list
  loading: boolean; // Indicator if data is being loaded
  Card: React.ComponentType<{ item: any }>; // Card component, rendering individual items
  listElementHeight: number; // Height of each list element
  listGap: number; // Gap between list elements
  LoadingList?: React.ComponentType; // Component to display while loading the list
  LoadingMore?: React.ComponentType; // Component to display while loading more items
  startElmRef: any; // Reference to the starting element
  lastElmRef: any; // Reference to the last element
  listRef: MutableRefObject<HTMLDivElement | null>; // Reference to the container element holding the list
}

const List: React.FC<ListProps> = ({
  listItems = [],
  startElmRef,
  lastElmRef,
  listRef,
  loading,
  Card,
  listElementHeight,
  listGap,
  LoadingList,
  LoadingMore,
}) => {
  const getRef = useCallback(
    (index: number) => {
      return index === 0
        ? startElmRef
        : index === listItems.length - 1
        ? lastElmRef
        : undefined;
    },
    [listItems, startElmRef, lastElmRef]
  );

  const isLast = useCallback(
    (index: number) => {
      return index === listItems.length - 1;
    },
    [listItems]
  );

  return useMemo(() => {
    return (
      <div id="IS-container" className="IS-list-parent" ref={listRef}>
        {listItems.length ? (
          <div className="IS-list" style={{ paddingTop: 0, paddingBottom: 0 }}>
            {listItems.map((item, index) => (
              <div
                style={{
                  height: listElementHeight,
                  marginTop: listGap,
                  marginBottom: isLast(index) ? listGap : 0,
                }}
                ref={getRef(index)}
                key={"IS-list-item-" + index}
                className="IS-list-item IS-last-item"
                id={"IS-list-item-" + index}
              >
                <Card item={item} />
              </div>
            ))}
            {loading && listItems.length ? (
              <div className="IS-loading IS-loading-more">
                {LoadingMore ? <LoadingMore /> : <div>Loading More...</div>}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="IS-loading IS-h-100">
            {LoadingList ? <LoadingList /> : <div>Loading...</div>}
          </div>
        )}
      </div>
    );
  }, [listItems, listRef, loading, listElementHeight, listGap, getRef, isLast]);
};

export default List;

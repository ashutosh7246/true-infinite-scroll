import React, { useCallback, useMemo } from "react";
import "./index.css";

const List = ({
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
    (index) => {
      // return listItems.length >= 20
      //   ? index === 0
      //     ? startElmRef
      //     : index === listItems.length - 1
      //     ? lastElmRef
      //     : undefined
      //   : undefined;
      return index === 0
        ? startElmRef
        : index === listItems.length - 1
        ? lastElmRef
        : undefined;
    },
    [listItems, startElmRef, lastElmRef]
  );

  const isLast = useCallback(
    (index) => {
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
              <div className="IS-loading IS-h-auto">
                <LoadingMore />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="IS-loading IS-h-100">
            <LoadingList />
          </div>
        )}
      </div>
    );
  }, [listItems, listRef, loading, listElementHeight, listGap, getRef, isLast]);
};

export default List;

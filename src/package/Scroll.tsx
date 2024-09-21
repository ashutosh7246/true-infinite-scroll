import React, { useEffect, useRef, useState } from "react";
import List from "./List";
import "./index.css";
import { ScrollProps } from "./InfiniteVertualScroll/types";

const Scroll: React.FC<ScrollProps> = ({
  totalItems,
  list,
  hasMore,
  loading,
  nextPage,
  fetchData,
  chunkSize,
  Card,
  height,
  listElementHeight = 200,
  listGap = 10,
  LoadingList,
  LoadingMore,
  goToTop = {},
  refreshList = {},
}) => {
  const { showGoToTop, GoToTopButton, goToTopStyle } = goToTop;
  const { showRefresh, onRefresh, RefreshButton, refreshButtonStyle } =
    refreshList;
  const currentIndex = useRef<number>(0);
  const startElmObserver = useRef<IntersectionObserver | null>(null);
  const lastElmObserver = useRef<IntersectionObserver | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [listItems, setListItems] = useState<Array<{ [key: string]: any }>>([]);
  const cssUpdating = useRef<boolean>(false);
  const initList = useRef<boolean>(false);
  const refApplied = useRef<boolean>(false);
  const prevPage = useRef<number | undefined>(undefined);
  const goingToTop = useRef<boolean>(false);

  useEffect(() => {
    if (!list || !list.length || initList.current) {
      return;
    }
    if (totalItems <= chunkSize * 2) {
      setListItems(list);
      initList.current = true;
      return;
    }
    if (hasMore && nextPage === 2) {
      fetchData(nextPage);
      return;
    }
    if (list.length < chunkSize * 2) return;
    setListItems(list);
    initList.current = true;
  }, [list, chunkSize, totalItems, hasMore, nextPage]);

  const renderList = () => {
    if (totalItems <= chunkSize * 2) {
      return list.length ? true : false;
    }
    return list.length < chunkSize * 2 ? false : true;
  };

  function isMobileBrowser() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  const applyRef = () => {
    if (refApplied.current) return true;
    const listHeight = Number(height);
    const elementsHeight = listItems.length * (listElementHeight + listGap);
    if (elementsHeight > listHeight + listElementHeight + listGap + 10) {
      refApplied.current = true;
      return true;
    }
    return false;
  };

  const getSlidingWindow = (isScrollDown: boolean) => {
    const increment = chunkSize;
    let firstIndex = isScrollDown
      ? currentIndex.current + increment
      : currentIndex.current - increment;

    return Math.max(firstIndex, 0);
  };

  const recycleDOM = (firstIndex: number) => {
    const items: Array<{ [key: string]: any }> = [];
    const domPageSize = chunkSize * 2;
    for (let i = 0; i < domPageSize; i++) {
      if (list[i + firstIndex]) {
        items.push(list[i + firstIndex]);
      }
    }
    requestAnimationFrame(() => {
      setListItems([...items]);
    });
  };

  const adjustPaddings = (isScrollDown: boolean) => {
    if (currentIndex.current === 0) {
      return;
    }
    cssUpdating.current = true;
    if (!isScrollDown && isMobileBrowser()) {
      // ===============================this code cut off user touch from the screen for mobile devices=============================== //
      const listParent = document.querySelector<HTMLElement>(".IS-list-parent");
      if (listParent) {
        listParent.style.display = "none";
        setTimeout(() => {
          listParent.style.display = "block";
        }, 0);
      }
      // ===============================this code cut off user touch from the screen for mobile devices=============================== //
    }
    const ul = document.querySelector<HTMLElement>(".IS-list");
    if (ul) {
      const currentPadTop = parseFloat(ul.style.paddingTop) || 0;
      const currentPadBottom = parseFloat(ul.style.paddingBottom) || 0;
      const remPaddingsVal =
        (listElementHeight + listGap) * chunkSize + listGap;

      const newPadTop = isScrollDown ? currentPadTop + remPaddingsVal : 0;
      const newPadBottom = isScrollDown ? 0 : currentPadBottom + remPaddingsVal;

      requestAnimationFrame(() => {
        const container =
          document.querySelector<HTMLElement>(".IS-list-parent");
        if (container) {
          const scrollPosition = container.scrollTop;

          ul.style.paddingTop = `${Math.max(newPadTop, 0)}px`;

          if (!isScrollDown) {
            container.scrollTop = scrollPosition - currentPadTop;
          }

          if (!isScrollDown) {
            container.scrollTop = container.scrollTop + remPaddingsVal;
            setTimeout(() => {
              cssUpdating.current = false;
            }, 0);
          } else {
            cssUpdating.current = false;
          }
        }
      });
    }
  };

  const topSentCallback = (entry: IntersectionObserverEntry): void => {
    if (cssUpdating.current || goingToTop.current) return;
    if (currentIndex.current === 0) {
      requestAnimationFrame(() => {
        const container = document.querySelector<HTMLElement>(".IS-list");
        if (container && container.style) {
          container.style.paddingTop = "0px";
        }
      });
    }

    if (entry.isIntersecting && currentIndex.current !== 0) {
      const firstIndex = getSlidingWindow(false);
      adjustPaddings(false);
      recycleDOM(firstIndex);
      currentIndex.current = firstIndex;
    }
  };

  const botSentCallback = (entry: IntersectionObserverEntry): void => {
    const domPageSize = chunkSize * 2;
    if (
      currentIndex.current === totalItems - domPageSize ||
      loading ||
      cssUpdating.current ||
      goingToTop.current
    ) {
      return;
    }

    if (entry.isIntersecting) {
      const firstIndex = getSlidingWindow(true);
      if (list[firstIndex + chunkSize]) {
        currentIndex.current = firstIndex;
        adjustPaddings(true);
        recycleDOM(firstIndex);
      } else if (hasMore) {
        // safe check
        if (prevPage.current === nextPage) {
          console.error(
            "Observer disconnected due to too many calls with the same arguments"
          );
          prevPage.current = undefined;
          return;
        }
        fetchData(nextPage);
        prevPage.current = nextPage;
      }
    }
  };

  const startElmRef = (node: HTMLElement | null) => {
    if (startElmObserver.current) {
      startElmObserver.current.disconnect();
    }

    startElmObserver.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        topSentCallback(entries[0]);
      }
    );

    if (node) {
      startElmObserver.current.observe(node);
    }
  };

  const lastElmRef = (node: HTMLElement | null) => {
    if (lastElmObserver.current) {
      lastElmObserver.current.disconnect();
    }

    lastElmObserver.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        botSentCallback(entries[0]);
      }
    );
    if (node) {
      lastElmObserver.current.observe(node);
    }
  };

  // const isTouching = useRef(false);
  // useEffect(() => {
  //   const handleTouchStart = () => {
  //     isTouching.current = true;
  //   };

  //   const handleTouchEnd = () => {
  //     isTouching.current = false;
  //   };

  //   const handleTouchCancel = () => {
  //     isTouching.current = false;
  //   };

  //   window.addEventListener("touchstart", handleTouchStart);
  //   window.addEventListener("touchend", handleTouchEnd);
  //   window.addEventListener("touchcancel", handleTouchCancel);

  //   return () => {
  //     window.removeEventListener("touchstart", handleTouchStart);
  //     window.removeEventListener("touchend", handleTouchEnd);
  //     window.removeEventListener("touchcancel", handleTouchCancel);
  //   };
  // }, [listItems]);

  const isBottom = () => {
    if (currentIndex.current !== 0) {
      return true;
    }
    return false;
  };

  const scrollToTop = () => {
    // disable scroll when going to top
    document.body.classList.add("disable-touch");
    goingToTop.current = true;
    const ul = document.querySelector<HTMLElement>(".IS-list");
    if (ul) {
      ul.style.paddingTop = `0px`;
      ul.style.paddingBottom = `0px`;
      const listParent = document.querySelector(
        ".IS-list-parent"
      ) as HTMLElement;
      if (listParent) {
        listParent.scrollTop = 0;
      }
      const items: Array<{ [key: string]: any }> = [];
      const domPageSize = chunkSize * 2;
      for (let i = 0; i < domPageSize; i++) {
        if (list[i]) {
          items.push(list[i]);
        }
      }
      requestAnimationFrame(() => {
        setListItems([...items]);
      });
      currentIndex.current = 0;
    }
    goingToTop.current = false;
    document.body.classList.remove("disable-touch");
  };

  const renderScrollTopView = () => {
    return (
      <>
        {renderList() && isBottom() && showGoToTop ? (
          <>
            {GoToTopButton ? (
              <div
                onClick={scrollToTop}
                className="IS-top-custom"
                style={{
                  borderRadius: goToTopStyle?.borderRadius ?? "none",
                  boxShadow: goToTopStyle?.boxShadow ?? "none",
                }}
              >
                <GoToTopButton />
              </div>
            ) : (
              <div onClick={scrollToTop} className="IS-top">
                Top
              </div>
            )}
          </>
        ) : null}
      </>
    );
  };

  const renderRefreshList = () => {
    const refreshState = () => {
      if (!onRefresh) return;
      currentIndex.current = 0;
      startElmObserver.current = null;
      lastElmObserver.current = null;
      listRef.current = null;
      setListItems([]);
      cssUpdating.current = false;
      initList.current = false;
      refApplied.current = false;
      prevPage.current = undefined;
      goingToTop.current = false;
      onRefresh();
    };
    return (
      <>
        {renderList() && showRefresh && currentIndex.current === 0 ? (
          <>
            {RefreshButton ? (
              <div
                onClick={refreshState}
                className="IS-refresh-button-custom"
                style={{
                  borderRadius: refreshButtonStyle?.borderRadius ?? "none",
                  boxShadow: refreshButtonStyle?.boxShadow ?? "none",
                }}
              >
                <RefreshButton />
              </div>
            ) : (
              <div onClick={refreshState} className="IS-refresh-button">
                Refresh
              </div>
            )}
          </>
        ) : null}
      </>
    );
  };

  return (
    <div
      className="IS-list-container"
      style={{ height: height, position: "relative" }}
    >
      {renderRefreshList()}
      {renderScrollTopView()}
      {renderList() ? (
        <List
          listItems={listItems}
          startElmRef={applyRef() ? startElmRef : null}
          lastElmRef={applyRef() ? lastElmRef : null}
          listRef={listRef}
          loading={loading}
          Card={Card}
          listElementHeight={listElementHeight}
          listGap={listGap}
          LoadingList={LoadingList}
          LoadingMore={LoadingMore}
        />
      ) : (
        <div className="IS-loading IS-h-100">
          {LoadingList ? <LoadingList /> : <div>Loading...</div>}
        </div>
      )}
    </div>
  );
};

export default Scroll;

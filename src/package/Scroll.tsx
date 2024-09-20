import React, { useEffect, useRef, useState } from "react";
import List from "./List";
import PropTypes from "prop-types";
import "./index.css";

interface InfiniteScrollProps {
  totalItems: number; // Total number of items available
  list: Array<{ [key: string]: any }>; // Array of objects representing the list
  hasMore: boolean; // Indicator if more items can be loaded
  loading: boolean; // Indicator if data is being loaded
  nextPage: number; // The next page number to be fetched
  fetchData: (page: number) => void; // Function to fetch data, accepts a page number
  chunkSize: number; // Number of items to load per fetch
  Card: React.ComponentType<{ item: any }>; // Card component, rendering individual items
  height: number; // The height of the container
  listElementHeight: number; // Height of each list element
  listGap: number; // Gap between list elements
  LoadingList: React.ComponentType; // Component to display while loading the list
  LoadingMore: React.ComponentType; // Component to display while loading more items
}

const Scroll: React.FC<InfiniteScrollProps> = ({
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
}) => {
  const currentIndex = useRef<number>(0);
  const startElmObserver = useRef<IntersectionObserver | null>(null);
  const lastElmObserver = useRef<IntersectionObserver | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [listItems, setListItems] = useState<Array<{ [key: string]: any }>>([]);
  const cssUpdating = useRef<boolean>(false);
  const initList = useRef<boolean>(false);
  const refApplied = useRef<boolean>(false);
  const prevPage = useRef<number | undefined>(undefined);

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

  // =====================================go to top===================================== //
  const goingToTop = useRef(false);
  const isBottom = () => {
    if (currentIndex.current !== 0) {
      return true;
    }
    return false;
  };
  const goToTop = () => {
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
      goingToTop.current = false;
    }
    document.body.classList.remove("disable-touch");
  };
  // =====================================go to top===================================== //

  return (
    <div
      className="IS-list-container"
      style={{ height: height, position: "relative" }}
    >
      {renderList() && isBottom() ? (
        <div onClick={goToTop} className="IS-top">
          Top
        </div>
      ) : null}
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
          <LoadingList />
        </div>
      )}
    </div>
  );
};

// Scroll.propTypes = {
//   totalItems: (props, propName, componentName) => {
//     if (props[propName] < 0) {
//       return new Error(`${propName} in ${componentName} should be >= 0.`);
//     }
//   },
//   list: (props, propName, componentName) => {
//     const { totalItems, nextPage, chunkSize } = props;
//     const currentPage = nextPage - 1;
//     const maxCurrentItems = currentPage * chunkSize;
//     const listSize = props[propName].length;
//     if (listSize > totalItems) {
//       return new Error(
//         `${propName} length in ${componentName} should be <= ${totalItems}.`
//       );
//     } else if (listSize > maxCurrentItems) {
//       return new Error(
//         `${propName} length in ${componentName} should be <= ${maxCurrentItems}.`
//       );
//     }
//   },
//   chunkSize: (props, propName, componentName) => {
//     if (props[propName] < 10) {
//       return new Error(`${propName} in ${componentName} should be >= 10.`);
//     }
//   },
//   height: (props, propName, componentName) => {
//     const validHeight = /^(?:\d+px|\d+vh)$/;
//     if (!validHeight.test(props[propName])) {
//       return new Error(
//         `${propName} in ${componentName} should be a valid CSS height in px or vh.`
//       );
//     }
//   },
//   Card: (props, propName, componentName) => {
//     const card = props[propName];
//     if (
//       !React.isValidElement(<card />) &&
//       (typeof card !== "function" ||
//         typeof card.prototype.render !== "function")
//     ) {
//       return new Error(
//         `${propName} in ${componentName} should be a valid React component.`
//       );
//     }
//   },
//   fetchData: (props, propName, componentName) => {
//     const fetchData = props[propName];
//     if (typeof fetchData !== "function") {
//       return new Error(`${propName} in ${componentName} should be a function.`);
//     }
//     if (fetchData.length !== 1) {
//       return new Error(
//         `${propName} in ${componentName} should be a function that takes a single argument.`
//       );
//     }
//   },
//   listElementHeight: (props, propName, componentName) => {
//     if (typeof props[propName] !== "number" || props[propName] < 1) {
//       return new Error(
//         `${propName} in ${componentName} should be a number and >= 1.`
//       );
//     }
//   },
//   listGap: (props, propName, componentName) => {
//     if (typeof props[propName] !== "number" || props[propName] < 1) {
//       return new Error(
//         `${propName} in ${componentName} should be a number and >= 1.`
//       );
//     }
//   },
//   LoadingList: (props, propName, componentName) => {
//     const loadingList = props[propName];
//     if (
//       !React.isValidElement(<loadingList />) &&
//       (typeof loadingList !== "function" ||
//         typeof loadingList.prototype.render !== "function")
//     ) {
//       return new Error(
//         `${propName} in ${componentName} should be a valid React component.`
//       );
//     }
//   },
//   LoadingMore: (props, propName, componentName) => {
//     const loadingMore = props[propName];
//     if (
//       !React.isValidElement(<loadingMore />) &&
//       (typeof loadingMore !== "function" ||
//         typeof loadingMore.prototype.render !== "function")
//     ) {
//       return new Error(
//         `${propName} in ${componentName} should be a valid React component.`
//       );
//     }
//   },
//   totalItems: PropTypes.number.isRequired,
//   list: PropTypes.array.isRequired,
//   hasMore: PropTypes.bool.isRequired,
//   loading: PropTypes.bool.isRequired,
//   nextPage: PropTypes.number.isRequired,
//   fetchData: PropTypes.func.isRequired,
//   chunkSize: PropTypes.number.isRequired,
//   Card: PropTypes.elementType.isRequired,
//   LoadingList: PropTypes.elementType.isRequired,
//   LoadingMore: PropTypes.elementType.isRequired,
//   height: PropTypes.string.isRequired,
//   listElementHeight: PropTypes.number.isRequired,
//   listGap: PropTypes.number.isRequired,
// };

export default Scroll;

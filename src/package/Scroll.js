import React, { useEffect, useRef, useState } from "react";
import List from "./List";
import PropTypes from "prop-types";
import "./index.css";

export default function Scroll({
  totalItems,
  list,
  hasMore,
  loading,
  page,
  fetchData,
  chunkSize,
  domPageSize,
  Card,
  height,
  listElementHeight,
  listGap,
  LoadingList,
  LoadingMore,
}) {
  const currentIndex = useRef(0);
  const startElmObserver = useRef();
  const lastElmObserver = useRef();
  const listRef = useRef();
  const [listItems, setListItems] = useState([]);
  const cssUpdating = useRef(false);
  const initList = useRef(false);
  const refApplied = useRef(false);
  const prevPage = useRef(undefined);

  useEffect(() => {
    if (!list || !list.length || initList.current) {
      return;
    }
    if (totalItems <= chunkSize * 2) {
      setListItems(list);
      initList.current = true;
      return;
    }
    if (list.length < chunkSize * 2) return;
    setListItems(list);
    initList.current = true;
  }, [list, chunkSize, totalItems]);

  const renderList = () => {
    if (totalItems <= chunkSize * 2) {
      return list.length ? true : false;
    }
    return list.length < chunkSize * 2 ? false : true;
  };

  const convertVhToPx = (vh) => {
    const viewportHeight = window.innerHeight;
    return (vh * viewportHeight) / 100;
  };

  const applyRef = () => {
    if (refApplied.current) return true;
    const listHeight = height.includes("vh")
      ? convertVhToPx(Number(height.replace("vh", "")))
      : Number(height.replace("px", ""));
    const elementsHeight = listItems.length * (listElementHeight + listGap);
    if (elementsHeight > listHeight + listElementHeight + listGap + 10) {
      refApplied.current = true;
      return true;
    }
    return false;
  };

  const getSlidingWindow = (isScrollDown) => {
    const increment = chunkSize;
    let firstIndex = isScrollDown
      ? currentIndex.current + increment
      : currentIndex.current - increment;

    return Math.max(firstIndex, 0);
  };

  const recycleDOM = (firstIndex) => {
    const items = [];
    for (let i = 0; i < domPageSize; i++) {
      if (list[i + firstIndex]) {
        items.push(list[i + firstIndex]);
      }
    }
    requestAnimationFrame(() => {
      setListItems([...items]);
    });
  };

  const adjustPaddings = (isScrollDown) => {
    if (currentIndex.current === 0) {
      return;
    }
    cssUpdating.current = true;
    const ul = document.querySelector(".IS-list");
    const currentPadTop = parseFloat(ul.style.paddingTop) || 0;
    const currentPadBottom = parseFloat(ul.style.paddingBottom) || 0;
    const remPaddingsVal = (listElementHeight + listGap) * chunkSize + listGap;

    const newPadTop = isScrollDown ? currentPadTop + remPaddingsVal : 0;
    const newPadBottom = isScrollDown ? 0 : currentPadBottom + remPaddingsVal;

    requestAnimationFrame(() => {
      const container = document.querySelector(".IS-list-parent");
      const scrollPosition = container.scrollTop;

      ul.style.paddingTop = `${Math.max(newPadTop, 0)}px`;

      if (!isScrollDown) {
        container.scrollTop = scrollPosition - currentPadTop;
      }

      ul.style.paddingBottom = `${Math.max(newPadBottom, 0)}px`;
      if (!isScrollDown) {
        container.scrollTop = container.scrollTop + remPaddingsVal;
        setTimeout(() => {
          cssUpdating.current = false;
        }, 0);
      } else {
        cssUpdating.current = false;
      }
    });
  };

  const topSentCallback = (entry) => {
    if (cssUpdating.current) return;
    if (currentIndex.current === 0) {
      requestAnimationFrame(() => {
        const container = document.querySelector(".IS-list");
        container.style.paddingTop = "0px";
      });
    }

    if (entry.isIntersecting && currentIndex.current !== 0) {
      const firstIndex = getSlidingWindow(false);
      adjustPaddings(false);
      recycleDOM(firstIndex);
      currentIndex.current = firstIndex;
    }
  };

  const botSentCallback = (entry) => {
    if (
      currentIndex.current === totalItems - domPageSize ||
      loading ||
      cssUpdating.current
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
        if (prevPage.current === page + 1) {
          console.error(
            "Observer disconnected due to too many calls with the same arguments"
          );
          prevPage.current = undefined;
          return;
        }
        fetchData(page + 1);
        prevPage.current = page + 1;
      }
    }
  };

  const startElmRef = (node) => {
    if (startElmObserver.current) startElmObserver.current.disconnect();
    startElmObserver.current = new IntersectionObserver((entries) => {
      topSentCallback(entries[0]);
    });
    if (node) startElmObserver.current.observe(node);
  };

  const lastElmRef = (node) => {
    if (lastElmObserver.current) lastElmObserver.current.disconnect();
    lastElmObserver.current = new IntersectionObserver((entries) => {
      botSentCallback(entries[0]);
    });
    if (node) lastElmObserver.current.observe(node);
  };

  return (
    <div className="IS-list-container" style={{ height: height }}>
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
        <div className="loading">
          <LoadingList />
        </div>
      )}
    </div>
  );
}

Scroll.propTypes = {
  totalItems: (props, propName, componentName) => {
    if (props[propName] < 0) {
      return new Error(`${propName} in ${componentName} should be >= 0.`);
    }
  },
  list: (props, propName, componentName) => {
    const { totalItems, domPageSize } = props;
    if (totalItems > domPageSize && props[propName].length !== domPageSize) {
      return new Error(
        `${propName} length in ${componentName} should be equal to domPageSize when totalItems > domPageSize.`
      );
    } else if (
      totalItems <= domPageSize &&
      props[propName].length > domPageSize
    ) {
      return new Error(
        `${propName} length in ${componentName} should be <= domPageSize when totalItems <= domPageSize.`
      );
    }
  },
  chunkSize: (props, propName, componentName) => {
    if (props[propName] < 10) {
      return new Error(`${propName} in ${componentName} should be >= 10.`);
    }
  },
  domPageSize: (props, propName, componentName) => {
    if (props[propName] !== 2 * props.chunkSize) {
      return new Error(
        `${propName} in ${componentName} should be equal to 2 * chunkSize.`
      );
    }
  },
  height: (props, propName, componentName) => {
    const validHeight = /^(?:\d+px|\d+vh)$/;
    if (!validHeight.test(props[propName])) {
      return new Error(
        `${propName} in ${componentName} should be a valid CSS height in px or vh.`
      );
    }
  },
  Card: (props, propName, componentName) => {
    const card = props[propName];
    if (
      !React.isValidElement(<card />) &&
      (typeof card !== "function" ||
        typeof card.prototype.render !== "function")
    ) {
      return new Error(
        `${propName} in ${componentName} should be a valid React component.`
      );
    }
  },
  fetchData: (props, propName, componentName) => {
    const fetchData = props[propName];
    if (typeof fetchData !== "function") {
      return new Error(`${propName} in ${componentName} should be a function.`);
    }
    if (fetchData.length !== 1) {
      return new Error(
        `${propName} in ${componentName} should be a function that takes a single argument.`
      );
    }
  },
  listElementHeight: (props, propName, componentName) => {
    if (typeof props[propName] !== "number" || props[propName] < 1) {
      return new Error(
        `${propName} in ${componentName} should be a number and >= 1.`
      );
    }
  },
  listGap: (props, propName, componentName) => {
    if (typeof props[propName] !== "number" || props[propName] < 1) {
      return new Error(
        `${propName} in ${componentName} should be a number and >= 1.`
      );
    }
  },
  LoadingList: (props, propName, componentName) => {
    const loadingList = props[propName];
    if (
      !React.isValidElement(<loadingList />) &&
      (typeof loadingList !== "function" ||
        typeof loadingList.prototype.render !== "function")
    ) {
      return new Error(
        `${propName} in ${componentName} should be a valid React component.`
      );
    }
  },
  LoadingMore: (props, propName, componentName) => {
    const loadingMore = props[propName];
    if (
      !React.isValidElement(<loadingMore />) &&
      (typeof loadingMore !== "function" ||
        typeof loadingMore.prototype.render !== "function")
    ) {
      return new Error(
        `${propName} in ${componentName} should be a valid React component.`
      );
    }
  },
  totalItems: PropTypes.number.isRequired,
  list: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  fetchData: PropTypes.func.isRequired,
  chunkSize: PropTypes.number.isRequired,
  domPageSize: PropTypes.number.isRequired,
  Card: PropTypes.elementType.isRequired,
  LoadingList: PropTypes.elementType.isRequired,
  LoadingMore: PropTypes.elementType.isRequired,
  height: PropTypes.string.isRequired,
  listElementHeight: PropTypes.number.isRequired,
  listGap: PropTypes.number.isRequired,
};

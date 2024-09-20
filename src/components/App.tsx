import { useEffect, useRef } from "react";
import Scroll from "../package/Scroll";
import Card from "./card/Card";
// import useScrollData from "../hooks/useScrollData";
import useProducts from "../hooks/useProducts";

const chunkSize = 10;

export default function App() {
  const { totalItems, list, hasMore, loading, nextPage, fetchData, reset } =
    useProducts(chunkSize);

  useEffect(() => {
    if (nextPage === 1) {
      fetchData(nextPage);
    }
    return;
  }, [nextPage]);

  const convertVhToPx = (vh: number) => {
    const viewportHeight = window.innerHeight;
    return (vh * viewportHeight) / 100;
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Scroll
        totalItems={totalItems}
        list={list}
        hasMore={hasMore}
        loading={loading}
        nextPage={nextPage}
        fetchData={fetchData}
        chunkSize={chunkSize}
        Card={Card}
        height={convertVhToPx(100)}
        listElementHeight={250}
        listGap={10}
        LoadingList={LoadingList}
        LoadingMore={LoadingMore}
        goToTop={{
          showGoToTop: true,
          GoToTopButton: GoToTopButton,
          goToTopStyle: {
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            borderRadius: "50%",
          },
        }}
        refreshList={{
          onRefresh: reset,
          showRefresh: true,
          refreshButtonStyle: {
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            borderRadius: "5px",
          },
          RefreshButton: RefreshButton,
        }}
      />
    </div>
  );
}

const RefreshButton = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      Refresh
    </div>
  );
};

const GoToTopButton = () => {
  return (
    <div
      style={{
        height: 50,
        width: 50,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
      }}
    >
      Top
    </div>
  );
};

const LoadingList = () => {
  return <div style={{ padding: 10 }}>Loading...</div>;
};

const LoadingMore = () => {
  return <div style={{ padding: 10 }}>Loading More...</div>;
};

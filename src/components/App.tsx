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
      />
    </div>
  );
}

const LoadingList = () => {
  return <div style={{ padding: 10 }}>Loading...</div>;
};

const LoadingMore = () => {
  return <div style={{ padding: 10 }}>Loading More...</div>;
};
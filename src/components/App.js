import { useEffect } from "react";
import Scroll from "../package/Scroll";
import Card from "./card/Card";
// import useScrollData from "../hooks/useScrollData";
import useProducts from "../hooks/useProducts";

const chunkSize = 10;
const domPageSize = chunkSize * 2;

export default function App() {
  const { totalItems, list, hasMore, loading, page, fetchData } =
    useProducts(chunkSize);

  useEffect(() => {
    if (page === 0) {
      fetchData(page + 1);
      return;
    }
    if (page === 1 && hasMore) {
      fetchData(page + 1);
      return;
    }
  }, [page, hasMore]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Scroll
        totalItems={totalItems}
        list={list}
        hasMore={hasMore}
        loading={loading}
        page={page}
        fetchData={fetchData}
        chunkSize={chunkSize}
        domPageSize={domPageSize}
        Card={Card}
        height={"100vh"}
        listElementHeight={100}
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

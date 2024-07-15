import { useEffect } from "react";
import Scroll from "./components/Scroll";
import Card from "./components/card/Card";
import useScrollData from "./hooks/useScrollData";
import "./index.css";
import useProducts from "./hooks/useProducts";

const chunkSize = 10;
const domPageSize = chunkSize * 2;

export default function App() {
  const { maxItemCount, list, hasMore, loading, error, page, fetchData } =
    useScrollData(chunkSize);

  // const { maxItemCount, list, hasMore, loading, error, page, fetchData } =
  //   useProducts(chunkSize);

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
    <Scroll
      maxItemCount={maxItemCount}
      list={list}
      hasMore={hasMore}
      loading={loading}
      error={error}
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
  );
}

const LoadingList = () => {
  return <>Loading...</>;
};

const LoadingMore = () => {
  return <>Loading...</>;
};

import { useRef, useState } from "react";

function useProducts(chunkSize) {
  const [nextPage, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [totalItems, setMaxItemCount] = useState(0);

  const counter = useRef(0);

  const fetchData = (nextPage) => {
    setLoading(true);
    fetch(
      `https://dummyjson.com/products?limit=${chunkSize}&skip=${
        (nextPage - 1) * chunkSize
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        // ====================================================
        // for testing purpose
        // if (nextPage === 5 && counter.current < 5) {
        //   counter.current++;
        //   throw new Error("break it");
        // }
        // counter.current = 0;
        // ====================================================
        setList((lst) => [...lst, ...res.products]);
        if (list.length + res.products.length >= res.total) {
          setHasMore(false);
        }
        setError(false);
        setMaxItemCount(res.total);
        const currentPage = res.skip / res.limit + 1;
        setNextPage(currentPage + 1);
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const reset = () => {
    setHasMore(true);
    setError(false);
    setLoading(false);
    setList([]);
    setMaxItemCount(0);
    setNextPage(1);
  };

  return {
    totalItems,
    list,
    hasMore,
    loading,
    error,
    nextPage,
    fetchData,
    reset,
  };
}

export default useProducts;

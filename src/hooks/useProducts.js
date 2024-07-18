import { useRef, useState } from "react";

function useProducts(chunkSize) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [totalItems, setMaxItemCount] = useState(0);

  const counter = useRef(0);

  const fetchData = (page) => {
    setLoading(true);
    fetch(
      `https://dummyjson.com/products?limit=${chunkSize}&skip=${
        (page - 1) * chunkSize
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        // ====================================================
        // for testing purpose
        if (page === 5 && counter.current < 5) {
          counter.current++;
          throw new Error("break it");
        }
        counter.current = 0;
        // ====================================================
        setList((lst) => [...lst, ...res.products]);
        if (list.length + res.products.length >= res.total) {
          setHasMore(false);
        }
        setError(false);
        setMaxItemCount(res.total);
        setPage(res.skip / res.limit + 1);
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    totalItems,
    list,
    hasMore,
    loading,
    error,
    page,
    fetchData,
  };
}

export default useProducts;

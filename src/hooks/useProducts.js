import { useState } from "react";

function useProducts(chunkSize) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [list, setList] = useState([]);
  const [maxItemCount, setMaxItemCount] = useState(0);

  const fetchData = (page) => {
    setLoading(true);
    fetch(
      `https://dummyjson.com/products?limit=${chunkSize}&skip=${
        (page - 1) * chunkSize
      }`
    )
      .then((res) => res.json())
      .then((res) => {
        setList((lst) => [...lst, ...res.products]);
        if (list.length + res.products.length >= res.total) {
          setHasMore(false);
        }
        setMaxItemCount(res.total);
        setPage(res.skip / res.limit + 1);
      })
      .catch((e) => {
        setError("Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    maxItemCount,
    list,
    hasMore,
    loading,
    error,
    page,
    fetchData,
  };
}

export default useProducts;

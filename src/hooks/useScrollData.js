import { useCallback, useEffect, useMemo, useState } from "react";

var DBData = [];
var ChunkedData = {};
var totalPages = 0;
var maxItemCount = 0;

function useScrollData(chunkSize) {
  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setMore] = useState(true);

  const _getCatImg = () => {
    const randomNum = () => {
      return Math.floor(Math.random() * 100000);
    };
    const url = "https://source.unsplash.com/collection/139386/100x100/?sig=";
    return url + randomNum();
  };
  const cerateChunks = useCallback(() => {
    let pg = 1;
    for (let i = 0; i < DBData.length; i += chunkSize) {
      const chunk = DBData.slice(i, i + chunkSize);
      ChunkedData[pg] = chunk;
      ++pg;
      ++totalPages;
    }
    maxItemCount = totalPages * chunkSize;
  }, [chunkSize]);
  const initDB = useCallback(() => {
    for (let i = 0; i < 420; i++) {
      DBData.push({
        id: i,
        catCounter: i,
        title: `Card ${i + 1}`,
        imgSrc: _getCatImg(),
      });
    }
    cerateChunks();
  }, [cerateChunks]);

  useEffect(() => {
    initDB();
  }, [initDB]);

  const fetchData = (page) => {
    if (page < 1) {
      return;
    }
    if (!hasMore) {
      return;
    }
    if (loading) {
      return;
    }
    setPage(page);
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   if (ChunkedData[page]) {
    //     setList((lst) => [...lst, ...ChunkedData[page]]);
    //   }
    //   if (page >= totalPages) {
    //     setMore(false);
    //   }
    // }, 10);
    setLoading(false);
    if (ChunkedData[page]) {
      setList((lst) => [...lst, ...ChunkedData[page]]);
    }
    if (page >= totalPages) {
      setMore(false);
    }
  };

  // useEffect(() => {
  //   console.log(page);
  //   fetchData(page);
  // }, [page]);

  return {
    maxItemCount,
    list,
    hasMore,
    loading,
    page,
    fetchData,
  };
}

export default useScrollData;

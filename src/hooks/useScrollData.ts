import { useCallback, useEffect, useState } from "react";

interface DataObject {
  [key: string]: any; // Define specific properties as needed
}

interface ChunkedData {
  [key: number]: DataObject[]; // Key as number, value as an object
}

const DBData: DataObject[] = []; // Array of objects
const ChunkedData: ChunkedData = {}; // Object with number keys and object values

var totalPages = 0;
var totalItems = 0;

function useScrollData(chunkSize: number) {
  const [page, setPage] = useState(0);
  const [list, setList] = useState<Array<DataObject>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
    totalItems = totalPages * chunkSize;
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

  const fetchData = (page: number) => {
    if (page < 1) {
      return;
    }
    if (!hasMore) {
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPage(page);
      setLoading(false);
      if (ChunkedData[page]) {
        setList((lst) => [...lst, ...ChunkedData[page]]);
      }
      if (page >= totalPages) {
        setMore(false);
      }
    }, 100);
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

export default useScrollData;

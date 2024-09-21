import { useEffect, useState } from "react";

interface DataObject {
  [key: string]: any; // Define specific properties as needed
}

interface ChunkedData {
  [key: number]: DataObject[]; // Key as number, value as an object
}

const ChunkedData: ChunkedData = {}; // Object with number keys and object values

var totalPages = 0;
var totalItems = 0;

function useFixedList(
  chunkSize: number = 10,
  listType: "FIXED" | "DYNAMIC",
  DB: Array<{ [key: string]: any }>
) {
  const [nextPage, setNextPage] = useState<number>(0);
  const [list, setList] = useState<Array<DataObject>>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = (page: number) => {
    if (page < 1 || !hasMore || !ChunkedData[page]) {
      return;
    }

    setList((lst) => [...lst, ...ChunkedData[page]]);
    setNextPage(page + 1);

    if (page + 1 > totalPages) {
      setHasMore(false);
    }
  };

  const createChunks = () => {
    let pg = 1;
    for (let i = 0; i < DB.length; i += chunkSize) {
      const chunk = DB.slice(i, i + chunkSize);
      ChunkedData[pg] = chunk;
      ++pg;
      ++totalPages;
    }
    totalItems = totalPages * chunkSize;
    setNextPage(1);
  };

  useEffect(() => {
    if (listType === "FIXED" && DB.length) {
      createChunks();
    }
  }, [DB, listType]);

  const reset = () => {
    setHasMore(true);
    setList([]);
    totalPages = 0;
    totalItems = 0;
    setNextPage(1);
  };

  if (listType === "DYNAMIC") {
    // If listType is DYNAMIC, return default values or empty state
    return {
      totalItems: 0,
      list: [],
      hasMore: false,
      nextPage: 0,
      fetchData: () => {},
      reset,
    };
  }

  return {
    totalItems,
    list,
    hasMore,
    nextPage,
    fetchData,
    reset,
  };
}

export default useFixedList;

import { useEffect, useState } from "react";
import Card from "./card/Card";
import useProducts from "../hooks/useProducts";
import { VirtualInfiniteScroll } from "virtual-infinite-scroll";

interface DataObject {
  [key: string]: any; // Define specific properties as needed
}

const chunkSize = 10;
const TabStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  height: 60,
  cursor: "pointer",
};
const HeaderStyle = {
  top: "0px",
  left: "0px",
  padding: "10px",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  zIndex: 9,
};

export default function App() {
  const [listType, setListType] = useState<"FIXED" | "DYNAMIC">("DYNAMIC");
  const [fixedList, setFixedList] = useState<Array<DataObject>>([]);
  const { totalItems, list, hasMore, loading, nextPage, fetchData, reset } =
    useProducts(chunkSize);

  useEffect(() => {
    const DBData: DataObject[] = [];
    for (let i = 0; i < 420; i++) {
      DBData.push({
        id: i,
        catCounter: i,
        title: `Card ${i + 1}`,
      });
    }
    setFixedList(DBData);
  }, []);

  const refreshFixedList = () => {};

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

  const renderHeader = () => {
    return (
      <div style={{ ...HeaderStyle, position: "absolute" }}>
        <div
          onClick={() => {
            if (listType === "DYNAMIC") return;
            setListType("DYNAMIC");
          }}
          style={{
            ...TabStyle,
            backgroundColor: listType === "DYNAMIC" ? "#282828" : "white",
            color: listType === "DYNAMIC" ? "white" : "#282828",
          }}
        >
          Dynamic
        </div>
        <div
          onClick={() => {
            if (listType === "FIXED") return;
            setListType("FIXED");
          }}
          style={{
            ...TabStyle,
            backgroundColor: listType === "FIXED" ? "#282828" : "white",
            color: listType === "FIXED" ? "white" : "#282828",
          }}
        >
          Fixed
        </div>
      </div>
    );
  };

  const onListItemClick = (data: any) => {
    const DBData2: DataObject[] = [];
    for (let i = 0; i < 50; i++) {
      DBData2.push({
        id: `${i}-2`,
        catCounter: i,
        title: `Card ${i + 1}`,
      });
    }
    setFixedList(DBData2);
    console.log(data);
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {renderHeader()}
      {listType === "DYNAMIC" ? (
        <VirtualInfiniteScroll
          key={listType}
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
          LoadingListComponent={LoadingListComponent}
          LoadingMoreComponent={LoadingMoreComponent}
          goToTopProperties={{
            showGoToTop: true,
            GoToTopButtonComponent: GoToTopButtonComponent,
            goToTopStyle: {
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: "50%",
            },
          }}
          refreshListProperties={{
            onRefresh: reset,
            showRefresh: true,
            refreshButtonStyle: {
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: "5px",
            },
            RefreshButtonComponent: RefreshButtonComponent,
          }}
          listType={listType}
          cardUniqueField="id"
          onListItemClick={onListItemClick}
        />
      ) : (
        <VirtualInfiniteScroll
          key={listType}
          list={fixedList}
          chunkSize={chunkSize}
          Card={Card}
          height={convertVhToPx(100)}
          listElementHeight={250}
          listGap={10}
          goToTopProperties={{
            showGoToTop: true,
            GoToTopButtonComponent: GoToTopButtonComponent,
            goToTopStyle: {
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: "50%",
            },
          }}
          refreshListProperties={{
            onRefresh: refreshFixedList,
            showRefresh: true,
            refreshButtonStyle: {
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: "5px",
            },
            RefreshButtonComponent: RefreshButtonComponent,
          }}
          listType={listType}
          cardUniqueField="id"
          onListItemClick={onListItemClick}
        />
      )}
    </div>
  );
}

const RefreshButtonComponent = () => {
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

const GoToTopButtonComponent = () => {
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

const LoadingListComponent = () => {
  return <div style={{ padding: 10 }}>Loading...</div>;
};

const LoadingMoreComponent = () => {
  return <div style={{ padding: 10 }}>Loading More...</div>;
};

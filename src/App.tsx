import "./App.css";
import SelectComponent from "./components/SelectComponent";
import "@fontsource/roboto";
import { useState } from "react";
import TabComponent from "./components/TabComponent";
import ItemComponent from "./components/ItemComponent";
import PaginationComponent from "./components/PaginationComponent";
import HackerNewsLayout from "./layouts/HackerNewsLayout";
import AllView from "./views/AllView";

function App() {
  // const [selection, setSelection] = useState({ id: 0 });
  // const [tab, setTab] = useState({ id: 0 });
  // const [fav, setFav] = useState(true);
  // const [page, setPage] = useState(1);
  return (
    <AllView/>
    // <div style={{ padding: 30 }}>
    //   <TabComponent value={tab} onChange={setTab} />
    //   <SelectComponent
    //     value={selection}
    //     onChange={setSelection}
    //   ></SelectComponent>
    //   <ItemComponent
    //     favorite={fav}
    //     onFavoriteChanged={() => {
    //       console.log("fav should change")
    //       setFav(!fav);
    //     }}
    //     onCLick={() => console.log("item clicked")}
    //   />
    //   <ItemComponent favorite />
    //   <ItemComponent favorite />
    //   <PaginationComponent page={page} totalPages={10} onPageChanged={setPage}/>
    // </div>
  );
}

export default App;

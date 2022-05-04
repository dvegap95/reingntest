import './App.css'
import SelectComponent from './components/SelectComponent'
import "@fontsource/roboto";
import { useState } from 'react';
import TabComponent from './components/TabComponent';

function App() {
  const [selection,setSelection] = useState({id:0});
  const [tab,setTab] = useState({id:0});
  return (
    <>
    <TabComponent value={tab} onChange={setTab}/>
    <SelectComponent value={selection} onChange={setSelection}></SelectComponent>
    
    </>
  )
}

export default App

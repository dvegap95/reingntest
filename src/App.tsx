import './App.css'
import SelectComponent from './components/SelectComponent'
import "@fontsource/roboto";
import { useState } from 'react';

function App() {
  const [selection,setSelection] = useState({id:0});
  return (
    <SelectComponent value={selection} onChange={setSelection}></SelectComponent>
  )
}

export default App

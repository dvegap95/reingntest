import React, { useState } from 'react'
import TabComponent from '../components/TabComponent'
import AllView from '../views/AllView';
import FavesView from '../views/FavesView';


export default function HackerNewsLayout() {
    const [tab, setTab] = useState({ id: 0 });
  return (
    <div>
        HackerNewsLayout
        <TabComponent value={tab} onChange={setTab}/>
        {tab.id ? <FavesView/> : <AllView/> }
    </div>
  )
}

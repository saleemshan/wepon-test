import type { NextPage } from 'next'
import { useEffect, useState, useLayoutEffect} from "react";
import Layout from '../components/shared/Layout'
import Navbar from '../components/Navbar'
import MainPage from '../components/MainPage/MainPage'
import Sidebar from '../components/Sidebar';
import SelectedIcon from '../components/SelectedIcon';
import { useTheme } from '../providers/ThemeContext';
import AppLayout from '../components/AppLayout';

const Home: NextPage = () => {
  const [connectedNetwork, setConnectedNetwork] = useState("");
  return (
    <AppLayout>
      <Sidebar />
      <main className="md:ml-[134px]">
        <Navbar
          setConnectedNetwork={setConnectedNetwork}
        />
        <div className="md:px-12 md:mt-5 pb-[100px] md:pt-9 pt-[110px]">
        <MainPage connectedNetwork={connectedNetwork}/>
        </div>
      </main>
    </AppLayout>
  )
}

export default Home

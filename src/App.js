import './App.css';
import {useEffect} from "react";
import {Route, Routes} from 'react-router-dom'

import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import ProductList from "./components/ProductList/ProductList";
import Form from "./components/Form/Form";

function App() { // eslint-disable-next-line
    const { tg} = useTelegram();

    useEffect(() => {
        tg.ready(); // eslint-disable-next-line
    }, [])

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<ProductList />}/>
                <Route path={'form'} element={<Form />}/>
            </Routes>
        </div>
    );
}

export default App;
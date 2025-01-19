import React, {useState, useCallback, useEffect} from 'react';
import ProductItem from '../ProductItem/ProductItem';
import {useTelegram} from "../../hooks/useTelegram";
import './ProductList.css';

const WEBURL = process.env.REACT_APP_WEBURL;
const wpURL = process.env.REACT_APP_WPURL;
const nodeURL = process.env.REACT_APP_NODEURL;

const products = [
    {id: '1', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: wpURL},
    {id: '2', title: 'Роробка сервера', price: 12000, description: 'Новий сайт з Node.js', img: nodeURL},
    {id: '3', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: wpURL},
    {id: '4', title: 'Роробка сервера', price: 122, description: 'Новий сайт з Node.js', img: nodeURL},
    {id: '5', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: wpURL},
    {id: '6', title: 'Роробка сервера', price: 600, description: 'Новий сайт з Node.js', img: nodeURL},
    {id: '7', title: 'Розробка сайту', price: 5500, description: 'Новий сайт з WordPress', img: wpURL},
    {id: '8', title: 'Роробка сервера', price: 12000, description: 'Новий сайт з Node.js', img: nodeURL},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId, initData} = useTelegram();

    const onSendData =  useCallback(async () => {
        console.log('TG object is:', initData, queryId, tg.initDataUnsafe)
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        const response = await fetch(`${WEBURL}/web-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            console.log(response, response.body);
            throw new Error(`HTTP error! status: ${response.status}`);
        }// eslint-disable-next-line
    }, [addedItems])


    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        } // eslint-disable-next-line
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;




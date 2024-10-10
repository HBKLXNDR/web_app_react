import React, { useState, useCallback, useEffect } from 'react';

import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const WEBURL = process.env.WEBURL;
const wpURL = process.env.WPURL;
const nodeURL = process.env.NODEURL;

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
        return acc += item.price;
    }, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        };
        fetch(`${WEBURL}/web-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit order');
                }
                return response.json();
            })
            .then(result => {
                console.log('Order submitted successfully:', result);
            })
            .catch(error => {
                console.error('Error submitting order:', error);
            });
    }, [addedItems, queryId]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => tg.offEvent('mainButtonClicked', onSendData);
    }, [onSendData, tg]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Придбати на суму ${getTotalPrice(newItems)}`,
            });
        }
    };

    const onAddition = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);
        const div = document.createElement('div');
        const list = document.getElementsByClassName('list')[0];
        list.appendChild(div);

        if (newItems.length === 0) {
            console.log('0 items');
        } else {
            const button = document.createElement('button');
            div.appendChild(button);
            button.className = 'button';
            button.innerText = `Придбати на суму ${getTotalPrice(newItems)}`
        }
    };

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    onAddition={onAddition}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
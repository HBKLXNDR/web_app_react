import React, {useState} from 'react';
import {useCallback, useEffect} from "react";

import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: '1', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '2', title: 'Роробка сервера', price: 12000, description: 'Новий сайт з Node.js', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '3', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '4', title: 'Роробка сервера', price: 122, description: 'Новий сайт з Node.js', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '5', title: 'Розробка сайту', price: 5000, description: 'Новий сайт з WordPress', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '6', title: 'Роробка сервера', price: 600, description: 'Новий сайт з Node.js', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '7', title: 'Розробка сайту', price: 5500, description: 'Новий сайт з WordPress', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
    {id: '8', title: 'Роробка сервера', price: 12000, description: 'Новий сайт з Node.js', img: 'https://soltech.agency/wp-content/uploads/2024/07/Default_Picture_with_white_background_Picture_should_represent_0-1-1-2048x2048.webp'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('https://websites-n7005gurq-alexs-projects-48de2efd.vercel.app/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }) // eslint-disable-next-line
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

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Придбати ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
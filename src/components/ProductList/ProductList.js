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

const getTotalPrice = (items) => items.reduce((acc, item) => acc + item.price, 0);

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg, queryId } = useTelegram();
    const [isLoading, setIsLoading] = useState(false);

    const onAdd = useCallback((product) => {
        const alreadyAdded = addedItems.find((item) => item.id === product.id);
        const newItems = alreadyAdded
            ? addedItems.filter((item) => item.id !== product.id)
            : [...addedItems, product];
        setAddedItems(newItems);
    }, [addedItems]);

    const handleSubmit = async () => {
        const totalPrice = getTotalPrice(addedItems);
        const data = {
            products: addedItems,
            totalPrice,
            queryId: queryId ? queryId : 0
        };

        try {
            setIsLoading(true);

            const response = await fetch(`${WEBURL}/web-data`, {
                method: 'POST', // Use POST method
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify(data), // Convert `data` to a JSON string
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Purchase successful!');
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
        <div className="list">
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    onAdd={onAdd}
                    className="item"
                />
            ))}
        </div>
    <div className="footer">
                <button
                    onClick={handleSubmit}
                    disabled={addedItems.length === 0 || isLoading}
                    className="submit-button"
                >
                    {isLoading ? 'Processing...' : `Придбати на суму ${getTotalPrice(addedItems)} грн`}
                </button>
            </div>
        </div>
    );
};

export default ProductList;
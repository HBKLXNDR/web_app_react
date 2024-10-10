import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({product, className, onAdd, onAddition}) => {

    const onAddHandler = () => {
        onAdd(product);
    }

    const addToCart = () =>{
        onAddition(product)
    }

    return (
        <div className={'product ' + className}>
            <img src = 'https://www.synapseindia.com/assets_newwebsite/images/tc_wp_banner.jpg' alt = 'asset'/>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Вартість: <b>{product.price}</b></span>
            </div>
            <Button className={'add-btn'} onClick={onAddHandler}>
                Додати до кошика
            </Button>
            <Button className={'add-btn'} onClick={addToCart}>
                Додати до кошика
            </Button>

        </div>
    );
};

export default ProductItem;
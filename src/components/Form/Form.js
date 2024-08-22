import React, {useCallback, useEffect, useState} from 'react';
import Joi from 'joi';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [errors, setErrors] = useState({});
    const {tg} = useTelegram();

    // Joi schema definition
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': "Name is required"
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
        number: Joi.number().required().messages({
            'number.base': 'Number must be a valid number',
            'any.required': 'Number is required'
        })
    });

    const validateData = (data) => {
        const {error} = schema.validate(data, {abortEarly: false});
        if (!error) return null;

        const errorMessages = {};
        error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        return errorMessages;
    };

    const onSendData = useCallback(() => {
        const data = {email, name, number: Number(number)};
        const validationErrors = validateData(data);

        if (validationErrors) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            tg.sendData(JSON.stringify(data)); // eslint-disable-next-line
        } // eslint-disable-next-line
    }, [email, name, number, tg]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => tg.offEvent('mainButtonClicked', onSendData);
    }, [onSendData, tg]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Відправити данні',
            onclick: onSendData
        });
    }, [onSendData, tg]);

    useEffect(() => {
        if (number) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }, [number, tg]);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value);
    }

    return (
        <div className={"form"}>
            <h3>Будь ласка, введіть ваші дані</h3>
            <input
                className={'input'}
                type="text"
                placeholder={"Ім'я"}
                value={name}
                onChange={onChangeName}
            />
            {errors.name && <p className="error">{errors.name}</p>}
            <input
                className={'input'}
                type="text"
                placeholder={'Email'}
                value={email}
                onChange={onChangeEmail}
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <input
                className={'input'}
                type="text"
                placeholder={'Номер'}
                value={number}
                onChange={onChangeNumber}
            />
            {errors.number && <p className="error">{errors.number}</p>}
        </div>
    );
};

export default Form;

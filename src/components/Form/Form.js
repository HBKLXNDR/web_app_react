import React, {useCallback, useEffect, useState} from 'react';

import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [subject, setSubject] = useState('physical');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            email,
            name,
            number,
            subject
        }
        tg.sendData(JSON.stringify(data)); // eslint-disable-next-line
    }, [email, name, number, subject])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        } // eslint-disable-next-line
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Відправити данні'
        }) // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(!number) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        } // eslint-disable-next-line
    }, [number])

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeNumber = (e) => {
        setNumber(e.target.value)
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
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
            <input
                className={'input'}
                type="text"
                placeholder={'Email'}
                value={email}
                onChange={onChangeEmail}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Номер'}
                value={number}
                onChange={onChangeNumber}
            />
            <select value={subject} onChange={onChangeSubject} className={'select'}>
                <option value={'physical'}>Фіз. лице</option>
                <option value={'legal'}>Юр. лице</option>
            </select>
        </div>
    );
};

export default Form;
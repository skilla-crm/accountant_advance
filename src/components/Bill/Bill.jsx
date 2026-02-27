import s from './Bill.module.scss';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useDispatch, useSelector } from 'react-redux';
import iconPreview from '../../assets/icons/iconPreview.png';
import { ReactComponent as BadgePro } from '../../assets/icons/badgePro.svg';
import historyblur from '../../assets/images/historyblur.png';
//Api
import { useGetParametersQuery } from '../../redux/ordersApiActions';
//slice
import { setNumberBill } from '../../redux/mainInfo/slice';
import { setPositionsValidation } from '../../redux/validation/slice';
//components
import HeaderDetail from '../HeaderDetail/HeaderDetail';
import MainInfoBlock from '../MainInfoBlock/MainInfoBlock';
import ServicesBlock from '../ServicesBlock/ServicesBlock';
import { HistoryLog } from '../HistoryLog/HistoryLog';
import ProDisabled from '../ProDisabled/ProDisabled';


const Bill = ({ id, type, setType }) => {
    const ispro = document.getElementById(`root_advance`).getAttribute('ispro');
    const { data: parameters, isLoading: isLoadingParams } = useGetParametersQuery();
    const { customer, detail, numberBill, date } = useSelector((state) => state.mainInfo);
    const { positionsValidation } = useSelector((state) => state.validation);
    const { logs } = useSelector(state => state.logs)
    const dispatch = useDispatch()

    useEffect(() => {
        (numberBill == '' || !numberBill) && dispatch(setNumberBill(parameters?.invoice_num))
    }, [parameters])

    const handleResetErrorPositions = () => {
        dispatch(setPositionsValidation(true))
    }

    const openModalPro = () => {
        document?.getElementById('pro-open')?.click();
    };

    return (
        <div className={s.root}>
            <HeaderDetail id={id} type={type} setType={setType} />
            <div className={s.container}>
                <div className={s.left}>
                    <MainInfoBlock parameters={parameters} disabled={type === 'detail'} />
                    <ServicesBlock
                        disabled={type === 'detail'}
                        parameters={parameters}
                        error={!positionsValidation}
                        errorText={'Заполни все поля'}
                        resetError={handleResetErrorPositions}
                    />
                </div>

                <div className={s.right}>
                    <div className={s.preview}>
                        <img src={iconPreview}></img>
                        <p>Предварительный просмотр в разработке</p>
                    </div>

                    {(type === 'detail' || type === 'edit') && ispro === '1' && <HistoryLog logs={logs} />}
                    {(type === 'detail' || type === 'edit') && ispro === '0' && <ProDisabled />}
                </div>
            </div>
        </div>
    )
};

export default Bill;
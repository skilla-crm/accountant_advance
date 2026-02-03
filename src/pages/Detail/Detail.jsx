import s from './Detail.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
//Api
import { useGetBillQuery } from '../../redux/ordersApiActions';
//slice
import {
    setCustomer,
    setContract,
    setDetail,
    setNumberBill,
    setNumberBillFirst,
    setDate,
    setOrders,
    setDraft
} from '../../redux/mainInfo/slice';
import { setPositions } from '../../redux/positions/slice';
import { setLogs } from '../../redux/logs/slice';
//components
import Bill from '../../components/Bill/Bill';
import SceletonBill from '../../components/SceletonBill/SceletonBill';

const Detail = () => {
    const [anim, setAnim] = useState(false)
    const [type, setType] = useState('detail')
    const dispatch = useDispatch();
    const location = useLocation();
    const id = location.pathname?.split('/').pop()
    const { data, currentData, isLoading, isFetching, refetch, isUninitialized } = useGetBillQuery(id);
    const { update } = useSelector((state) => state.updateData);


    //рефетч обновление деталки исполнителя
    useEffect(() => {
        if (update.id == id && !isUninitialized && update.count > 0) {
            refetch()
            return
        }
    }, [update.count, id, isUninitialized])

    useEffect(() => {
        setTimeout(() => {
            setAnim(true)
        })
    }, [])

    useEffect(() => {
        if (data) {
            data?.draft === 1 && setType('draft')
            dispatch(setDraft(data?.draft))
            dispatch(setDate(dayjs(data?.date)))
            dispatch(setNumberBill(data?.number))
            dispatch(setNumberBillFirst(data?.number))
            dispatch(setOrders(data?.orders))
            dispatch(setLogs(data?.logs))

            document.title = `Счет №${data?.number} от ${dayjs(data?.date).format('DD.MM.YYYY')}`



            const rows = data?.rows?.map((el, i) => {
                return {
                    id: i + 1,
                    rate: { id: 999, name_service: el?.description },
                    count: Number(el?.amount),
                    units: el?.unit,
                    code: el?.okei,
                    price: Number(el?.sum_unit),
                    total: Number(el?.sum),
                    date: el?.date
                }
            }
            )
            dispatch(setPositions(rows))
            dispatch(setCustomer(data?.company))
            dispatch(setDetail({ ...data?.partnership, ...data?.details, nds: data?.details?.nds }))

            if (data?.contract) {
                dispatch(setContract(data?.contract))
            } 
        }
    }, [data])

    return (
        <div className={classNames(s.root, anim && s.root_anim)}>
            <SceletonBill isLoading={isLoading} />
            <Bill id={id} type={type} setType={setType} />
        </div>
    )
};

export default Detail;
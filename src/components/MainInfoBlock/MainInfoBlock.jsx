import s from './MainInfoBlock.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
//components
import DropDown from '../Genegal/DropDown/DropDown';
import Customer from '../Customer/Customer';
import Detail from '../Detail/Detail';
import InputData from '../InputData/InputData';
import InputBillNumber from '../InputBillNumber/InputBillNumber';
import DropDownNds from '../DropDownNds/DropDownNds';
import ButtonAdd from '../Genegal/ButtonAdd/ButtonAdd';
import InputListContract from '../Genegal/InputListContract/InputListContract';
import Field from '../Genegal/Field/Field';
//slice
import { setCustomer, setContract, setDetail, setNumberBill, setDate, setNds } from '../../redux/mainInfo/slice';
import { setCustomerValidation, setDetailValidation, setNumberValidation } from '../../redux/validation/slice';



const MainInfoBlock = ({ parameters, disabled }) => {
    const dispatch = useDispatch()
    const { customer, contract, detail, numberBill, numberBillFirst, date, orders, draft, nds } = useSelector((state) => state.mainInfo);
    const { customerValidation, detailValidation, numberValidation } = useSelector((state) => state.validation);
    const [detailsList, setDetailsList] = useState([])

    useEffect(() => {
        if (contract?.partnership_id) {
            const result = parameters?.partnerships_details?.filter(el => el.partnership_id === contract.partnership_id)
            setDetailsList(result)
        } else {
            setDetailsList(parameters?.partnerships_details)
        }
    }, [contract, parameters])

    useEffect(() => {
        if (!customer?.partnership_id) {
            dispatch(setDetail({}))
        }

    }, [customer])

    const handleResetErrorCustomer = () => {
        dispatch(setCustomerValidation(true))
    }

    const handleResetErrorDetail = () => {
        dispatch(setDetailValidation(true))
    }

    const handleResetErrorNumber = () => {
        dispatch(setNumberValidation(true))
    }

    const handleOpenOrder = (e) => {
        const orderId = e.currentTarget.id;
        window.open(`https://lk.skilla.ru/new/orders/order_detail/${orderId}`, '_blank')
    }


    return (
        <div className={s.root}>
            <h3>Основная информация</h3>
            <DropDown
                z={5}
                type={'customer'}
                sub={'Заказчик'}
                list={parameters?.companies_2}
                ListItem={Customer}
                activeItem={customer}
                setActiveItem={data => {
                    dispatch(setCustomer(data))
                    dispatch(setContract(data?.contracts?.[0]))
                    const newDetail = parameters?.partnerships_details?.find(el => el.partnership_id === data?.contracts?.[0]?.partnership_id)
                    dispatch(setDetail({ ...data?.contracts?.[0]?.partnership_details, partnership_name: data?.contracts?.[0]?.partnership_name, partnership_id: data?.contracts?.[0]?.partnership_id, nds: newDetail?.nds }))
                    newDetail && dispatch(setNumberBill(newDetail?.bill_num))
                }}
                disabled={disabled || draft === 1}
                error={!customerValidation}
                errorText={'Заказчик не определен'}
                resetError={handleResetErrorCustomer}
                overlay={true}
            />

            <ButtonAdd
                vis={customer?.contracts?.length === 0 && customer?.id && draft === 0}
                counterpartyId={customer?.id}
            />

            <InputListContract
                disabled={disabled || draft === 1}
                list={customer?.contracts || []}
                value={contract}
                vis={customer?.contracts?.length > 0}
                setValue={(data) => {
                     dispatch(setContract(data))
                    const newDetail = parameters?.partnerships_details?.find(el => el.partnership_id === data?.partnership_id)
                    dispatch(setDetail({ ...data?.partnership_details, partnership_name: data?.partnership_name, partnership_id: data?.partnership_id, nds: newDetail?.nds }))
                    newDetail && dispatch(setNumberBill(newDetail?.bill_num))
                }}
            />

            {/*   <Field
                disabled={disabled || draft === 1}
                vis={detail?.partnership_id}
                sub={'Получатель'}
                text={detail?.partnership_name}
                span={`${detail?.bank} ${detail?.rs ? ` *${detail?.rs?.slice(-4)}` : ''}`}
            /> */}

            <DropDown
                z={4}
                type={'detail'}
                sub={'Получатель'}
                list={detailsList}
                ListItem={Detail}
                activeItem={detail}
                setActiveItem={data => {
                    dispatch(setDetail(data))
                    if (detail?.partnership_id !== data?.partnership_id) {
                        dispatch(setNumberBill(data?.bill_num))
                    }
                }}
                disabled={disabled}
                error={!detailValidation}
                errorText={'Реквизиты не выбраны'}
                resetError={handleResetErrorDetail}
                overlay={true}
            />

            <div className={s.block}>
                <InputData
                    sub={'Дата'}
                    nosub={true}
                    setDate={data => dispatch(setDate(data))}
                    date={date}
                    disabled={disabled}
                />

                <InputBillNumber
                    sub={'Номер'}
                    setNumber={data => dispatch(setNumberBill(data))}
                    number={numberBill}
                    numberFirst={numberBillFirst}
                    errorEmpity={!numberValidation}
                    errorText={'Введи номер'}
                    resetError={handleResetErrorNumber}
                    disabled={disabled}
                    parameters={parameters}
                    detail={detail}
                />
            </div>

            <DropDownNds
                value={nds}
                setValue={(value) => dispatch(setNds(value))}
                disabled={disabled}
            />

            {orders.length > 0 && <div className={s.orders}>
                <p>Связанные заказы</p>
                <ul>
                    {orders?.map((el, i) => {
                        return <li onClick={handleOpenOrder} key={el.id} id={el.id}>
                            <p>{dayjs(el.date).format('DD.MM.YYYY')}{orders[i + 1] ? ', ' : ''}</p>
                        </li>
                    })}
                </ul>

            </div>
            }

        </div>
    )
};

export default MainInfoBlock;
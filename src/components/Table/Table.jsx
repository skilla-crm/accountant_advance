import s from './Table.module.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
//icons
import { ReactComponent as IconDone } from '../../assets/icons/iconDone.svg';
import { ReactComponent as IconCloseBlue } from '../../assets/icons/iconCloseBlue.svg';
import { ReactComponent as IconInfo } from '../../assets/icons/iconInfo.svg';
import { ReactComponent as IconUp } from '../../assets/icons/iconUp.svg';
//components
/* import Tooltip from '../Tooltip/Tooltip'; */
//utils
import { addSpaceNumber } from '../../utils/addSpaceNumber';



const Table = ({ data }) => {
    const [openTooltip, setOpenTooltip] = useState('');


    const handleOpenTooltip = (e) => {
        const id = e.currentTarget.id;
        setOpenTooltip(id)
    }

    const handleCloseTooltip = () => {
        setOpenTooltip('')
    }
    return (
        <table className={s.root}>
            <thead>
                <tr>
                    <th className={s.date}>Дата</th>
                    <th className={s.number}>Номер</th>
                    <th className={s.customer}>Заказчик</th>
                    <th className={s.connection}>Связь с заказом
                        <div className={s.container_tooltip}>
                            <IconInfo
                                onMouseEnter={handleOpenTooltip}
                                onMouseLeave={handleCloseTooltip}
                                id={'order'}
                                className={s.info}
                            />
                            <Tooltip id={'order'} open={openTooltip === 'order'} />
                        </div>
                    </th>
                    <th className={s.summ}>Сумма, ₽</th>
                    <th className={s.recipient}>Получатель</th>
                    <th className={s.bill}>Счет получателя</th>
                    <th className={s.progress}>Прогресс</th>
                   {/*  <th className={s.status}>Оплачен
                        <div className={s.container_tooltip}>
                            <IconInfo
                                onMouseEnter={handleOpenTooltip}
                                onMouseLeave={handleCloseTooltip}
                                id={'pay'}
                                className={s.info}
                            />
                            <Tooltip id={'pay'} open={openTooltip === 'pay'} />
                        </div>

                    </th> */}
                    <th className={s.button}></th>
                </tr>

            </thead>
            <tbody>


                {data?.map((el, i) => {
                    return <Row key={el.id} bill={el} lastLines={data?.length - i < 2} />
                })}
            </tbody>
        </table>
    )
};


const Row = ({ bill, lastLines }) => {

    const [focus, setFocus] = useState(false)
    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(`/detail/${bill?.id}`)
    }

    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }
    return (
        <tr onMouseEnter={handleFocus} onMouseLeave={handleBlur} className={s.row} onClick={handleNavigate}>
            <td className={s.border}></td>
            <td className={s.date}>
                <p>{dayjs(bill?.date).format('DD.MM.YY')}</p>
            </td>
            <td className={s.number}>
                <p>{bill?.number}</p>
            </td>
            <td className={s.customer}>
                <p>
                    {bill?.company?.name}
                </p>
                {bill?.company?.lable && <div className={s.lable}>
                    <span>{bill?.company?.lable}</span>
                </div>}
            </td>
            <td className={s.connection}>
                {bill?.related_order && <IconDone />}
            </td>
            <td className={s.summ}>
                <p>
                    {addSpaceNumber(bill?.sum?.split('.').shift())}<span>.{bill?.sum?.split('.').pop()}</span>
                </p>
            </td>
            <td className={s.recipient}>
                <p>{bill?.partnership?.partnership_name}</p>
            </td>
            <td className={s.bill}>
                {bill?.details?.bank && <p>{bill?.details?.bank}</p>}
                {bill?.details?.rs && <span><sup>*</sup>{String(bill?.details?.rs)?.slice(-4)}</span>}
            </td>
            <td className={s.progress}>
                <Progress lastLines={lastLines} progress={bill?.progress} />
            </td>
           {/*  <td className={s.status}>
                {bill?.is_paid && <IconDone />}
            </td> */}
            <td className={classNames(s.button, focus && s.button_vis)}>
                {/* <IconCloseBlue/> */}
            </td>

        </tr >

    )
};


const Progress = ({ lastLines, progress }) => {
    const [openTooltip, setOpenTooltip] = useState('')

    const handleOpenTooltip = (num) => {
        setOpenTooltip(num)
    }

    const handleCloseTooltip = () => {
        setOpenTooltip('')
    }

    return (
        <div className={s.line}>
            <div
                id={1}
                className={classNames(s.bar, progress?.first?.date && s.bar_active)}
                onMouseEnter={() => handleOpenTooltip(1)}
                onMouseLeave={handleCloseTooltip}
            >
                <TooltipProgress
                    id={1}
                    lastLines={lastLines}
                    open={openTooltip === 1}
                    firstString={`Создан ${dayjs(progress?.first?.date).format('DD.MM.YY в HH:mm')}`}
                    secondString={`${progress?.first?.person?.position === 'director' ? 'Руководитель' : 'Бухгалтер'} ${progress?.first?.person?.name} ${progress?.first?.person?.surname}`}
                />
            </div>
            <div
                id={2}
                className={classNames(s.bar, progress?.second?.date && s.bar_active)}
                onMouseEnter={() => handleOpenTooltip(2)}
                onMouseLeave={handleCloseTooltip}
            >
                <TooltipProgress
                    id={2}
                    lastLines={lastLines}
                    open={openTooltip === 2}
                    firstString={`Отправлен на e-mail ${dayjs(progress?.second?.date).format('DD.MM.YY в HH:mm')}`}
                    secondString={`${progress?.second?.person?.position === 'director' ? 'Руководитель' : 'Бухгалтер'} ${progress?.second?.person?.name} ${progress?.second?.person?.surname}`}
                />
            </div>
            <div
                id={3}
                className={classNames(s.bar, progress?.third?.date && s.bar_active)}
                onMouseEnter={() => handleOpenTooltip(3)}
                onMouseLeave={handleCloseTooltip}
            >
                <TooltipProgress
                    id={3}
                    lastLines={lastLines}
                    open={openTooltip === 3}
                    firstString={`Просмотрен ${dayjs(progress?.third?.date).format('DD.MM.YY в HH:mm')}`}
                    secondString={''}
                />
            </div>
        </div>
    )
}

const TooltipProgress = ({ isStatus, lastLines, open, firstString, secondString }) => {
    return (
        <div
            className={classNames(
                s.tooltip,
                s.tooltip_progress,
                isStatus && s.tooltip_status,
                open && s.tooltip_open,
                lastLines && s.tooltip_last
            )}
        >
            <IconUp />
            {firstString !== '' && <p>{firstString}</p>}
            {secondString !== '' && <p>{secondString}</p>}
        </div>
    )
}

const Tooltip = ({ open, id }) => {
    return (
        <div className={classNames(s.tooltip, open && s.tooltip_open, id === 'pay' && s.tooltip_pay)}>
            <IconUp />
            {id === 'order' && <p>Показывает наличие привязки счета к заказу</p>}
            {id === 'pay' && <p>Старый функционал будет убран 1 октября 2025</p>}
        </div>
    )
}

export default Table;
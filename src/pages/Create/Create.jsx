import s from './Create.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
//api
import { useGetParametersQuery } from '../../redux/ordersApiActions';
//slice
import { setCustomer} from '../../redux/mainInfo/slice';
//components
import Bill from '../../components/Bill/Bill';
import { useDispatch } from 'react-redux';

const Create = () => {
    const [anim, setAnim] = useState(false)
    const [type, setType] = useState('create')
    const { data: parameters } = useGetParametersQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const companyId = searchParams.get('company_id')
    const dispatch = useDispatch()

    useEffect(() => {
        document.title = `Создать Счет`
        setTimeout(() => {
            setAnim(true)
        })
    }, [])

    useEffect(() => {

        if (companyId && parameters) {
            const { companies } = parameters;
            const company = companies.find(el => el.id == companyId)
            company && dispatch(setCustomer(company))
        }
    }, [companyId, parameters])

    return (
        <div className={classNames(s.root, anim && s.root_anim)}>
            <Bill type={type} setType={setType} />
        </div>
    )
};

export default Create;
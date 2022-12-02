import { Form, Button, Card, Input, message, Space, Tag, Cascader, Timeline } from 'antd'
import { EditFilled, EnvironmentFilled } from '@ant-design/icons'
import React, { useCallback, useEffect, useState } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import SearchBar from '../components/SearchBar'
import { getOrderList, getProgress } from '../../request/order'
import Table from '../components/Table'
import { formatDate } from '../../util/utilities'
import ModalBox from '../components/ModalBox'
import { EditOrderFormRules } from '../../util/formRules'
import ModalForm from '../components/ModalForm'
import ModalFormItems from '../components/ModalFormItems'
import city from './citydata'


/* ------------------- breadcrum list ------------------- */
let breadCrum_list = [{
    id: 0,
    title: '首页',
    path: '/'
}, {
    id: 1,
    title: '订单管理',
    path: null
}, {
    id: 2,
    title: '订单列表',
    path: null
},
]

/* ------------------------------------------------------ */
/*                     ORDER COMPONENT                    */
/* ------------------------------------------------------ */
function Order() {




    const [orderList, setOrderList] = useState([])
    const [queryData, setQueryData] = useState({
        query: '',
        pagenum: 1,
        pagesize: 3,

    })
    let [total, setTotal] = useState(0)
    const [isEditOrderModal, setIsEditOrderModal] = useState(false)
    const [isProgressModal, setIsProgressModal] = useState(false)
    const [progressData, setProgressData] = useState([])
    const [processId, setProgressId] = useState('804909574412544580')
    /* ---------------------- useEffect --------------------- */
    const getAllOrder = useCallback((queryInfo) => {
        getOrderList(queryInfo)
            .then(({ data: res }) => {
                if (res.meta.status !== 200) return message.error(res.meta.msg)
                    res.data.forEach(element => {
                        element.key = element._id
                });                
                setOrderList(res.data)
                setTotal(res.total)
                // console.log(res.data)
            })
    }, [setOrderList])

    useEffect(() => {
        getAllOrder(queryData)
    }, [getAllOrder, queryData])

    const [orderFormRef] = Form.useForm()
    const [progressFormRef] = Form.useForm()

    /* ------------------------ table ----------------------- */
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'order_number',
            key: 'order_number',
        },
        {
            title: '订单价格',
            dataIndex: 'order_price',
            key: 'order_price',
        },
        {
            title: '是否付款',
            dataIndex: 'pay_status',
            key: 'pay_status',
            render(value) {
                return (
                    <>
                        {
                            value === '1' ? <Tag color="success">已付款</Tag>
                                : <Tag color="warning">未付款</Tag>
                        }
                    </>
                )
            }
        },
        {
            title: '是否发货',
            dataIndex: 'is_send',
            key: 'is_send',
        },
        {
            title: '下单时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render(value) {
                return <span>{formatDate(value)}</span>
            }
        },
        {
            title: '操作',
            key: 'setting',
            render() {
                return (
                    <>
                        <Space>
                            <Button type="primary" icon={<EditFilled />} onClick={() => setIsEditOrderModal(true)}/>
                            <Button type='warning' icon={<EnvironmentFilled />} onClick={openProcessModalBox} />
                        </Space>
                    </>
                )
            }
        },
    ]

    /* --------------------- pagination --------------------- */
    const handlePageChange = (pagenum, pagesize) => {
        // console.log('pagenum: ', pagenum, 'pagesize:', pagesize, 'total:', total)
        setQueryData({ ...queryData, pagenum, pagesize })
    }

    /* ------------------------ edit ------------------------ */
    const handleEditOrder = ()=>{
        orderFormRef.validateFields()
        .then(value =>{
        console.log(value)
        setIsEditOrderModal(false)
        })
        .catch((err)=>{
            console.log(err)
            setIsEditOrderModal(true)
        })
    }
    const handleCancelOrder = ()=>{
        
        setIsEditOrderModal(false)
    }
    const handleAfterCloseOrder = ()=>{
        orderFormRef.resetFields()
        setIsEditOrderModal(false)
    }
    // cascader
    const onCascaderChange = (value) => {
        console.log(value);
    };
    const displayCascaderRender = (labels) => labels[labels.length - 1];
    /* ------------------------ Progress ------------------------ */
    const openProcessModalBox = ()=>{
        getProgress(processId)
        .then(({data:res}) =>{
            console.log(res)
            if(res.meta.status !== 200) return message.error(res.meta.msg)
            console.log(res.data)
            setProgressData(res.data)
        })
        setIsProgressModal(true)
    }
    const handleProgress = ()=>{
        progressFormRef.validateFields()
        .then(value =>{
        console.log(value)
            setIsProgressModal(false)
        })
        .catch((err)=>{
            console.log(err)
            setIsProgressModal(true)
        })
    }
    const handleCancelProgress = ()=>{
        
        setIsProgressModal(false)
    }
    const handleAfterCloseProgress = ()=>{
        progressFormRef.resetFields()
        setIsProgressModal(false)
    }

    /* ----------------------- RETURN ----------------------- */
    return (
        <div>
            <BreadCrumb list={breadCrum_list} />
            <Card>
                { /* -------------------- search input -------------------- */}
                <SearchBar onSearch />
                { /* ------------------------ table ----------------------- */}
                <Table
                    dataSource={orderList}
                    columns={columns}
                    pagination={{
                        position: ['bottomLeft'],
                        total,
                        current: queryData.pagenum,
                        pageSize: queryData.pagesize,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: [1, 2, 5, 10],
                        onChange: handlePageChange,
                        showTotal: total => `一共 ${total} 条`

                    }}
                     />
            </Card>
            {/* --------------------- edit order --------------------- */}
            <ModalBox
                title="修改地址"
                cancelText="取消"
                okText="确认"
                isModalOpen={isEditOrderModal}
                handleOk={handleEditOrder}
                handleCancel={handleCancelOrder}
                handleAfterClose={handleAfterCloseOrder}
            >
                <ModalForm form= { orderFormRef }>
                    <ModalFormItems label="省市区/县" name="address1" rules={EditOrderFormRules.address1}>
                        <Cascader
                            options={city}
                            expandTrigger="hover"
                            displayRender={displayCascaderRender}
                            onChange={onCascaderChange}
                        />
                </ModalFormItems>
                    <ModalFormItems label="详细地址" name="address2" rules={EditOrderFormRules.address2}>
                    <Input/>
                </ModalFormItems>
               </ModalForm>
            </ModalBox>
            {/* ---------------------  order progress --------------------- */}
            <ModalBox
                title="物流进度"
                cancelText="取消"
                okText="确认"
                isModalOpen={isProgressModal}
                handleOk={handleProgress}
                handleCancel={handleCancelProgress}
                handleAfterClose={handleAfterCloseProgress}
            >
                <Timeline mode="left">
                {
                        progressData.map((item)=>{
                            return <Timeline.Item key={item._id} label={formatDate(item.time)}>{item.context}</Timeline.Item>
                        })
                }
                    
                    
                </Timeline>
            </ModalBox>
        </div>
    )
}

export default Order
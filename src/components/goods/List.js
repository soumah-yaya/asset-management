import { Card, message } from 'antd'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import SearchBar from '../components/SearchBar'
import * as api_goods from '../../request/goods'
import Table from '../components/Table'
import SettingButtons from '../components/SettingButtons'
import * as utilities from '../../util/utilities'
import {useNavigate} from 'react-router-dom'

/* ------------------- breadcrum list ------------------- */
let breadCrum_list = [{
    id: 0,
    title: '首页',
    path: '/'
}, {
    id: 1,
    title: '商品管理',
    path: null
}, {
    id: 2,
    title: '商品列表',
    path: null
},
]
/* ------------------------------------------------------ */
/*                     LIST COMPONENT                     */
/* ------------------------------------------------------ */
function List() {
    
    const navigate = useNavigate()
    const [queryInfo, setQueryInfo] = useState({
        query:'',
        pagenum:1,
        pagesize:1
    })
    let total= useRef(0);
    const [tableData, setTableData] = useState([])
    /* ------------------ get all goods lis ----------------- */
    const getGoodsList = useCallback(() => {
        api_goods.getGoodsList(queryInfo)
        .then(({data:res})=>{
            if(res.meta.status !== 200) return message.error(res.meta.msg)
            //add key field
            res.data = res.data.map((good)=>{
                good.key = good._id
                return good
            })
            // set table data
            setTableData(res.data)
            total.current = res.total
        })
    }, [queryInfo])

    useEffect(()=>{
        getGoodsList()
    }, [getGoodsList])
    /* ----------------------- SEARCH ----------------------- */
    const onSearch = (value)=>{
        setQueryInfo({...queryInfo,query:value})
    }
    const openAddProductPage = ()=>{
        navigate('/goods/add')
    }
    const handleEditGoods = ()=>{
        message.error("还没设计编辑按钮")
    }
    /* ------------------------ TABLE ----------------------- */
    const columns = [
        {
            title: '商品名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
        },
        {
            title: '商品价格',
            dataIndex: 'goods_price',
            key: 'goods_price',
        },
        {
            title: '商品重量',
            dataIndex: 'goods_weight',
            key: 'goods_weight',
        },
        {
            title: '创建时间',
            dataIndex: 'add_time',
            key: 'add_time',
            render(value){
                return <span>{utilities.formatDate(value)}</span>
            }
        },
        
        {
            title: '操作',

            key: 'setting',
            render(row) {
                return (
                    <>
                        <SettingButtons
                            onEdit={handleEditGoods}
                            isShow                            
                            popConfirm={() => deleteConfirm(row)}
                            popCancel={deleteCancel}
                            popText="确认"
                            popCancelText="取消" 
                        /> 
                    </>
                )
            }
        },
    ];
    // handle pagination change
    const handlePageChange = (pagenum, pagesize) => {
        // console.log('pagenum: ', pagenum, 'pagesize:', pagesize, 'total:', total)
        setQueryInfo({ ...queryInfo, pagenum, pagesize })
    }

    const deleteConfirm = (row) => {
        // console.log(row._id);
        api_goods.deleteGoodsById(row._id)
            .then(({ data: res }) => {
                if (res.meta.status !== 200) {
                    message.success('删除失败');
                    return
                }
                message.success('删除成功');
                getGoodsList()
            })

    };
    const deleteCancel = (e) => {
        message.error('取消删除了');
    };

    /* ----------------------- RETURN ----------------------- */
  return (
    <div>
          <BreadCrumb list={breadCrum_list }/>
          {/* ------------------------ card ------------------------ */}
          <Card  >
              {/* search */}
              <SearchBar placeholder="" text="添加商品" onSearch={onSearch} handleAddNewUser={openAddProductPage} />
              {/* ------------------------ table ----------------------- */}
              <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={{
                      position: ['bottomLeft'],
                      total:total.current,
                      current: queryInfo.pagenum,
                      pageSize: queryInfo.pagesize,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: [1, 2, 5, 10],
                      onChange: handlePageChange,
                      showTotal: total => `一共 ${total} 条`

                  }}
              />
          </Card>
    </div>
  )
}

export default List
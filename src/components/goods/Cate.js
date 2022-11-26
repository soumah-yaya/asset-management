import React, { useState, useCallback, useEffect } from 'react'
import { Card, Tag, message, Form, Input, Cascader } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import BreadCrumb from '../components/BreadCrumb'
import AddButton from '../components/AddButton'
import api from '../../request/api'
import * as request from '../../request/categories'
import Table from '../components/Table'
import SettingButtons from '../components/SettingButtons'
import ModalBox from '../components/ModalBox'
import ModalForm from '../components/ModalForm'
import ModalFormItems from '../components/ModalFormItems'
import { loginFormRules as formRules } from '../../util/formRules'

/*BREADCRUMB LIST*/
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
  title: '参数列表',
  path: null
},
]
/* ------------------------------------------------------ */
/*                   categorie component                  */
/* ------------------------------------------------------ */
function Cate() {
  const [cateList, setCateList] = useState([])
  const [queryInfo, setQueryInfo] = useState({
    type: '3',
    pagenum: 1,
    pagesize: 10
  })
  const [total, setTotal] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [catId, setCatId] = useState('')
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [cateOption, setCateOption] = useState([])

  /* -------------------- table -------------------- */
  // column  
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'cat_name',
      key: 'cat_name',
    },
    {
      title: '是否有效',
      dataIndex: 'cat_deleted',
      key: 'cat_deleted',
      render(value) {
        return value === false ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />
      }
    },
    {
      title: '排序',
      dataIndex: 'cat_level',
      key: 'cat_level',
      render(value) {
        return value === "0"
          ? <Tag color='blue'>一级</Tag>
          : value === "1"
            ? <Tag color='green'>二级</Tag>
            : <Tag color='orange'>三级</Tag>
      }
    },
    {
      title: '操作',
      key: 'setting',
      render(record) {
        return <SettingButtons
          onEdit={() => openEditModal(record)}         
          edit_text="编辑"
          delete_text="删除"
          popConfirm={() => handleDeleteCateConfirm(record)}
          popCancel={() => handleCancelCateConfirm(record)}
          isShow={true}
        />
      }
    },
  ];
  // rowSelection objects indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  //  pagination
  const handlePageChange = (pagenum, pagesize) => {
    // console.log(pagenum,pagesize)
    setQueryInfo({ ...queryInfo, pagenum, pagesize })
  }

  /* ----------------- get categorie list ----------------- */
 
  const getCategorieList = useCallback(() => {
    console.log('callback called')
    request.getLevelList(queryInfo)
      // api.get('/categories', { params: queryInfo })
      .then(({ data: res }) => {
        if (res.meta.status !== 200) return message.error(res.meta.msg)
        // add key prop to each categorie 
        // console.log(res.total)
        setTotal(res.total)
        setCateList(res.data.map(item => {
          item.key = item._id
          item.children = item.children?.map(item2 => {
            item2.key = item2._id
            item2.children = item2.children?.map(item3 => {
              item3.key = item3._id
              return item3
            })
            return item2
          })
          return item
        }))
      })
  }, [setCateList, setTotal, queryInfo])
  // useEffect
  useEffect(() => {
    getCategorieList()
  }, [getCategorieList] )

  /* -------------- add categorie dialog box -------------- */
  // get level2 data
  const getCategorieOption = () => {
    request.getLevelList({ type: '2' })
      .then(({ data: res }) => {
        if (res.meta.status !== 200) return message.error(res.meta.msg)
        console.log('data', res.data)
        setCateOption(res.data)
      })

  }


  // fileds names
  const fieldNames = { label: 'cat_name', value: '_id', children: 'children' }

  // open add categorie dialog
  const openAddCateDialog = () => {
    getCategorieOption()
    setIsAddModalOpen(true)
  }
  const addHandleOk = () => {
    addForm.validateFields()
      .then(({ cat_name, cat_pid }) => {
        let query;
        if (!cat_pid) {
          query = {
            cat_level: '0',
            cat_pid: '0',
            cat_name
          }
          // console.log(query)
        } else if (cat_pid.length === 1) {
          query = {
            cat_level: '1',
            cat_pid: cat_pid[0],
            cat_name
          }
          // console.log(query)
        } else {
          query = {
            cat_level: '2',
            cat_pid: cat_pid[1],
            cat_name
          }
          // console.log(query)
        }
        api.post('/categories', query)
          .then(({ data: res }) => {

            if (res.meta.status !== 201) return message.error(res.meta.msg)
            message.success(res.meta.msg)
          })
        getCategorieOption()
        getCategorieList()
        setIsAddModalOpen(false)
      })
      .catch((err) => {
        setIsAddModalOpen(true)
      })

  }
  const addHandleCancel = () => {
    setIsAddModalOpen(false)
  }
  const addAfterCloseDialog = () => {
    addForm.resetFields()
  }

  /* ------------------- edit categorie ------------------- */
  const openEditModal = (record) => {
    editForm.setFieldsValue({ cat_name: record.cat_name })
    console.log(record)
    setCatId(record._id)
    setIsEditModalOpen(true)
  }
  const editHandleOk = () => {
    editForm.validateFields()
      .then((value) => {
        console.log(value.cat_name)
        request.updateCateById(catId, value.cat_name)
          .then(({ data: res }) => {
            if (res.meta.status !== 201) return message.error(res.meta.msg)
            message.success(res.meta.msg)
            getCategorieList()
          })
        setIsEditModalOpen(false)
      })
      .catch((err) => {
        setIsEditModalOpen(true)
      })
  }
  const editHandleCancel = () => {
    setIsEditModalOpen(false)
  }
  const editAfterCloseDialog = () => {
    editForm.resetFields()
  }
  /* ------------------ delete categorie ------------------ */
  const handleDeleteCateConfirm = (record) => {
    request.deleteCateById(record._id)
    .then(({data:res})=>{
      if(res.meta.status !== 201) return 
      message.success(res.meta.msg)
      setCateList(v=>v)
      getCategorieList()
    })
  }
  const handleCancelCateConfirm = () => {
    message.success('取消删除')
  }
  /*RETURN*/
  return (
    <div>
      {/* ---------------- BREADCRUMB --------------- */}
      <BreadCrumb list={breadCrum_list} />
      {/* ----------------------- CARD ----------------------- */}
      <Card>
        {/* ------------------ ADD ROLE BUTTON ----------------- */}
        <AddButton onClick={openAddCateDialog} button_text="添加角色" />

        {/* -------------------- ROLE TABLE -------------------- */}
        <Table
          columns={columns}

          rowSelection={{
            ...rowSelection,

          }}
          dataSource={cateList}
          pagination={{
            position: ['bottomLeft'],
            total,
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
      {/* ---------------- add categorie dialog ---------------- */}
      <ModalBox
        title="添加分类"
        isModalOpen={isAddModalOpen}
        handleOk={addHandleOk}
        cancelText="取消"
        okText="确认"
        okType="primary"
        handleCancel={addHandleCancel}
        handleAfterClose={addAfterCloseDialog}
      >
        <ModalForm form={addForm}>
          <ModalFormItems
            label="分类名称"
            name="cat_name"
            rules={formRules.cateName}
          >
            <Input />
          </ModalFormItems>
          <Form.Item
            label="父级分类"
            name="cat_pid"
          >
            <Cascader
              expandTrigger="hover"
              style={{
                width: '100%',
              }}
              allowClear
              options={cateOption}
              placeholder="请选择"
              changeOnSelect
              fieldNames={fieldNames}
            />
          </Form.Item>


        </ModalForm>
      </ModalBox>
      {/* ------------------- edit categorie ------------------- */}
      <ModalBox
        title="修改分类"
        isModalOpen={isEditModalOpen}
        handleOk={editHandleOk}
        cancelText="取消"
        okText="确认"
        okType="primary"
        handleCancel={editHandleCancel}
        handleAfterClose={editAfterCloseDialog}
      >
        <ModalForm form={editForm}>
          <ModalFormItems
            label="分类名称"
            name="cat_name"
            rules={formRules.cateName}
          >
            <Input />
          </ModalFormItems>
        </ModalForm>
      </ModalBox>

    </div>
  )
}

export default Cate
import React, { useState, useEffect, useCallback, useRef } from 'react'
import BreadCrumb from '../BreadCrumb'
import { Input, Select, Form, Popconfirm, Card, message, Table, Switch, Button, Tooltip, Space, Modal } from 'antd';
import SearchBar from '../SearchBar'
import api from '../../../../request/api'
import { listMessage } from '../../../../util/string';
import { EditFilled, DeleteFilled, SettingFilled } from '@ant-design/icons';
import { loginFormRules } from '../../../../util/formRules'
import ModalBox from '../../../ModalBox';


const breadCrumbList = [{
  id: 0,
  title: '首页',
  path: '/'
}, {
  id: 1,
  title: '用户管理',
  path: null
}, {
  id: 2,
  title: '用户列表',
  path: null
},
]



function Users() {
  const [queryInfo, setQueryInfo] = useState({
    query: '',
    pagenum: 1,
    pagesize: 3
  });

  const [userList, setUserList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [total, setTotal] = useState(0);
  const [isAddModalOpen, setAddIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isSettingModalOpen, setSettingIsModalOpen] = useState(false);
  const [userSettingInfo, setUserSettingInfo] = useState({});
  const [userId, setUserId] = useState('')
  const [newRoleId, setNewRoleId] = useState('')

  // table columns
  const columns = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'mg_state',
      key: 'mg_state',
      render(value, row) {
        return <Switch checked={value} onChange={() => onSwitchChange(row)} />
      }
    },
    {
      title: '操作',

      key: 'setting',
      render(value, row) {
        return (
          <>
            <Space>
              <Tooltip title="修改" mouseLeaveDelay="0">
                <Button onClick={() => handleEditUser(row)} type="primary" size="middle" icon={<EditFilled />} />
              </Tooltip>
              {/* <Tooltip title="删除" mouseLeaveDelay="0"> */}
              <Popconfirm
                title="此操作将永久删除该用户。 是否继续吗？"
                onConfirm={deleteConfirm}
                onCancel={deleteCancel}
                okText="继续"
                cancelText="取消">
                <Button onClick={() => handleDeleteUser(row)} type="danger" size="middle" icon={<DeleteFilled />} />
              </Popconfirm>
              {/* </Tooltip> */}
              <Tooltip title="分配角色" mouseLeaveDelay="0">
                <Button type="warning" size="middle" onClick={() => HandleOpenSettingDialogBox(row)} icon={<SettingFilled />} />
              </Tooltip>
            </Space>
          </>
        )
      }
    },
  ];

  const getUserList = useCallback(() => {
    api.get('users', { params: queryInfo })
      .then(({ data: res }) => {
        // console.log(res)
        let { data, meta, total } = res
        if (meta.status !== 200) return message.error(listMessage.success)
        setUserList(data.map(user => {
          user.key = user._id;
          return user
        }));
        setTotal(total);

      })
      .catch((err) => {

      })
  }, [queryInfo])

  // const dialogFormRef = useRef()
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  // useEffect
  useEffect(() => {
    getUserList()
  }, [getUserList])

  const onSwitchChange = (row) => {
    // console.log(row);
    const data = { ...row, mg_state: !row.mg_state };
    // console.log(data.id, data.mg_state)
    api.put(`users/${data._id}/state/${data.mg_state}`)
      .then(({ data: res }) => {
        // console.log(res);
        if (res.meta.status === 201) {
          getUserList()
        }
      })
      .catch(() => {
        console.log('error')
      })
  }

  // pagination
  const handlePageChange = (pagenum, pagesize) => {
    // console.log('pagenum: ', pagenum, 'pagesize:', pagesize, 'total:', total)
    setQueryInfo({ ...queryInfo, pagenum, pagesize })
  }


  // search input
  const onSearch = (value) => {
    setQueryInfo({ ...queryInfo, query: value })
  }

  const handleAddNewUser = () => {
    setAddIsModalOpen(true);
  }
  // add new user dialog box  

  const addHandleOk = () => {
    // setIsModalOpen(false);

    addForm.validateFields()
      .then((value) => {
        api.post('/users', value)
          .then(({ data: res }) => {
            setAddIsModalOpen(false)
            getUserList()
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  };
  const editHandleOk = () => {
    // setIsModalOpen(false);

    editForm.validateFields()
      .then((value) => {

        let { mobile, email } = value

        api.put(`/users/${userId}`, { mobile, email })
          .then((response) => {

            setEditIsModalOpen(false)
            getUserList()
          })
          .catch((err) => {
            console.log('修改用户失败')
          })
      })
      .catch((err) => {
        console.log(err)
      })
  };
  const addHandleCancel = () => {
    setAddIsModalOpen(false);
  };
  const editHandleCancel = () => {
    setEditIsModalOpen(false);
  };

  // add diaolog form

  const addAfterCloseDialog = () => {
    addForm.resetFields()
  }
  const editAfterCloseDialog = () => {
    editForm.resetFields()
  }

  // edit user button 
  const handleEditUser = (row) => {
    const { _id: id, username, mobile, email } = row;
    // fill the form
    editForm.setFieldsValue({ username, mobile, email })

    setEditIsModalOpen(true);
    // set current user id
    setUserId(id)
  }
  // handle delete user
  const handleDeleteUser = (row) => {
    let { _id: id } = row
    setUserId(id)
  }
  const deleteConfirm = (e) => {
    // console.log(e);
    api.delete(`users/${userId}`)
      .then(({ data: res }) => {
        if (res.meta.status !== 200) {
          message.success('删除失败');
          return
        }
        message.success('删除成功');
        getUserList()
      })

  };
  const deleteCancel = (e) => {
    message.error('取消删除了');
  };
  /*SETTING*/
  const HandleOpenSettingDialogBox = (row) => {
    const { _id: id } = row;
    // set current user id
    setUserId(id)
    // get all roles lists
    api.get('/roles')
      .then(({ data: res }) => {
        if (res.meta.status !== 200) return message.error(res.meta.msg)
        // console.log(res.data)
        setRolesList(res.data)
      })

    // console.log(row)
    setUserSettingInfo(row)
    setSettingIsModalOpen(true)
  }
  const settingHandleOk = () => {
    
    api.put(`users/${userId}/role`, { rid: newRoleId })
    .then(({data:res}) =>{
      if(res.meta.status !== 201) return message.error(res.meta.msg)
      message.success(res.meta.msg)
      getUserList()
    })
    setSettingIsModalOpen(false)
  }
  const settingHandleCancel = () => {
    setSettingIsModalOpen(false)
  }
  const settingAfterCloseDialog = () => {
    setUserSettingInfo({})
    setNewRoleId('')
    setRolesList([])
  }
  // select input
  const handleChange = (value) => {
    // console.log(`userId: ${userId}, selected ${value}`);
    setNewRoleId(value)
    
  };

  /*RETURN*/
  return (
    <>
      {/* breadcrumb */}
      <BreadCrumb list={breadCrumbList} />
      {/* card */}
      <Card  >
        {/* search */}
        <SearchBar placeholder="" text="添加用户" onSearch={onSearch} handleAddNewUser={handleAddNewUser} />

        {/* table */}
        <Table
          bordered style={{ marginTop: 15, fontSize: 12 }}
          dataSource={userList} columns={columns}
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
        {/* add user dialog box */}
        <ModalBox
          title="添加用户"
          isModalOpen={isAddModalOpen}
          handleOk={addHandleOk}
          cancelText="取消"
          okText="确认"
          okType="primary"
          handleCancel={addHandleCancel}
          handleAfterClose={addAfterCloseDialog}        >

          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}

            autoComplete="off"
            form={addForm}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={loginFormRules.username}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={loginFormRules.Password}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"

              rules={
                loginFormRules.email
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机"
              name="mobile"
              rules={loginFormRules.mobile}
            >
              <Input />
            </Form.Item>
          </Form>

        </ModalBox>
        {/* edit user dialog box */}
        <ModalBox
          title="修改用户"
          isModalOpen={isEditModalOpen}
          handleOk={editHandleOk}
          cancelText="取消"
          okText="保存"
          okType="primary"
          handleCancel={editHandleCancel}
          handleAfterClose={editAfterCloseDialog}
        >

          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}

            autoComplete="off"
            form={editForm}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={loginFormRules.username}

            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"

              rules={
                loginFormRules.email
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="手机"
              name="mobile"
              rules={loginFormRules.mobile}
            >
              <Input />
            </Form.Item>
          </Form>
        </ModalBox>
        {/* SETTING */}
        <ModalBox
          title="分配角色"
          isModalOpen={isSettingModalOpen}
          handleOk={settingHandleOk}
          cancelText="取消"
          okText="确定"
          okType="primary"
          handleCancel={settingHandleCancel}
          handleAfterClose={settingAfterCloseDialog}
        >
          <div>
            <p>当前的用户：{userSettingInfo.username}</p>
            <p>当前的角色：{userSettingInfo.role_name}</p>
            <div><span>分配新角色: </span>
              {/* select input */}
              <Select
                placeholder='请选项'                
                style={{ width: 220 }}
                onChange={handleChange}
                
                options={rolesList.map((item) => {
                  return {
                    key: item._id,
                    value: item._id,
                    label: item.roleName,
                  }
                })
                }
              />
            </div>
          </div>
        </ModalBox>
      </Card>
    </>

  )
}


export default Users
import React, { useState, useEffect, useCallback, useReducer } from 'react'
import BreadCrumb from './BreadCrumb'
import { Form, Tree, Input, Modal, Table, Card, Row, Col, Button, message, Space, Tag, Popconfirm } from 'antd'
import { CloseOutlined, EditFilled, DeleteFilled, SettingFilled, RightOutlined, DownOutlined, CaretRightOutlined } from '@ant-design/icons';
import api from '../../../request/api'

let breadCrum_list = [{
  id: 0,
  title: '首页',
  path: '/'
}, {
  id: 1,
  title: '权限管理',
  path: null
}, {
  id: 2,
  title: '角色列表',
  path: null
},
]
let keys = [] //holds all rights ids that the current role has
const treeReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_SETTING':
      return {
        ...state,
        treeData: action.payload.data,
        selectedKeys: action.payload.keys,
        roleId: action.payload.rowId
      }
    case 'CHANGE':
      return {
        ...state,       
        selectedKeys: action.payload.checkedKeys,
        rids:action.payload.rids        
      }
    case 'UPDATE_ROLE_ID':
      return {
        ...state,       
        roleId: action.payload.rowId,                
      }

    default: break;
  }
}

const treeFieldName = {
  title: 'authName',
  key: '_id',

}


function Roles() {
  const [rolesList, setRolesList] = useState([])
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  
  const [addRoleForm] = Form.useForm()
  const [editRoleForm] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeState, treeDispatch] = useReducer(treeReducer, {
    treeData: [],
    selectedKeys: [],
    roleId: '',
    rids:[]
  })

  // const { TreeNode } = Tree

  const getRolesList = useCallback(() => {
    api.get('/roles')
      .then(({ data: res }) => {
        const { data: response, meta } = res;
        if (meta.status !== 200) {
          return message.error(meta.msg)
        }
        // add key property to each role
        setRolesList(response.map((role) => {
          role.key = role._id
          return role
        }))

      })

  }, [setRolesList])


  useEffect(() => {
    getRolesList()

  }, [getRolesList])

  // table columns
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',

    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
    },
    {
      title: '操作',
      key: 'operation',
      render(value, row) {
        return (
          <>
            <Space>
              <Button onClick={() => editRoleHandler(row)} type='primary' icon={<EditFilled />}>编辑</Button>
              <Popconfirm
                title="此操作将永久删除，是否继续?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                okText="继续"
                cancelText="取消"
              >
                <Button onClick={() => deleteRoleHandler(row)} type='danger' icon={<DeleteFilled />}>删除</Button>
              </Popconfirm>
              <Button onClick={() => openSettingRightsDialog(row)} type='warning' icon={<SettingFilled />}>分配权限</Button>
            </Space>
          </>
        )
      }

    }
  ];

  /* ADD ROLE */

  // open add role dialog box
  const openAddRoleDialog = () => {
    setIsAddRoleModalOpen(true);
  }
  // add role dialog box
  const addRoleHandleOk = () => {
    addRoleForm.validateFields()
      .catch((err) => {
        console.log(err)
      })
      .then(value => {
        // console.log(value)
        api.post('roles', value)
          .then(({ data: res }) => {
            // console.log(res)
            setIsAddRoleModalOpen(false);
            getRolesList()
          })
          .catch(() => {
            message.error("失败")
          })
      })
    // setIsAddRoleModalOpen(false);
  };
  const addRoleHandleCancel = () => {
    setIsAddRoleModalOpen(false);
  };
  const onAfterCloseAddROle = () => {
    addRoleForm.resetFields()
  }

  /* EDIT ROLE */
  const editRoleHandler = (row) => {
    // console.log(row.roleName, row.roleDesc)
    editRoleForm.setFieldsValue({ roleName: row.roleName, roleDesc: row.roleDesc })
    setIsEditRoleModalOpen(true);
    treeDispatch({
      type: 'UPDATE_ROLE_ID',
      payload: {
        rids: row._id
      }
    })
  }

  // edit role dialog box
  const editRoleHandleOk = () => {
    editRoleForm.validateFields()
      .catch((err) => {
        console.log(err)
      })
      .then(value => {
        // console.log(value)
        api.put(`roles/${treeState.roleId}`, value)
          .then(() => {
            // console.log(res)
            setIsEditRoleModalOpen(false);
            getRolesList()
          })
          .catch(() => {
            message.error("失败")
          })
      })
    // setIsAddRoleModalOpen(false);
  };
  const editRoleHandleCancel = () => {
    setIsEditRoleModalOpen(false);
  };
  const onAfterCloseEditROle = () => {
    editRoleForm.resetFields()
  }
  /* DELETE ROLE */
  const deleteRoleHandler = (row) => {
    treeDispatch({
      type:'UPDATE_ROLE_ID',
      payload:{
        rids: row._id
      }
    })
  }
  const confirmDelete = (e) => {
    api.delete(`roles/${treeState.roleId}`)
      .then(({ data: res }) => {
        if (res.meta.status !== 200) {
          return message.error('删除失败');
        }

        message.success('删除成功');
        getRolesList()
      })
  };
  const cancelDelete = (e) => {
    message.error('删除取消了');
  };

  /* DELETE ROLE TAG*/

  const confirmTagDelete = (row, idRights) => {
    api.delete(`roles/${row._id}/rights/${idRights}`)
      .then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return message.error('删除失败');
        }

        message.success('删除成功');
        getRolesList()
        //   })
      })
  }
  const cancelTagDelete = (e) => {
    message.error('删除取消了');
  };

  /* SETTING RIGHTS*/
  const openSettingRightsDialog = (row) => {

    // get all setting data
    api.get('/rights/tree')
      .then(({ data: res }) => {

        let { data, meta: { status, msg } } = res
        if (status !== 200) {
          return message.error(msg)
        }
        treeDispatch({
          type: 'OPEN_SETTING',
          payload: {
            data,
            rowId: row._id,
            keys
          }
        })
        getKeys(row)
        setIsModalOpen(true);
        // console.log('keys2', keys)
      })
  }


  function getKeys(node) {
    if (!node.children) return keys.push(node._id)
    node.children.forEach(item => {
      getKeys(item)
    })
  }
  // modal box
  const handleSettingOk = () => {
    api.post(`/roles/${treeState.roleId}/rights`,{
      rids: treeState.rids
    })
    .then(({data:res})=>{
      if(res.meta.status !== 201) return message.error(res.meta.msg)
      getRolesList()
    })
    // console.log('id is', treeState.roleId,treeState.rids)
    setIsModalOpen(false);
  };
  const handleSettingCancel = () => {
    setIsModalOpen(false);
  };
  const handleSettingClose = () => {
    // empty the rights ids array
    keys = []
    treeDispatch({
      type: 'OPEN_SETTING',
      payload: {
        keys: []
      }
    })


  }

  // tree
  const onCheck = (checkedKeys, info) => {
    const allIds = [...info.halfCheckedKeys, ...checkedKeys]
    const rids = allIds.join()
       treeDispatch({
      type:'CHANGE',
         payload: { checkedKeys, rids }
    })
  };


  // RETURN
  return (
    <div>
      {/* BREADCRUMB */}
      <BreadCrumb list={breadCrum_list} />
      {/* CARD */}
      <Card>
        {/* ADD ROLE BUTTON */}
        <Row>
          <Col>
            <Button onClick={openAddRoleDialog} type='primary'>添加角色</Button>
          </Col>
        </Row>
        {/* ROLE TABLE */}
        <Table
          bordered style={{ marginTop: 15, fontSize: 12 }}
          dataSource={rolesList}
          columns={columns}

          expandable={{
            expandedRowRender: record => (

              record.children?.map((item1, index1) => {
                return (
                  <Row key={item1._id} style={{ borderBottom: '1px solid #eee', borderTop: index1 === 0 ? '1px solid #eee' : "", alignItems: "center" }} >
                    <Col span={5} >
                      <Tag style={{ margin: 7 }} color="blue" >{item1.authName}</Tag>
                      <CaretRightOutlined />
                    </Col>
                    {/* level 2 and 3 */}
                    <Col span={19}>
                      {item1.children?.map((item2, index2) => {
                        return (
                          <Row key={item2._id} style={{ borderTop: index2 !== 0 && '1px solid #eee', alignItems: "center" }} >
                            <Col span={6}>
                              <Tag style={{ margin: 7 }} color="green" >{item2.authName}</Tag>
                              <CaretRightOutlined />
                            </Col>
                            {/* level 2 and 3 */}
                            <Col span={18}>
                              {item2.children?.map((item3, index3) => {
                                return (
                                  <Popconfirm
                                    placement="topRight"
                                    title="'此操作将永久删除，是否继续?'"
                                    onConfirm={() => confirmTagDelete(record, item3._id)}
                                    onCancel={cancelTagDelete}
                                    okText="Yes"
                                    cancelText="No"
                                    key={item3._id}
                                  >
                                    <Tag
                                      style={{ margin: 7 }}
                                      color="orange"
                                    // onClick={(e) => {                                      
                                    //   showDeleteConfirm(e,item1._id, item3._id)
                                    // }}  
                                    >
                                      {item3.authName}<CloseOutlined />
                                    </Tag>
                                  </Popconfirm>
                                )
                              })}
                            </Col>
                          </Row>
                        )
                      })}
                    </Col>
                  </Row>
                )
              })

            ),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={e => onExpand(record, e)} />

              ) : (
                <RightOutlined onClick={e => onExpand(record, e)} />

              ),
            childrenColumnName: 'saw'
          }}

        />
      </Card>
      {/* ADD ROLE DIALOG BOX */}
      <Modal title="添加角色"
        open={isAddRoleModalOpen}
        onOk={addRoleHandleOk}
        onCancel={addRoleHandleCancel}
        okText="添加" cancelText="取消"
        afterClose={onAfterCloseAddROle}
      >
        <Form
          name="addRoleForm"
          form={addRoleForm}
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

        >
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[
              {
                required: true,
                message: '请输入角色名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="roleDesc"
            rules={[
              {
                required: true,
                message: '请输入角色描述',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT ROLE DIALOG BOX */}
      <Modal title="删除角色"
        open={isEditRoleModalOpen}
        onOk={editRoleHandleOk}
        onCancel={editRoleHandleCancel}
        okText="添加" cancelText="取消"
        afterClose={onAfterCloseEditROle}
      >
        <Form
          name="editRoleForm"
          form={editRoleForm}
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

        >
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[
              {
                required: true,
                message: '请输入角色名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="roleDesc"
            rules={[
              {
                required: true,
                message: '请输入角色描述',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* SETTING RIGHTS DIALOG BOX */}
      <Modal title="分配权限"
        okText="确认"
        cancelText="取消"
        open={isModalOpen}
        onOk={handleSettingOk}
        afterClose={handleSettingClose}
        onCancel={handleSettingCancel}>
        {/* tree */}
        {


          (<Tree
            checkable
            onCheck={onCheck}            
            treeData={treeState.treeData}
            fieldNames={treeFieldName}
            defaultExpandAll={true}
            height={500}
            checkedKeys={treeState.selectedKeys}
            


          />)

        }




      </Modal>
    </div>
  )
}

export default Roles
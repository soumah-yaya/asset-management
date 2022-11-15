import React, { useState, useEffect, useCallback } from 'react'
import api from '../../../request/api'
import BreadCrumb from './BreadCrumb'
import { Card, message, Table, Tag } from 'antd'
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
  title: '权限列表',
  path: null
},
]
function Rights() {
  const [rightsList, setRightsList] = useState([])

  // table columns
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'authName',
      key: 'authName',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '权限等级',
      dataIndex: 'level',
      key: 'level',
      render: (value) => {
        return (<>
          {value === "0" ? <Tag color="blue">一级</Tag>
            : value === "1" ? <Tag color="green">二级</Tag>
              : <Tag color="orange">三级</Tag>}
        </>)
      }
    }
  ];
  // get righst list
  const getRightsList = useCallback(() => {
    api.get('/rights/list')
      .then(({ data: res }) => {
        let { data, meta } = res
        // console.log(data, meta)
        if (meta.status !== 200) {
          return message.error(meta.msg)

        }

        setRightsList(data.map((item) => {
          item.key = item._id
          return item
        }))


      })
  }, [])
  useEffect(() => {
    getRightsList()

  }, [getRightsList])

  // RETURN
  return (
    <div>
      <BreadCrumb list={breadCrum_list} />
      <Card>
        {/* table */}
        <Table
          bordered style={{ marginTop: 15, fontSize: 12 }}
          dataSource={rightsList} columns={columns}
          pagination={false}

        />
      </Card>
    </div>
  )
}

export default Rights
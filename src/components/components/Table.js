import React from 'react'
import {Table as Tab} from 'antd'

function Table({ dataSource, columns, expandable, pagination }) {
  return (
      <Tab
          bordered style={{ marginTop: 15, fontSize: 12 }}
          dataSource={dataSource}
          columns={columns}
          expandable={expandable}
          pagination={pagination}

      />
  )
}

export default Table
import React from 'react'
import { Form } from 'antd'
function ModalFormItems({ rules, label, name, children }) {
  return (
      <Form.Item
          label={label}
          name={name}
          rules={rules}
      >
          {children}
      </Form.Item>
  )
}

export default ModalFormItems
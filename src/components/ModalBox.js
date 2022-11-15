import React from 'react'
import {Modal} from 'antd'
function ModalBox({title, cancelText, okText, okType, isModalOpen, handleOk, handleCancel,handleAfterClose,children}) {
  return (
      <Modal
          title="添加用户"
          open={isModalOpen}
          onOk={handleOk}
          cancelText="取消"
          okText="确认"
          okType="primary"
          onCancel={handleCancel}
          afterClose={handleAfterClose}
      >
          {children}
      </Modal>
  )
}

export default ModalBox
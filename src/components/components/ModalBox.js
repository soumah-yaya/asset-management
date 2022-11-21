import React from 'react'
import {Modal} from 'antd'
function ModalBox({title, cancelText, okText, okType ="primary", isModalOpen, handleOk, handleCancel,handleAfterClose,children}) {
  return (
      <Modal
          title={title}
          open={isModalOpen}
          onOk={handleOk}
          cancelText={cancelText}
          okText={okText}
          okType={okType}
          onCancel={handleCancel}
          afterClose={handleAfterClose}
      >
          {children}
      </Modal>
  )
}

export default ModalBox
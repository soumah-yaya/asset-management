import React from 'react'
import { Space, Button, Popconfirm } from 'antd'
import { EditFilled, DeleteFilled, SettingFilled } from '@ant-design/icons'

function SettingButtons({ onEdit, isShow, onSetting, popConfirm, popCancel, popText, popCancelText, edit_text, delete_text, setting_text }) {
  return (
      <>
          <Space>
              {onEdit && <Button onClick={onEdit} type='primary' icon={<EditFilled />}>{edit_text}</Button>}
              {isShow && <Popconfirm
                  title="此操作将永久删除，是否继续?"
                  onConfirm={popConfirm}
                  onCancel={popCancel}
                  okText={popText}
                  cancelText={popCancelText}
              >
                  <Button  type='danger' icon={<DeleteFilled />}>{delete_text}</Button>
              </Popconfirm>}
              {onSetting  && <Button onClick={onSetting} type='warning' icon={<SettingFilled />}>{setting_text}</Button>}
          </Space>
      </>
  )
}

export default SettingButtons
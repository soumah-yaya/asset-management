import React from 'react'
import { Form } from 'antd'
function ModalForm({ form, children }) {
    return (
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
            form={form}
        >

            {children}
        </Form>
    )
}


export default ModalForm
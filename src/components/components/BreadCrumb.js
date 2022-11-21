import React from 'react'
import { Breadcrumb } from 'antd';
const BreadCrumb = ({ list }) => {
    return (
        <Breadcrumb separator=">">
            {
                list.map(item => {
                    return (
                        <Breadcrumb.Item key={item.id} href={item.path}>{item.title}</Breadcrumb.Item>
                    )
                })
            }
        </Breadcrumb>
    )
}

export default BreadCrumb
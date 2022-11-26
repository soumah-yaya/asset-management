import React, { useState, useEffect, useRef } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import { Alert, Tooltip, Tag, Card, Col, Row, Modal, Cascader, Tabs, message, Form, Input } from 'antd'
import * as request from '../../request/categories'
import AddButton from '../components/AddButton'
import Table from '../components/Table'
import SettingButtons from '../components/SettingButtons'
import { PlusOutlined } from '@ant-design/icons';


/* ------------------- breadcrum list ------------------- */
let breadCrum_list = [{
    id: 0,
    title: '首页',
    path: '/'
}, {
    id: 1,
    title: '商品管理',
    path: null
}, {
    id: 2,
    title: '商品分类',
    path: null
},
]

/* ------------------------------------------------------ */
/*                    PARAMS COMPONENT                    */
/* ------------------------------------------------------ */
function Params() {
    // cateogrie list
    const [cateList, setCateList] = useState([])
    // diseable tabs
    const [isTabsActive, setTabsActive] = useState(true)
    // attribute query 
    const [select, setSelect] = useState('only')
    const [catId, setCatId] = useState('')
    // attribute data
    const [onlyAttrData, setOnlyAttrData] = useState([])
    const [manyAttrData, setManyAttrData] = useState([])
    // modal box 
    const [isAddParamOpen, setIsAddParamOpen] = useState(false)
    const [isEditParamOpen, setIsEditParamOpen] = useState(false)
    // tags
    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const [renderctrl,setRenderCtrl] = useState(false);
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    //current attribute
    const [currentAttr, setCurrentAttr] = useState({})
    let [form] = Form.useForm()
    let [editForm] = Form.useForm()


    /* ------------------------ ALERT ----------------------- */
    const onAlertClose = () => {

    }
    /* ----------------- get categorie list ----------------- */
    useEffect(() => {
        function getCateList() {
            request.getLevelList({ type: 3 })
                .then(({ data: res }) => {
                    let { data, meta: { status } } = res
                    if (status !== 200) return
                    setCateList(data)
                })
        }
        getCateList()
    }, [])
    /* ----------------- get attribute list ----------------- */
    const getAttributeList = (id, sel) => {
        request.getAttrList(id, sel)
            .then(({ data: res }) => {
                let { data, meta } = res;
                if (meta.status !== 200) return
                // add key field to data
                data = data.map((item) => {
                    item.key = item._id
                    item.attr_vals = item.attr_vals?.split(',') || []
                    item.inputVisible = false
                    item.inputValue = ''
                    return item
                })
                // decide tab data
                if (sel === 'only') {
                    setOnlyAttrData(data)
                } else {
                    setManyAttrData(data)
                }
            })
    }

    /* ---------------------- cascader ---------------------- */
    const cascaderFieldNames = { label: 'cat_name', value: '_id', children: 'children' }
    const displayRender = (labels) => labels[labels.length - 1];
    const onCascaderChange = (value) => {
        // console.log(value);
        // control disability of tabs
        if (value) {
            setTabsActive(false)
            let id = value[value.length - 1]
            setCatId(id)
            getAttributeList(id, select)
        }
        else setTabsActive(true)
    };
    /* ------------------------ Tabs ------------------------ */
    const handleTabClick = (key) => {
        // console.log(key)
        // console.log(catId, key)
        setSelect(key)
        getAttributeList(catId, key)
    }
    /* ------------------------ table ----------------------- */
    const columns = [
        {
            title: '参数名称',
            dataIndex: 'attr_name',
            key: 'attr_name',
        },
        {
            title: '操作',
            key: 'setting',
            render(record) {
                return <SettingButtons
                    title
                    onEdit={() => onEdit(record)}
                    isShow={true}
                    popConfirm={() => popConfirm(record)}
                    popCancel={popCancel}
                    popText="确认"
                    popCancelText="取消"
                    edit_text="修改"
                    delete_text="删除"

                />
            }
        },

    ];


    /* ------------------ delete attribute ------------------ */
    const popConfirm = (record) => {
        const { _id, cat_id, attr_sel } = record

        request.deleteAttr(_id, cat_id)
            .then(({ data: res }) => {
                if (res.meta.status !== 201) return message.error(res.meta.msg)
                // console.log(res)
                message.success(res.meta.msg)
                getAttributeList(cat_id, attr_sel)
            })

    }
    const popCancel = () => {
        message.success("取消成功")
    }


    /* ------------------- add param modal ------------------ */
    const openAddModal = (record) => {
        setIsAddParamOpen(true)
        // console.log(1)
    }
    const handleAddOk = () => {
        form.validateFields()
            .then(value => {
                console.log(value)
                request.addAttr(catId, {
                    attr_name: value.attr_name,
                    attr_sel: select,
                })
                    .then(({ data: res }) => {
                        if (res.meta.status !== 200) return message.error(res.meta.msg)
                        message.success(res.meta.msg)
                    })
                setIsAddParamOpen(false)
            })
            .catch(() => setIsAddParamOpen(true))

    }
    const handleAddCancel = () => {
        setIsAddParamOpen(false)
    }
    const handleAddAfterClose = () => {
        form.resetFields()
    }
    /* ------------------- edit param modal ------------------ */
    const onEdit = (record) => {
        // console.log(record)
        openEditModal(record)
    }

    const openEditModal = (record) => {

        editForm.setFieldsValue({ attr_name: record.attr_name })
        setCurrentAttr(record)
        setIsEditParamOpen(true)
        // console.log(1)
    }
    const handleEditOk = () => {
        editForm.validateFields()
            .then((value) => {
                // console.log(value)
                const { _id: id, cat_id } = currentAttr
                request.editAttr(id, cat_id, {
                    attr_name: value.attr_name,
                    attr_sel: select
                })
                    .then(({ data: res }) => {
                        if (res.meta.status !== 201) return message.error(res.meta.msg)
                        message.success(res.meta.msg)
                        getAttributeList(catId, select)
                        setIsEditParamOpen(false)
                    })
            })

    }
    const handleEditCancel = () => {
        message.success("取消修改成功")
        setIsEditParamOpen(false)
    }
    const handleEditAfterClose = () => {
        editForm.resetFields()
    }

    /* ------------------------ tags ------------------------ */
    const handleClose = (i, record) => {
        
        record.attr_vals.splice(i, 1)
        saveAttrVals(record)
    };
    const showInput = (record) => {
        // console.log(record.inputVisible)
        record.inputVisible = true
        setRenderCtrl(true)
        inputRef.current?.focus()
        console.log('show clicked')

    };

    const handleInputChange = (e, record) => {
        setInputValue(e.target.value);
        record.inputValue = e.target.value
    };
    const handleInputConfirm = (record) => {
        // if (inputValue && tags.indexOf(inputValue) === -1) {
        //     setTags([...tags, inputValue]);
        // }
        // avoid duplicate entry and save only if input has a value
        if (record.inputValue && record.attr_vals.indexOf(record.inputValue) === -1) {
            record.attr_vals.push(record.inputValue)
            saveAttrVals(record)
        }
        // console.log(record.inputValue)

        record.inputVisible = false
        setRenderCtrl(false)
        record.inputValue = ''
       
        // setInputVisible(false)
        //       setInputValue('');
        // send update request
        // const { _id: id, cat_id, attr_name, attr_vals} = record
        // request.editAttr(id, cat_id, {
        //     attr_name,
        //     attr_sel: select,
        //     attr_vals: attr_vals.join(',')
        // })
        //     .then(({ data: res }) => {
        //         if (res.meta.status !== 201) return message.error(res.meta.msg)
        //         message.success(res.meta.msg)
        //         // getAttributeList(catId, select)
        //         // setIsEditParamOpen(false)
        //     })


    };
    function saveAttrVals(record) {
        const { _id: id, cat_id, attr_name, attr_vals } = record
        request.editAttr(id, cat_id, {
            attr_name,
            attr_sel: select,
            attr_vals: attr_vals.join(',')
        })
            .then(({ data: res }) => {
                if (res.meta.status !== 201) return message.error(res.meta.msg)
                message.success(res.meta.msg)
                // getAttributeList(catId, select)
                // setIsEditParamOpen(false)
            })
    }

    const handleEditInputChange = (e) => {
        setEditInputValue(e.target.value);
    };
    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setInputValue('')
    };

console.log('render')
    /* ----------------------- RETURN ----------------------- */
    return (
        <div>
            {/* ---------------------- breadcrum --------------------- */}
            <BreadCrumb list={breadCrum_list} />
            {/* ------------------------ card ------------------------ */}
            <Card>
                {/* alert */}
                <Alert
                    message="注意：只允许为第三级分类设置相关参数！"
                    type="warning"
                    closable
                    showIcon
                    onClose={onAlertClose}
                />
                {/* choose categories */}
                <Row style={{ margin: "15px 0" }}>
                    <Col span={3}>
                        <span>选择商品分类：</span>
                    </Col>
                    <Col span={7}>
                        <Cascader
                            options={cateList}
                            expandTrigger="hover"
                            displayRender={displayRender}
                            onChange={onCascaderChange}
                            fieldNames={cascaderFieldNames}
                            size="middle"
                            style={{ width: '100%' }}

                        />
                    </Col>
                </Row>
                {/* ------------------------ tabs ------------------------ */}
                <Tabs defaultActiveKey="only" onTabClick={handleTabClick}>
                    {/* 动态参数 */}
                    <Tabs.TabPane disabled={isTabsActive} tab="动态参数" key="only">

                        <AddButton isDisabled={isTabsActive} onClick={openAddModal} button_text={"添加参数"} />
                        {/* content */}
                        {!isTabsActive && <Table
                            dataSource={onlyAttrData}
                            columns={columns}
                            expandable={{
                                expandedRowRender: (record) => {
                                    // console.log(record, index, indent, expanded)
                                    //    console.log(record)
                                    // setTags(data)
                                    return <>
                                        {record.attr_vals.map((tag, index) => {
                                            if (editInputIndex === index) {

                                                return (
                                                    <Input
                                                        ref={editInputRef}
                                                        key={tag}
                                                        size="small"
                                                        className="tag-input"
                                                        value={editInputValue}
                                                        onChange={handleEditInputChange}
                                                        onBlur={handleEditInputConfirm}
                                                        onPressEnter={handleEditInputConfirm}
                                                        style={{ width: 120 }}
                                                    />
                                                );
                                            }
                                            const isLongTag = tag.length > 20;
                                            const tagElem = (
                                                <Tag
                                                    className="edit-tag"
                                                    key={tag}
                                                    closable={index !== 0}
                                                    onClose={() => handleClose(index, record)}
                                                    color="blue"
                                                    
                                                >
                                                    <span
                                                        onDoubleClick={(e) => {
                                                            if (index !== 0) {
                                                                setEditInputIndex(index);
                                                                setEditInputValue(tag);
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                    </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        } //end map
                                        )
                                        }
                                        {( record.inputVisible) && (
                                            <Input
                                                ref={inputRef}
                                                type="text"
                                                size="small"
                                                className="tag-input"
                                                value={record.inputValue}
                                                onChange={(e) => handleInputChange(e, record)}
                                                onBlur={(() => handleInputConfirm(record))}
                                                onPressEnter={(() => handleInputConfirm(record))}
                                                style={{ width: 120 }}
                                                
                                            />
                                        )}
                                        {!( record.inputVisible) && (
                                            <Tag className="site-tag-plus" onClick={() => showInput(record)}>
                                                <PlusOutlined /> New Tag
                                            </Tag>
                                        )}
                                    </>

                                },


                            }}

                        />}
                    </Tabs.TabPane>
                    {/* 动态属性 */}
                    <Tabs.TabPane disabled={isTabsActive} tab="动态属性" key="many">
                        <AddButton isDisabled={isTabsActive} onClick={openAddModal} button_text={"添加属性"} />
                        {/* content */}
                        {!isTabsActive &&
                            <Table
                                dataSource={manyAttrData}

                                columns={columns}
                                expandable={{
                                    expandedRowRender: (record) => {
                                        // console.log(record, index, indent, expanded)
                                        //    console.log(record)
                                        // setTags(data)
                                        return <>
                                            {record.attr_vals.map((tag, index) => {
                                                if (editInputIndex === index) {

                                                    return (
                                                        <Input
                                                            ref={editInputRef}
                                                            key={tag}
                                                            size="small"
                                                            className="tag-input"
                                                            value={editInputValue}
                                                            onChange={handleEditInputChange}
                                                            onBlur={handleEditInputConfirm}
                                                            onPressEnter={handleEditInputConfirm}
                                                            style={{ width: 120 }}
                                                        />
                                                    );
                                                }
                                                const isLongTag = tag.length > 20;
                                                const tagElem = (
                                                    <Tag
                                                        className="edit-tag"
                                                        key={tag}
                                                        closable={index !== 0}
                                                        onClose={() => handleClose(index, record)}
                                                        color="blue"
                                                    >
                                                        <span
                                                            onDoubleClick={(e) => {
                                                                if (index !== 0) {
                                                                    setEditInputIndex(index);
                                                                    setEditInputValue(tag);
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                        </span>
                                                    </Tag>
                                                );
                                                return isLongTag ? (
                                                    <Tooltip title={tag} key={tag}>
                                                        {tagElem}
                                                    </Tooltip>
                                                ) : (
                                                    tagElem
                                                );
                                            } //end map
                                            )
                                            }
                                            {(record.inputVisible) && (
                                                <Input
                                                    ref={inputRef}
                                                    type="text"
                                                    size="small"
                                                    className="tag-input"
                                                    value={record.inputValue}
                                                    onChange={(e) => handleInputChange(e, record)}
                                                    onBlur={(() => handleInputConfirm(record))}
                                                    onPressEnter={(() => handleInputConfirm(record))}
                                                    style={{ width: 120 }}

                                                />
                                            )}
                                            {!( record.inputVisible) && (
                                                <Tag className="site-tag-plus" onClick={() => showInput(record)}>
                                                    <PlusOutlined /> New Tag
                                                </Tag>
                                            )}
                                        </>

                                    },


                                }}
                            />
                        }
                    </Tabs.TabPane>

                </Tabs>
            </Card>
            {/* ---------------- add params modal box ---------------- */}
            <Modal
                title={select === "only" ? "添加参数" : "添加属性"}
                open={isAddParamOpen}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                afterClose={handleAddAfterClose}
            >
                <Form
                    name="basic"
                    form={form}
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
                        label="添加参数"
                        name="attr_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {/* ---------------- edit params modal box ---------------- */}
            <Modal
                title={select === "only" ? "修改参数" : "修改属性"}
                open={isEditParamOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                afterClose={handleEditAfterClose}
            >
                <Form
                    name="edit"
                    form={editForm}
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
                        label="添加参数"
                        name="attr_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入名称!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}

export default Params
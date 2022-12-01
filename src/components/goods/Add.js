import { Alert, Card, Cascader, Form, Input, message, Steps, Tabs, Checkbox, Upload, Button, Modal } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import { tabsFormRules } from '../../util/formRules';
import { getLevelList, getAttrList } from '../../request/categories'
import { UploadOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill';
import {addGoods} from '../../request/goods'
import { useNavigate } from 'react-router-dom';


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
    title: '商品列表',
    path: null
},
]

/* ------------------------------------------------------ */
/*                           ADD  COMPONENT                        */
/* ------------------------------------------------------ */
function Add() {
    const [currentStep, setCurrentStep] = useState(0)
    const [tabsActiveKey, setTabsActiveKey] = useState('0')
    const [catList, setCatList] = useState([])
    const [catId, setCatId] = useState('')
    const [manyFormData, setManyFormData] = useState([])
    const [onlyFormData, setOnlyFormData] = useState([])
    const [fileList, setFileList] = useState([])
    const [uploadPreviewPath, setUploadPreviewPath] = useState('')
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [quilComment, setQuilComment] = useState('');
    // const [attrInfo, setAttrInfo] = useState([])
    // const [formData, setFormData] = useState({
    //     "goods_name": "",
    //     "goods_cat": "",
    //     "goods_price": 0,
    //     "goods_number": 0,
    //     "goods_weight": 0,
    //     "goods_introduce": "",
    //     "pics": [],
    //     "attrs": []
    // })
    const navigate = useNavigate()
    const { Step } = Steps;
    const getCategorieList = useCallback(() => {
        getLevelList()
            .then(({ data: res }) => {
                res.data.forEach(element => {
                    element.key = element._id
                });
                // console.log(res.data)
                setCatList(res.data)

            })
    }, [setCatList])

    useEffect(() => {
        getCategorieList()
    }, [getCategorieList])
    /* ------------------------ TABS ------------------------ */

    const onTabsChange = (key) => {
        if (catId) {
            setTabsActiveKey(key)
            setCurrentStep(parseInt(key))

        } else {
            message.error('请先选择分类')
        }

        switch (key) {
            case '1':
                getAttrList(catId, 'many')
                    .then(({ data: res }) => {
                        // console.log(res.data)
                        res.data.forEach((item) => {                            
                            
                            item.attr_vals = item.attr_vals.length !== 0
                                ? item.attr_vals.split(',')
                                : []
                        })
                        setManyFormData(res.data)
                    })
                break;
            case '2':
                getAttrList(catId, 'only')
                    .then(({ data: res }) => {
                        // console.log(res.data)                       

                        setOnlyFormData(res.data)
                    })
                break;
            default: break;
        }
    }
    /* ------------------------ FORM ------------------------ */
    const [formProduct] = Form.useForm()


    const handleAddProduct = () => {
        const formData = {
            goods_name:'',
            goods_cat:'',
            goods_price:'',
            goods_number:'',
            goods_weight:'',
            goods_introduce:'',
            pics:[],
            
        }
        formProduct.validateFields()
            .then((value) => {
            //    console.log(value)
                const attrs = []
                for(let item in value){
                    // console.log(item)
                    if(formData.hasOwnProperty(item)){
                        // console.log('in', formData[item])
                        if(item === 'pics'){
                            value[item].forEach(pic=>{

                                formData[item].push({ pic: pic.response.data.tmp_path })
                            })
                        } else if(item === 'goods_cat'){
                            formData[item] = value[item].join(',')
                        }
                        else{
                            formData[item] = value[item]
                        }
                        
                    }else{
                        
                        // console.log('not', Array.isArray(value[item]))
                        if (Array.isArray(value[item])) {
                            attrs.push({
                                attr_id: item,
                                attr_val: value[item].join(',')
                            })
                            // console.log('array',value[item].join(','))
                        } else {
                            attrs.push({
                                attr_id: item,
                                attr_val: value[item]
                            })
                        }
                        formData.attrs = attrs
                    }
                }
                // send add product request
                addGoods(formData)
                .then(({data:res})=>{
                    if(res.meta.status !== 201) return message.error(res.meta.msg)
                    message.success(res.meta.msg)
                    formProduct.resetFields()
                    setIsPreviewOpen(false)
                    navigate('/goods')

                }).catch(()=>{
                    message.error("添加商品失败")
                })
               
            })
            .catch(() => {
                message.error("请填必填的数据")
            })
    }

    /* ---------------------- CASCADER ---------------------- */
    const fieldNames = { label: 'cat_name', value: '_id', children: 'children' }

    const onCatChange = (value) => {
        // console.log(value);
        if (value) {
            setCatId(value[2])
        } else {
            setCatId('')
        }
    };

    // Just show the latest item.
    const displayCatRender = (labels) => labels[labels.length - 1]

    /* ---------------------- CHECKBOX ---------------------- */
    const onCheckboxChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };


    /* ----------------------- UPLOAD ----------------------- */

    const handleUploadChange = (value) => {
        // console.log(value.file)
        const { status } = value.file
        // console.log(status)
        if (status === 'done') {
            let { data, meta } = value.file.response
            if (meta.status === 200) {
                setFileList((prev) => {
                    prev.push({ pic: data.tmp_path })
                    return prev
                })

            }
            // console.log(fileList)
        }
        if (status === 'removed') {
            let { data } = value.file.response
            setFileList((prev) => {
                let index = prev.indexOf(data.tmp_path)
                prev.splice(index, 1)
                return prev
            })
            console.log(fileList)
        }

    }
    const normFile = (e) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleUploadPreview = (value) => {
        console.log(value)
        setUploadPreviewPath(value.response.data.url)
        setIsPreviewOpen(true)
    }

    /* ------------------------ QUILL ------------------------ */
    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ]
    }
    const formats = [
        'font',
        'size',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'align',
        'color', 'background'
    ]

    const rteChange = (content, delta, source, editor) => {
        // console.log('content:', content, 'delta:', delta, 'source:', source, 'editor:',editor)
        // console.log(editor.getHTML()); // rich text
        // console.log(editor.getText()); // plain text
        // console.log(editor.getLength()); // number of characters
        setQuilComment(editor.getText())
    }
    /* ----------------------- RETURN ----------------------- */
    return (
        <div>
            <BreadCrumb list={breadCrum_list} />
            <Card>
                <Alert message="添加商品信息" type="warning" showIcon closable />
                { /* ------------------------ steps ----------------------- */}
                <Steps
                    labelPlacement="vertical"
                    current={currentStep}
                >
                    <Step title="基本信息" />
                    <Step title="商品参数" />
                    <Step title="商品属性" />
                    <Step title="商品图片" />
                    <Step title="商品内容" />
                    <Step title="完成" />
                </Steps>;
                {/* ------------------------ Tabs ------------------------ */}
                <Form

                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    form={formProduct}
                    autoComplete="off"
                >
                    <Tabs
                        activeKey={tabsActiveKey}
                        tabPosition="left"
                        onChange={onTabsChange}
                        defaultActiveKey="1"
                        items={[
                            {
                                label: '基本信息', key: '0', children: <> <Form.Item
                                    label="商品名称"
                                    name="goods_name"
                                    rules={tabsFormRules.goodsName}
                                >
                                    <Input />
                                </Form.Item>
                                    <Form.Item
                                        label="商品价格"
                                        name="goods_price"
                                        rules={tabsFormRules.goodsPrice}
                                        initialValue='0'
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                    <Form.Item
                                        label="商品重量"
                                        name="goods_weight"
                                        rules={tabsFormRules.goodsWeight}
                                        initialValue='0'
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                    <Form.Item
                                        label="商品数量"
                                        name="goods_number"
                                        rules={tabsFormRules.goodsNumber}
                                        initialValue='0'
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 10 }}
                                        label="商品分类"
                                        name="goods_cat"

                                    >
                                        <Cascader
                                            options={catList}
                                            expandTrigger="hover"
                                            displayRender={displayCatRender}
                                            onChange={onCatChange}
                                            fieldNames={fieldNames}
                                        />
                                    </Form.Item> </>

                            },
                            {
                                label: '商品参数', key: '1', children: <>
                                    {
                                        manyFormData.map((cat) => {
                                            return (
                                                <Form.Item
                                                    key={cat._id}
                                                    label={cat.attr_name}
                                                    name={cat._id}
                                                    initialValue={cat.attr_vals}
                                                >
                                                    <Checkbox.Group options={cat.attr_vals} onChange={() => onCheckboxChange(cat._id)} />
                                                </Form.Item>
                                            )
                                        })
                                    }
                                </>
                            },
                            {
                                label: '商品属性', key: '2', children: <>

                                    {
                                        onlyFormData.map((cat) => {
                                            return (
                                                <Form.Item
                                                    key={cat._id}
                                                    label={cat.attr_name}
                                                    name={cat._id}
                                                    rules={tabsFormRules.goodsName}
                                                    initialValue={cat.attr_vals}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            )
                                        })
                                    }
                                </>
                            },
                            {
                                label: '商品图片', key: '3', children: <>
                                    <Form.Item
                                        label=""
                                        name="pics"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                    >

                                        <Upload
                                            name='file'
                                            action="http://127.0.0.1:8080/api/v1/private/upload"
                                            listType="picture"
                                            onChange={handleUploadChange}
                                            onPreview={handleUploadPreview}


                                            headers={{ Authorization: window.localStorage.getItem('token') }}
                                        >
                                            <Button type='primary' icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            },
                            {
                                label: '商品内容', key: '4', children: <>
                                    <Form.Item

                                        label=""
                                        name="goods_introduce"

                                    >
                                        <ReactQuill theme="snow" modules={modules}
                                            formats={formats} onChange={rteChange}
                                            value={quilComment} />
                                        {/* 添加商品 */}
                                    </Form.Item>
                                    <Button onClick={handleAddProduct} type='primary'>添加商品</Button>
                                </>
                            },
                        ]}
                    />


                </Form>

            </Card>
            {/* -------------------- preview modal ------------------- */}
            <Modal title="图片预览" open={isPreviewOpen} onOk={() => setIsPreviewOpen(false)}
                closable onCancel={() => setIsPreviewOpen(false)} >
                <img src={uploadPreviewPath} alt='图片预览' />

            </Modal>
        </div>
    )
}

export default Add

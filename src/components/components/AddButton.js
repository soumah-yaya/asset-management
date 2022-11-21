import React from 'react'
import { Row, Col, Button } from 'antd'


function AddButton({ onClick, button_text }) {
  return (
    <>
          <Row>
              <Col>
                  <Button onClick={onClick} type='primary'>{button_text}</Button>
              </Col>
          </Row>
    </>
  )
}

export default AddButton
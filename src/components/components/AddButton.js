import React from 'react'
import { Row, Col, Button } from 'antd'


function AddButton({ onClick, button_text,isDisabled }) {
  return (
    <>
          <Row>
              <Col>
                  <Button onClick={onClick} disabled={isDisabled} type='primary'>{button_text}</Button>
              </Col>
          </Row>
    </>
  )
}

export default AddButton
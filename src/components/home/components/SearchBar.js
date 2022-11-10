import React from 'react'
import { Space, Button, Input } from 'antd';

const { Search } = Input;



function SearchBar({  handleAddNewUser, onSearch, text, placeHoleder, width=400 }) {
  return (
      <Space size="large">
      <Search allowClear placeholder={placeHoleder} onSearch={onSearch} style={{ width}} />
          <Button type="primary" onClick={handleAddNewUser}>{text}</Button>
      </Space>
  )
}

export default SearchBar
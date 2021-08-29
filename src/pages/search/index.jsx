import {
  Input, Button, Row, Col, Form,
  Select, Space
} from 'antd';
import { useState } from 'react';
import SearchList from './components/SearchList';

const { Option } = Select;

function Search() {
  const [formData, setFormData] = useState({});

  const onFinish = value => {
    setFormData({ ...value });
  };

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish}>
          <Space>
            <Col>
              <Form.Item name='src_type'>
                <Select
                  placeholder='选择搜索来源'
                  style={{ width: 200 }}
                >
                  <Option value='specif'>规范来源</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name='query_str'>
                <Input
                  placeholder='搜索目标'
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type='primary' htmlType='submit'>从文本搜索</Button>
              </Form.Item>
            </Col>
          </Space>
        </Form>
      </Row>
      <br />
      <SearchList formData={formData} />
    </>
  );
};

export default Search;
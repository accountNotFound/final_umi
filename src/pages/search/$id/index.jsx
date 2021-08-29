import { useEffect, useState } from 'react';
import {
  Row, Form, Space, Col, Input, Button
} from 'antd';
import SearchList from '../components/SearchList';
import SearchTree from '../components/searchTree';

function SearchDetail(props) {
  const { id: currentID, title, sourceType } = props.location.state;
  const metaID = currentID.split('@')[0];
  const [mode, setMode] = useState('tree');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setMode('tree');
  }, [currentID]);

  const onFinish = value => {
    setMode('list');
    setFormData({
      src_type: 'specif',
      prefix: metaID,
      ...value
    });
  };

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish}>
          <Space>
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
      {
        mode === 'tree'
          ? <>
            <SearchTree currentID={currentID} title={title} sourceType={sourceType} />
          </>
          : <>
            <SearchList formData={formData} />
          </>
      }
    </>
  )
};

export default SearchDetail;
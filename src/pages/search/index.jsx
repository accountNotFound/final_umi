import {
  Input, Button, Row, Col, Form,
  Spin, Pagination, Select, Space, List, Empty, message
} from 'antd';
import { useState } from 'react';
import * as Service from '../../service/search';

const { Option } = Select;

function Search() {
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState('');
  const [formData, setFormData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  const handlePageChange = (currentPage, pageSize) => {

  };

  const onFinish = value => {
    const data = {
      ...value,
      page_from: 1,
      page_size: 10,
    };
    setLoading(true);
    Service.getAbsQueries(data).then(res => {
      console.log(res);
      if (res.code === 0) {
        setDataSource(res.data.items);
        setTotalSize(res.data.total_size);
        setFormData({ ...value });
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
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
                  onChange={value => setSourceType(value)}
                >
                  <Option value='specif'>规范来源</Option>
                  {/* <Option value='pedia'>其他来源</Option> */}
                </Select>
              </Form.Item>
            </Col>
            {/* {
              sourceType === 'src_specif' ?
                <Col>
                  <Form.Item name='format_type'>
                    <Select
                      placeholder='选择格式化模式'
                      style={{ width: 200 }}
                    >
                      <Option value='ele_args'>元素参数类</Option>
                      <Option value='ele_exist'>元素存在类</Option>
                      <Option value='ele_count'>元素数量类</Option>
                    </Select>
                  </Form.Item>
                </Col>
                : <></>
            } */}
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
      <Row justify='center'>
        {
          loading ?
            <Spin /> :
            dataSource.length === 0 ?
              <Empty /> :
              <>
                <List
                  style={{ minHeight: 350, minWidth: 1000 }}
                  itemLayout="horizontal"
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item
                      actions={[<a>详情</a>]}
                    >
                      <List.Item.Meta
                        title={item.text}
                        description={item.title}
                      />
                    </List.Item>
                  )}
                />
                <Pagination
                  style={{ minWidth: 600 }}
                  defaultCurrent={currentPage}
                  total={totalSize}
                  showSizeChanger={true}
                  showQuickJumper={true}
                  onChange={handlePageChange}
                />
              </>
        }
      </Row>
    </>

  );
};

export default Search;
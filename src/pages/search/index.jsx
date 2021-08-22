import {
  Input, Button, Row, Col, Form,
  Spin, Pagination, Select, Space, List, Empty, message
} from 'antd';
import Link from 'umi/link';
import { useState } from 'react';
import { getAbsQueries } from '../../service/search';

const { Option } = Select;

function Search() {
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState('');
  const [formData, setFormData] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  const markHtml = text => {
    const keys = formData.query_str.split(' ');
    keys.forEach(k => {
      text = text.replaceAll(k, `<mark style="background-color: #58D3F7">${k}</mark>`);
    });
    return text;
  };

  const submitQuery = (value, page_from, page_size) => {
    const data = {
      ...value,
      page_from,
      page_size
    };
    setLoading(true);
    getAbsQueries(data).then(res => {
      if (res.code === 0) {
        setDataSource(res.data.items);
        setTotalSize(res.data.total_size);
        setCurrentPage(page_from);
        setPageSize(page_size);
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  };

  const handlePageChange = (currentPage, pageSize) => {
    submitQuery(formData, currentPage, pageSize);
  };

  const onFinish = value => {
    setFormData(value);
    submitQuery(value, 1, 10);
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
                  itemLayout='horizontal'
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item
                      actions={
                        [
                          <Link
                            to={{
                              pathname: `/search/${item.id}`,
                              state: {
                                id: item.id,
                                title: item.title,
                                sourceType
                              }
                            }}
                          >
                            详情
                          </Link>
                        ]
                      }
                    >
                      <List.Item.Meta
                        title={<p dangerouslySetInnerHTML={{ __html: markHtml(item.text) }} />}
                        description={item.title}
                      />
                    </List.Item>
                  )}
                />
                <Pagination
                  style={{ minWidth: 600 }}
                  defaultCurrent={currentPage}
                  defaultPageSize={pageSize}
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
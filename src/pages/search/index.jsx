import { Input, Button, Row, Col } from 'antd';
import { Table, Select, Space } from 'antd';

const { Option } = Select;

function Search() {

  const columns = [
    {
      title: '对象',
      dataIndex: 'object',
      key: 'object',
    },
    {
      title: '前提',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: '约束',
      dataIndex: 'constrain',
      key: 'constrain',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '严格程度',
      dataIndex: 'strict',
      key: 'strict',
    },
    {
      title: '源',
      dataIndex: 'source',
      key: 'source',
    }
  ];

  return (
    <>
      <Row justify="center">
        <Space>
          <Col>
            <Select placeholder="选择格式化模式" style={{ width: 200 }}>
              <Option value='ele-args'>元素参数类</Option>
              <Option value='ele-exist'>元素存在类</Option>
              <Option value='ele-count'>元素数量类</Option>
            </Select>
          </Col>
          <Col>
            <Input placeholder="搜索目标" style={{ width: 200 }}></Input>
          </Col>
          <Col>
            <Button type="primary">结构化搜索</Button>
          </Col>
        </Space>
      </Row>
      <br />
      <Row justify='center'>
        <Table columns={columns} style={{ minWidth: 1200 }} bordered></Table>
      </Row>
    </>

  );
};

export default Search;

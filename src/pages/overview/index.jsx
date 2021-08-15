import {
  Tabs, Input, Button, Row, Col,
  Form, Spin, Space, message
} from 'antd';
import { useState, useEffect } from 'react';
import Graph from './components/Graph';
import * as Service from '../../service/overview';

const { TabPane } = Tabs;

function Overiew() {
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLoading(true);
    Service.getTopRefs(3).then(res => {
      if (res.code === 0) {
        setNodes([...res.data.nodes]);
        setLinks([...res.data.links]);
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  }, []);

  const onFinish = value => {
    console.log(value);
  };

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish}>
          <Space>
            <Col>
              <Form.Item name='query'>
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type='primary' htmlType='submit'>从图谱搜索</Button>
              </Form.Item>
            </Col>
          </Space>
        </Form>
      </Row>

      <Tabs type='card' defaultActiveKey='source' centered>
        <TabPane tab='资料图谱' key='source' >
          <Row justify="center">
            {
              loading ?
                <Spin /> :
                <>
                  <Col span={20}>
                    <Graph nodes={nodes} links={links} />
                  </Col>
                  {/* <Col span={4}>
                    <TreeDetail />
                  </Col> */}
                </>
            }
          </Row>
        </TabPane>
        <TabPane tab='知识图谱' key='knowledge' >
          {
            loading ?
              <Spin /> :
              <></>
          }
        </TabPane>
      </Tabs>
    </>

  );
};

export default Overiew;

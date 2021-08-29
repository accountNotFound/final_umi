import {
  Tabs, Input, Button, Row, Col,
  Form, Spin, Space, message, Tag
} from 'antd';
import Link from 'umi/link';
import { useState, useEffect } from 'react';
import Graph from './components/Graph';
import { getTopRefs, postGraphQueries } from '../../service/overview';

const { TabPane } = Tabs;

function Overiew() {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('source');
  const [currentNode, setCurrentNode] = useState({});
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLoading(true);
    getTopRefs(3).then(res => {
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

  const onFinish = data => {
    setCurrentNode({});
    setLoading(true);
    postGraphQueries(data).then(res => {
      if (res.code === 0) {
        setNodes([...res.data.nodes]);
        setLinks([...res.data.links]);
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  };

  const handleChange = activeKey => {
    setCurrentTab(activeKey);
    console.log(activeKey);
  };

  const handleClick = data => {
    setCurrentNode({ id: data.id, name: data.name, index: data.index });
    data.fx = data.x;
    data.fy = data.y;
    // data.show = !data.show;
  };

  const handleExpand = () => {

  };

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish}>
          <Space>
            <Col>
              <Form.Item name='query_str'>
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

      <Tabs
        type='card'
        defaultActiveKey={currentTab}
        onChange={handleChange}
        centered
      >
        <TabPane tab='资料图谱' key='source' >
          <Row justify="center">
            {
              loading ?
                <Spin /> :
                <>
                  <Col span={20}>
                    <>
                      {
                        currentNode.name ?
                          <Row>
                            <Space>
                              <Tag color='geekblue'>{currentNode.name}</Tag>
                              <Button type='link' onClick={handleExpand}>更多关联</Button>

                              <Link
                                to={{
                                  pathname: `/search/${currentNode.id}@`,
                                  state: {
                                    id: `${currentNode.id}@`,
                                    title: currentNode.name,
                                    sourceType: 'specif'
                                  }
                                }}
                              >
                                详情
                              </Link>

                            </Space>
                          </Row>
                          :
                          <></>
                      }
                    </>
                    <Graph nodes={nodes} links={links} handleClick={handleClick} />
                  </Col>
                </>
            }
          </Row>
        </TabPane>
        <TabPane tab='知识图谱' key='knowledge' >
          <Row justify='center'>
            {
              loading ?
                <Spin /> :
                <></>
            }
          </Row>
        </TabPane>
      </Tabs>
    </>

  );
};

export default Overiew;

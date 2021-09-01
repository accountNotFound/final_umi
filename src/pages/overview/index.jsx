import {
  Tabs, Input, Button, Row, Col,
  Form, Spin, Space, message, Tag
} from 'antd';
import Link from 'umi/link';
import { useState, useEffect, useRef } from 'react';
import Graph from './components/Graph';
import { getTopRefs, postGraphQueries, getCenterQueries } from '../../service/overview';

const { TabPane } = Tabs;

function Overiew() {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('source');
  const [currentNodeRef, setCurrentNodeRef] = useState({});
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const ref = useRef();

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
    setCurrentNodeRef({});
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

  const handleChoose = nodeRef => {
    const { nodes: simulationNodes } = ref.current.getDataRef();
    simulationNodes.forEach(it => {
      it.show = false;
    });
    nodeRef.show = true;
    setCurrentNodeRef(nodeRef);
  };

  const handleExpand = () => {
    getCenterQueries(currentNodeRef.id).then(res => {
      if (res.code === 0) {
        const { nodes: simulationNodes, links: simulationLinks } = ref.current.getDataRef();
        setNodes([...merge(simulationNodes, res.data.nodes, it => it.id)]);
        setLinks([...merge(simulationLinks, res.data.links, it => (it.source + it.target))]);
      } else {
        message.error(res.message);
      }
    });
  };

  const merge = (src, extra, genKeyFunc) => {
    let vis = new Set();
    src.forEach(it => {
      const k = genKeyFunc(it);
      if (!vis.has(k)) {
        vis.add(k);
      }
    });
    let res = [...src];
    extra.forEach(it => {
      const k = genKeyFunc(it);
      if (!vis.has(k)) {
        res.push(it);
      }
    });
    return res;
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
                        currentNodeRef.name ?
                          <Row>
                            <Space>
                              <Tag color='geekblue'>{currentNodeRef.name}</Tag>
                              <Button type='link' onClick={handleExpand}>
                                展开图谱
                              </Button>
                              <Link
                                to={{
                                  pathname: `/search/${currentNodeRef.id}@`,
                                  state: {
                                    id: `${currentNodeRef.id}@`,
                                    title: currentNodeRef.name,
                                    sourceType: 'specif'
                                  }
                                }}
                              >
                                文档详情
                              </Link>
                            </Space>
                          </Row>
                          :
                          <></>
                      }
                    </>
                    <Graph nodes={nodes} links={links} handleChoose={handleChoose} ref={ref} />
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

import {
  Input, Button, Row, Col,
  Form, Spin, Space, message, Tag
} from 'antd';
import Link from '../../../layouts/Link.jsx';
import { useState, useEffect, useRef } from 'react';
import Graph from './Graph.jsx';
import { getTopRefs, postGraphQueries, getCenterQueries } from '../../../service/overview.jsx';

function SourceGraph() {
  const [loading, setLoading] = useState(false);
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
        console.log(res.data);
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

  const handleChoose = (nodeRef, linkRef) => {
    if (nodeRef === null) {
      return;
    }
    const { nodes: simulationNodes } = ref.current.getDataRef();
    simulationNodes.forEach(it => {
      it.show = false;
    });
    nodeRef.show = true;
    setCurrentNodeRef(nodeRef);
  };

  const handleExpand = () => {
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

      <Row justify="center">
        {
          loading ?
            <Spin /> :
            <>
              <Col span={20}>
                <>
                  {
                    currentNodeRef?.name ?
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
                <Graph chartID='source' nodes={nodes} links={links} handleChoose={handleChoose} ref={ref} />
              </Col>
            </>
        }
      </Row>
    </>

  );
};

export default SourceGraph;

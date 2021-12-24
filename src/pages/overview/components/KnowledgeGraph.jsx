import {
  Input, Button, Row, Col, Space, Select, Table,
  Form, Spin, message, Tag
} from 'antd';
import Link from '../../../layouts/Link.jsx';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { postCypherQueries, getCenterQueries } from '../../../service/overview.jsx';
import Graph from './Graph.jsx';

const NODE_TYPES = [
  'attribute', 'conception', 'object', 'placeholder'
];

const REL_TYPES = [
  'apply_condtion', 'apply_exception', 'apply_target', 'join_by', 'join_on', 'predicate', 'attr_by'
];

const FILTER_TYPES = [
  'head_type', 'tail_type', 'rel_type', 'head_id', 'tail_id', 'rel_group_id'
];

function KnowledgeGraph() {

  const [filters, setFilters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentNodeRef, setCurrentNodeRef] = useState({});
  const [currentLinkRef, setCurrentLinkRef] = useState({});
  const ref = useRef();

  const appendFilter = add => {
    setFilters([...filters, '']);
    add(-1);
  };

  const removeFilter = (remove, index) => {
    filters.splice(index, 1);
    setFilters([...filters]);
    remove(index);
  };

  const selectFilter = (value, index) => {
    filters[index] = value;
    setFilters([...filters]);
  };

  const getFilterValues = ftype => {
    if (ftype === 'head_type' || ftype === 'tail_type') {
      return NODE_TYPES;
    } else if (ftype === 'rel_type') {
      return REL_TYPES;
    } else {
      return [];
    }
  };

  const onFinish = data => {
    const getFilterDict = filterFields => {
      let res = new Map();
      if (filterFields !== undefined) {
        for (const { key, value } of filterFields) {
          if (res.has(key)) {
            return `duplicated key: ${key}`;
          }
          if (key.endsWith('id') && value.length > 1) {
            return `duplicated id at： ${key}`;
          }
          res[key] = value;
        }
      }
      return res;
    };
    const { head, tail, filters } = data;
    const filterDict = getFilterDict(filters);
    if (typeof (filterDict) === 'string') {
      message.error(filterDict);
      return;
    }
    setLoading(true);
    postCypherQueries({ head, tail, filterDict }).then(res => {
      if (res.code === 0) {
        setCurrentNodeRef({});
        setCurrentLinkRef({});
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
    const { nodes: simulationNodes, links: simulationLinks } = ref.current.getDataRef();
    if (nodeRef !== null) {
      links.forEach(link => {
        if (link.source.id === nodeRef.id || link.target.id === nodeRef.id) {
          link.show = true;
        } else {
          link.show = false;
        }
      });
      setCurrentNodeRef(nodeRef);
      setCurrentLinkRef({});
    } else {
      links.forEach(link => link.show = false);
      linkRef.show = true;
      setCurrentNodeRef({});
      setCurrentLinkRef(linkRef);
    }
  };

  const handleExpand = (record, forward) => {
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
    const handleResponse = res => {
      if (res.code === 0) {
        const { nodes: simulationNodes, links: simulationLinks } = ref.current.getDataRef();
        setNodes([...merge(simulationNodes, res.data.nodes, it => it.id)]);
        setLinks([...merge(simulationLinks, res.data.links, it => (it.source + it.target))]);
      } else {
        message.error(res.message);
      }
    };
    if (record.target) {
      postCypherQueries(
        {
          filterDict: {
            head_id: forward ? [record.target.id] : [],
            tail_id: forward ? [] : [record.source.id],
            rel_group_id: [record.data.group_id]
          }
        }
      ).then(handleResponse);
    } else {
      getCenterQueries(record.id).then(handleResponse)
    }
  };

  const nodeColumn = [
    {
      title: '节点名',
      dataindex: 'name',
      key: 'name',
      render: record => <p>{record.name}</p>
    },
    {
      title: '类型',
      dataindex: 'type',
      key: 'type',
      render: record => (
        <Tag color={ref.current.getNodeColor()(record.type)}>
          {record.type}
        </Tag>
      )
    },
    {
      title: 'ID',
      dataindex: 'id',
      key: 'id',
      render: record => <p>{record.id}</p>
    },
    {
      title: '属性',
      dataindex: 'attrs',
      key: 'attrs',
      render: record => (
        <Row>
          <Space>
            {
              record.attrs.slice(0, 10).map(it => (
                <Tag color={ref.current.getNodeColor()(it.type)}>
                  {it.name}
                </Tag>
              ))
            }
          </Space>
        </Row>
      )
    },
    {
      title: '更多',
      render: record => (
        <Button type='link' onClick={() => handleExpand(record)}>
          随机展开
        </Button>
      )
    }
  ];

  const linkColumn = [
    {
      title: '起点',
      dataindex: 'source',
      key: 'source',
      render: record => (
        <Tag color={ref.current.getNodeColor()(record.source.type)}>
          {record.source.name}
        </Tag>
      )
    },
    {
      title: '关系内容',
      dataindex: 'name',
      key: 'name',
      render: record => (
        <Tag color={ref.current.getLinkColor()(record.data.type)}>
          {record.data.name}
        </Tag>
      )
    },
    {
      title: '终点',
      dataindex: 'target',
      key: 'target',
      render: record => (
        <Tag color={ref.current.getNodeColor()(record.target.type)}>
          {record.target.name}
        </Tag>
      )
    },
    {
      title: '组ID',
      dataindex: 'group_id',
      key: 'group_id',
      render: record => <p>{record.data.group_id}</p>
    },
    {
      title: '更多',
      render: record => (
        <Space>
          <Button type='link' onClick={() => handleExpand(record, false)}>
            展开组ID上游
          </Button>
          <Button type='link' onClick={() => handleExpand(record, true)}>
            展开组ID下游
          </Button>
          <Link
            to={{
              pathname: `/search/${currentLinkRef?.data.group_id.split('*')[0]}`,
              state: {
                id: `${currentLinkRef?.data.group_id.split('*')[0]}`,
                title: null,
                sourceType: currentLinkRef.data.source_type,
              }
            }}
          >
            文档详情
          </Link>
        </Space>
      )
    }
  ];

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish} >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name='head'>
                <Input placeholder='节点1' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='tail'>
                <Input placeholder='节点2' />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name='filters'>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Row gutter={24}>
                    <Col span={11}>
                      <Form.Item name={[field.name, 'key']} fieldKey={[field.name, 'key']}>
                        <Select onSelect={value => selectFilter(value, index)}>
                          {
                            FILTER_TYPES.map(t => (
                              <Select.Option value={t}>{t}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item name={[field.name, 'value']} fieldKey={[field.name, 'value']}>
                        <Select mode='tags'>
                          {
                            getFilterValues(filters[field.name]).map(t => (
                              <Select.Option value={t}>{t}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined onClick={() => removeFilter(remove, field.name)} />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Row justify='end'>
                    <Space>
                      <Button type='dashed' onClick={() => appendFilter(add)} icon={<PlusOutlined />}>
                        过滤条件
                      </Button>
                      <Button type='primary' htmlType='submit'>搜索</Button>
                    </Space>
                  </Row>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Row>

      <Row justify="center">
        {
          loading ? <Spin /> : <></>
        }
        <Col span={20}>
          <>
            {
              currentNodeRef?.name ?
                <Table
                  columns={nodeColumn}
                  dataSource={
                    [{
                      ...currentNodeRef,
                      attrs: links
                        .filter(it => it.source.id === currentNodeRef.id && it.data.type === 'attr_by')
                        .map(it => it.target)
                    }]
                  }
                  pagination={false}
                />
                :
                currentLinkRef?.data ?
                  <Table
                    columns={linkColumn}
                    dataSource={
                      [currentLinkRef]
                    }
                    pagination={false}
                  />
                  : <></>

            }
          </>
          <Graph chartID='knowledge' nodes={nodes} links={links} handleChoose={handleChoose} ref={ref} />
        </Col>
      </Row>
    </>
  );
};

export default KnowledgeGraph;

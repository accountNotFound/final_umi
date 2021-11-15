import {
  Input, Button, Row, Col, Space, Select,
  Form, Spin, message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { postCypherQueries } from '../../../service/overview';
import Graph from './Graph';

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
        setNodes([...res.data.nodes]);
        setLinks([...res.data.links]);
        setLoading(false);
        console.log(res.data);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  };

  const handleChoose = nodeRef => {
    const { nodes: simulationNodes, links: simulationLinks } = ref.current.getDataRef();
    setCurrentNodeRef(nodeRef);
    for (let i in links) {
      if (links[i].source.id === nodeRef.id || links[i].target.id === nodeRef.id) {
        links[i].show = true;
      } else {
        links[i].show = false;
      }
    }
  };

  return (
    <>
      <Row justify='center'>
        <Form onFinish={onFinish} >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name='head'>
                <Input placeholder='起点' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='tail'>
                <Input placeholder='终点' />
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
          loading ?
            <Spin /> :
            <>
              <Col span={20}>
                <Graph chartID='knowledge' nodes={nodes} links={links} handleChoose={handleChoose} ref={ref} />
              </Col>
            </>
        }
      </Row>
    </>
  );
};

export default KnowledgeGraph;

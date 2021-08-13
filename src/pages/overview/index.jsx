import { Tabs, Input, Button, Row, Col } from 'antd';
import Graph from './components/Graph';
// import TreeDetail from './components/TreeDetail';

const { TabPane } = Tabs;

function Overiew() {
  return (
    <>
      <Row justify="center">
        <Col span={6}>
          <Input></Input>
        </Col>
        <Col>
          <Button type="primary">从图谱搜索</Button>
        </Col>
      </Row>
      <br />
      <Tabs type='card' defaultActiveKey='source' centered>
        <TabPane tab='资料图谱' key='source' >
          <Row justify="center">
            <Col span={20}>
              <Graph />
            </Col>
            {/* <Col span={4}>
              <TreeDetail />
            </Col> */}
          </Row>
        </TabPane>
        {/* <TabPane tab='知识图谱' key='knowledge' >

        </TabPane> */}
      </Tabs>
    </>

  );
};

export default Overiew;

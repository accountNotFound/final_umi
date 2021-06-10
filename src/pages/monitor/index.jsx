import { Input, Button, Row, Col } from 'antd';

function Search() {

  return (
    <>
      <Row justify="center">
        <Col span={6}>
          <Input></Input>
        </Col>
        <Col>
          <Button type="primary">结构化搜索</Button>
        </Col>
      </Row>
    </>

  );
};

export default Search;

import React, { useState } from 'react';
import Link from 'umi/link';
import { Layout, Menu, Row, Col } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  DesktopOutlined,
  PieChartOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function BasicLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const currentKey = props.location.pathname.slice(1);

  return (
    <Layout>
      <Sider collapsed={collapsed}>
        <Menu
          theme='dark'
          mode='inline'
          multiple={false} defaultSelectedKeys={[currentKey || 'overview']}
        >
          <Menu.Item key='defalut'>
          </Menu.Item>
          <Menu.Item key='overview' icon={<AppstoreOutlined />}>
            <Link to={{ pathname: '/overview' }}>
              知识库概况
            </Link>
          </Menu.Item>
          <Menu.Item key='search' icon={<DesktopOutlined />}>
            <Link to={{ pathname: '/search' }}>
              结构化搜索
            </Link>
          </Menu.Item>
          <Menu.Item key='monitor' icon={<PieChartOutlined />}>
            <Link to={{ pathname: '/monitor' }}>
              异常值监控
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', margin: 0 }}>
          <Row>
            <Col span={8}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => { setCollapsed(!collapsed); },
              })}
            </Col>
            <Col span={8}>
              <Row justify='center'>
                <h2>知识库系统</h2>
              </Row>
            </Col>
          </Row>
        </Header>
        <Content style={{ minHeight: 720, background: '#fff', margin: 15 }}>
          <br />
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;


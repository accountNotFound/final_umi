import {
  Tabs, Spin
} from 'antd';
import { useState } from 'react';
import SourceGraph from './components/SourceGraph';
import KnowledgeGraph from './components/KnowledgeGraph';

const { TabPane } = Tabs;

function Overiew() {
  const [currentTab, setCurrentTab] = useState('source');

  const handleChange = activeKey => {
    setCurrentTab(activeKey);
    console.log(activeKey);
  };

  return (
    <>
      <Tabs
        type='card'
        defaultActiveKey={currentTab}
        onChange={handleChange}
        centered
      >
        <TabPane tab='资料图谱' key='source'>
          <SourceGraph />
        </TabPane>
        <TabPane tab='知识图谱' key='knowledge' >
          <KnowledgeGraph />
        </TabPane>
      </Tabs>
    </>

  );
};

export default Overiew;

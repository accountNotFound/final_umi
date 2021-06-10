import React from 'react';
import { Tree } from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';

const TreeDetail = () => {

  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      icon: <CarryOutOutlined />,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              icon: <CarryOutOutlined />,
            },
            {
              title: (
                <>
                  <div>multiple line title</div>
                  <div>multiple line title</div>
                </>
              ),
              key: '0-0-0-1',
              icon: <CarryOutOutlined />,
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
              icon: <CarryOutOutlined />,
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
              icon: <CarryOutOutlined />,
              switcherIcon: <FormOutlined />,
            },
          ],
        },
      ],
    },
    {
      title: 'parent 2',
      key: '0-1',
      icon: <CarryOutOutlined />,
      children: [
        {
          title: 'parent 2-0',
          key: '0-1-0',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'leaf',
              key: '0-1-0-0',
              icon: <CarryOutOutlined />,
            },
            {
              title: 'leaf',
              key: '0-1-0-1',
              icon: <CarryOutOutlined />,
            },
          ],
        },
      ],
    },
  ];

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <div>
      <Tree
        showLine={true}
        showIcon={false}
        showLeafIcon={true}
        defaultExpandedKeys={['0-0-0']}
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
};

export default TreeDetail;
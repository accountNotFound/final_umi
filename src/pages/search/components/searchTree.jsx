import { useEffect, useState } from 'react';
import { Tree, Row, Spin, message, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getTreeDoc } from '../../../service/search';

function SearchTree(props) {
  const { currentID, sourceType } = props;
  const [title, setTitle] = useState(props.title);
  const [metaID] = useState(currentID.split('@')[0]);
  const [rootPath, setRootPath] = useState(currentID.split('@')[1]?.split('-') || []);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildTree = data => {
    let i = 0;
    const dfs = () => {
      let res = [];
      while (i < data.length) {
        const last = res.length - 1;
        const d1 = data[i].id.split('-').length;
        const d2 = last >= 0 ? res[last].key.split('-').length : d1;
        if (d1 === d2) {
          res.push({
            key: data[i].id,
            title: data[i].id === currentID
              ? (
                <mark style={{ background: '#58D3F7' }}>
                  {data[i].text}
                </mark>
              )
              : data[i].text
          });
          i++;
        } else if (d1 > d2) {
          res[res.length - 1].children = [...dfs()];
        } else {
          break;
        }
      }
      return res;
    }
    return dfs();
  };

  useEffect(() => {
    setLoading(true);
    const prefix = `${metaID}@${rootPath.join('-')}`;
    getTreeDoc(sourceType, prefix).then(res => {
      if (res.code === 0) {
        const treeData_ = buildTree(res.data.tree);
        setTreeData([...treeData_]);
        if (title === null) {
          setTitle(res.data.title);
        }
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  }, [buildTree, metaID, rootPath, sourceType, title]);

  const handleClick = () => {
    if (rootPath.length >= 1) {
      setRootPath([...rootPath.slice(0, -1)]);
    }
  };

  return (
    <Row justify='center'>
      {
        loading
          ? <Spin />
          :
          <div style={{ minWidth: 600, maxWidth: 600 }}>
            <Row justify='center'>
              <h2>{title}</h2>
            </Row>
            {
              rootPath.length > 1 || rootPath.length == 1 && rootPath[0] !== ''
                ?
                <Button type='link' onClick={handleClick}>展开父节点</Button>
                : <></>
            }
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              treeData={treeData}
              defaultExpandedKeys={[currentID]}
            />
          </div>
      }
    </Row>
  )
};

export default SearchTree;
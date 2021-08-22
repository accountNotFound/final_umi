import { useEffect, useState } from 'react';
import { Tree, Row, Spin, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getTreeDoc } from '../../../service/search';

function SearchDetail(props) {
  const { id: currentID, title, sourceType } = props.location.state;
  const [parentPath, setParentPath] = useState(currentID.split('-').slice(0, -1));
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildTree = (data) => {
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
    const rootID = parentPath.join('-');
    setLoading(true);
    getTreeDoc(sourceType, rootID).then(res => {
      if (res.code === 0) {
        const treeData_ = buildTree(res.data);
        setTreeData([...treeData_]);
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  }, [parentPath]);

  const handleClick = () => {
    if (parentPath.length > 1) {
      setParentPath([...parentPath.slice(0, -1)]);
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
              parentPath.length > 1
                ? <h4>
                  <a onClick={handleClick}>展开父节点</a>
                </h4>
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

export default SearchDetail;
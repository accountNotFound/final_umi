import {
  Row, Spin, Pagination, List, Empty, message
} from 'antd';
import Link from '../../../layouts/Link.jsx';
import { useEffect, useState } from 'react';
import { postAbsQueries } from '../../../service/search.jsx';

function SearchList(props) {
  const { formData } = props;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  const submitQuery = (value, page_from, page_size) => {
    const data = {
      ...value,
      page_from,
      page_size
    };
    setLoading(true);
    postAbsQueries(data).then(res => {
      if (res.code === 0) {
        setDataSource(res.data.items);
        setTotalSize(res.data.total_size);
        setCurrentPage(page_from);
        setPageSize(page_size);
        setLoading(false);
      } else {
        message.error(res.message);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (formData.query_str) {
      submitQuery(formData, currentPage, pageSize);
    }
  }, [currentPage, formData, pageSize]);

  const handlePageChange = (currentPage, pageSize) => {
    if (formData.query_str) {
      submitQuery(formData, currentPage, pageSize);
    }
  };

  const markHtml = text => {
    const keys = formData.query_str.split(' ');
    keys.forEach(k => {
      text = text.replaceAll(k, `<mark style="background-color: #58D3F7">${k}</mark>`);
    });
    return text;
  };

  return (
    <Row justify='center'>
      {
        loading ?
          <Spin /> :
          dataSource.length === 0 ?
            <Empty /> :
            <>
              <List
                style={{ minHeight: 350, minWidth: 1000 }}
                itemLayout='horizontal'
                dataSource={dataSource}
                renderItem={item => (
                  <List.Item
                    actions={
                      [
                        <Link
                          to={{
                            pathname: `/search/${item.id}`,
                            state: {
                              id: item.id,
                              title: item.title,
                              sourceType: formData.src_type
                            }
                          }}
                        >
                          详情
                        </Link>
                      ]
                    }
                  >
                    <List.Item.Meta
                      title={<p dangerouslySetInnerHTML={{ __html: markHtml(item.text) }} />}
                      description={item.title}
                    />
                  </List.Item>
                )}
              />
              <Pagination
                style={{ minWidth: 600 }}
                defaultCurrent={currentPage}
                defaultPageSize={pageSize}
                total={totalSize}
                showSizeChanger={true}
                showQuickJumper={true}
                onChange={handlePageChange}
              />
            </>
      }
    </Row>
  );
};

export default SearchList;
import React from 'react';
import { ProList } from '@ant-design/pro-components';
import { pageActDetail } from '@/services/miniprogram/activity';
import { Avatar } from 'antd';
import { HeartFilled } from '@ant-design/icons';

const JoinList = ({ activityId }: { activityId: number }) => {
  return (
    <ProList<API.ActivityProduct>
      metas={{
        title: {
          dataIndex: 'nickname',
        },
        subTitle: {
          dataIndex: 'productName',
        },
        description: {
          dataIndex: 'details',
          width: '80%',
        },
        avatar: {
          dataIndex: 'avatarUrl',
          render: (_, record) => <Avatar src={record?.avatarUrl} />,
        },
        extra: {
          dataIndex: 'starter',
          render: (_) => (
            <div style={{ marginLeft: 10 }}>
              <HeartFilled style={{ color: '#ff6a5f' }} /> {_}
            </div>
          ),
        },
      }}
      params={{ type: 1 }}
      request={async (params) => {
        const { data } = await pageActDetail({ ...params, activityId });

        return { data: data?.records || [], total: data?.total || [], success: true };
      }}
    />
  );
};

export default JoinList;

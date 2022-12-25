import { pageUserInfo, updateUser } from '@/services/miniprogram/users';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * @fields  需要更新状态的用户
 */
const handleRemove = async (field: API.AppletUser) => {
  const hide = message.loading('正在更新');
  try {
    await updateUser({ ...field });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败, 请稍后重试');
    return false;
  }
};

const MemberList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AppletUser>();
  // const [selectedRowsState, setSelectedRows] = useState<API.AppletUser[]>([]);

  const columns: ProColumns<API.AppletUser>[] = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '积分',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      render: (val) => <>{val}积分</>,
    },
    {
      title: '会员等级',
      dataIndex: 'level',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: {
          text: '女',
          status: 'Default',
        },
        1: {
          text: '男',
          status: 'Processing',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Default',
        },
        1: {
          text: '有效',
          status: 'Processing',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <TableDropdown
          key="actionGroup"
          onSelect={async () => {
            const success = await handleRemove({ ...record, state: record.state === 1 ? 0 : 1 });
            if (success) {
              actionRef.current?.reload();
            }
          }}
          menus={
            record.state === 1 ? [{ key: 'delete', name: '禁用' }] : [{ key: 'able', name: '启用' }]
          }
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AppletUser, API.PageParams>
        headerTitle="会员"
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { data } = await pageUserInfo(params);
          console.log(data);
          return { data: data?.records || 0, success: true, total: data?.totle || 0 };
        }}
        columns={columns}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.AppletUser>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AppletUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MemberList;

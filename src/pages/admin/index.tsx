import { pageUsers, updateUser } from '@/services/miniprogram/manageUser';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * @zh-CN 开启/禁用节点
 * @param API.ManageUser
 */
const handleRemove = async (fields: API.ManageUser) => {
  const hide = message.loading(`${fields.state === 1 ? '开启' : '禁用'}中`);
  if (!fields) return true;
  try {
    await updateUser({ ...fields });
    hide();
    message.success(`${fields.state === 1 ? '开启' : '禁用'}成功`);
    return true;
  } catch (error) {
    hide();
    message.error(`${fields.state === 1 ? '开启' : '禁用'}失败, 请稍后重试`);
    return false;
  }
};

const AdminList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ManageUser>();
  const columns: ProColumns<API.ManageUser>[] = [
    {
      title: '手机号(账号)',
      dataIndex: 'phone',
      formItemProps: {
        rules: [
          { required: true, message: '手机号为必填项' },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！',
          },
        ],
      },
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
      title: '登录密码',
      dataIndex: 'pwd',
      hideInSearch: true,
      hideInSetting: true,
      hideInDescriptions: true,
      hideInTable: true,
      valueType: 'password',
      formItemProps: {
        rules: [{ required: true, message: '密码为必填项' }],
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInForm: true,
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
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleModalOpen(true);
          }}
        >
          编辑
        </a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: 'delete',
              name: record.state === 1 ? '禁用' : '开启',
              onClick: async () => {
                const success = await handleRemove({
                  ...record,
                  state: record.state === 1 ? 0 : 1,
                });
                if (success) {
                  actionRef.current?.reload();
                }
              },
            },
          ]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ManageUser, API.PageParams>
        headerTitle="列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await pageUsers(params);
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        pagination={{ defaultPageSize: 10 }}
        columns={columns}
      />
      <EditModal<API.ManageUser>
        title={`${currentRow ? `编辑` : `新建`} 管理员`}
        width={400}
        open={createModalOpen}
        onFinish={(success: boolean) => {
          if (success) {
            actionRef.current?.reload();
            handleModalOpen(false);
          }
        }}
        onOpenChange={(open) => {
          handleModalOpen(open);
          if (!open) {
            setCurrentRow(undefined);
          }
        }}
        current={currentRow}
        columns={columns as ProFormColumnsType<API.ManageUser>[]}
      />
      <Drawer
        width={400}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.ManageUser>
            column={1}
            title="管理员详情"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.ManageUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AdminList;

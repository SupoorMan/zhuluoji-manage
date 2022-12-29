import { listConfigInfo, deleteConfigInfo } from '@/services/miniprogram/setting';
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
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (fields: API.ConfigInfo) => {
  const hide = message.loading('正在删除');
  if (!fields) return true;
  try {
    await deleteConfigInfo({ ...fields });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败, 请稍后重试');
    return false;
  }
};

const ConfigList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ConfigInfo>();
  const columns: ProColumns<API.ConfigInfo>[] = [
    {
      title: '名称',
      dataIndex: 'context',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
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
      title: 'key',
      dataIndex: 'key',
      formItemProps: {
        rules: [{ required: true, message: 'key为必填项' }],
      },
    },
    {
      title: 'value',
      dataIndex: 'value',
      formItemProps: {
        rules: [{ required: true, message: 'value为必填项' }],
      },
    },
    {
      title: '配置描述',
      dataIndex: 'details',
      valueType: 'textarea',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '配置描述为必填项' }],
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
          onSelect={async () => {
            const success = await handleRemove(record);
            if (success) {
              actionRef.current?.reload();
            }
          }}
          menus={[{ key: 'delete', name: '删除' }]}
        />,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ConfigInfo>
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
        request={async () => {
          const { data } = await listConfigInfo();
          return { data: (data as []) || [], success: true, total: data?.totle || 0 };
        }}
        pagination={false}
        columns={columns}
      />
      <EditModal<API.ConfigInfo>
        title={`${currentRow ? `编辑` : `新建`} 配置`}
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
        columns={columns as ProFormColumnsType<API.ConfigInfo>[]}
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
          <ProDescriptions<API.ConfigInfo>
            column={1}
            title="配置详情"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.ConfigInfo>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigList;

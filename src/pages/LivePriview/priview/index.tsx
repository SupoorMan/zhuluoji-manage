import { updateActivity, pageActivity, getActDetail } from '@/services/miniprogram/activity';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * @fields  需要更新状态的直播预告户
 */
const handleRemove = async (field: API.Activity) => {
  const hide = message.loading('正在更新');
  try {
    await updateActivity({ ...field });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败, 请稍后重试');
    return false;
  }
};

const ActivityList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Activity>();
  const columns: ProColumns<API.Activity>[] = [
    {
      title: '直播间',
      dataIndex: 'sources',
      width: 'md',
      formItemProps: {
        rules: [{ required: true, message: '直播间为必填项' }],
      },
      valueEnum: {
        0: {
          text: '酷酷的侏罗纪家居',
        },
        1: {
          text: '酷酷的侏罗纪家纺',
        },
      },
      render: (_, record) => (
        <Tag color={record.sources === 1 ? 'red' : 'blue'}>
          {['酷酷的侏罗纪家居', '酷酷的侏罗纪家纺'][record.sources!]}
        </Tag>
      ),
    },

    {
      title: '直播日期',
      dataIndex: 'days',
      valueType: 'date',
      formItemProps: {
        rules: [{ required: true, message: '直播日期为必填项' }],
      },
      width: 'md',
    },
    {
      title: '预约数',
      dataIndex: 'stater',
      valueType: 'digit',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            const { data } = await getActDetail({ activityId: record?.id });
            setCurrentRow({ ...record, list: data });
            handleModalOpen(true);
          }}
        >
          编辑
        </a>,
        <a
          key="show"
          onClick={async () => {
            const success = await handleRemove({ ...record, status: record.status === 1 ? 0 : 1 });
            if (success) {
              actionRef.current?.reload();
            }
          }}
        >
          {record.status === 1 ? '关闭' : '开启'}
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Activity>
        headerTitle="直播预告列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await pageActivity(params);
          return { data: data?.records || [], success: true, total: data?.total || 0 };
        }}
        pagination={false}
        columns={columns}
      />
      {createModalOpen && (
        <EditModal<API.Activity>
          title={`${currentRow ? `编辑` : `新建`} 直播预告`}
          width={700}
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
          columns={columns as ProFormColumnsType<API.Activity>[]}
        />
      )}
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
          <ProDescriptions<API.Activity>
            column={1}
            title="直播预告详情"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.Activity>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ActivityList;

import { pageLivePreview, updateLivePreview } from '@/services/miniprogram/livePreview';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Space, Tag, Image, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * @fields  需要更新状态的直播预告户
 */
const handleRemove = async (field: API.LivePreview) => {
  const hide = message.loading('正在更新');
  try {
    await updateLivePreview({ ...field });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败, 请稍后重试');
    return false;
  }
};

const LivePreviewList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LivePreview>();
  const columns: ProColumns<API.LivePreview>[] = [
    {
      title: '直播封面',
      dataIndex: 'images',
      valueType: 'image',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '直播封面为必填项' }],
      },
      render: (_, record) => <Image src={record.images} width={130} height={80} />,
    },
    {
      title: '主持人',
      dataIndex: 'hoster',
      formItemProps: {
        rules: [{ required: true, message: '主持人为必填项' }],
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
      title: '直播间类型',
      dataIndex: 'type',
      hideInTable: true,
      hideInDescriptions: true,
      formItemProps: {
        rules: [{ required: true, message: '直播间类型为必填项' }],
      },
      valueEnum: {
        0: {
          text: '汀戴家具',
          status: 'Default',
        },
        1: {
          text: '酷酷的侏罗纪',
          status: 'Processing',
        },
      },
    },
    {
      title: '直播链接',
      dataIndex: 'links',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '直播链接为必填项' }],
      },
      render: (_, record) => {
        return (
          <Space>
            {_}
            <Tag color={record.type === 1 ? 'red' : 'blue'}>
              {record?.type ? ['汀戴家具', '酷酷的侏罗纪'][record?.type] : '-'}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: '直播日期',
      dataIndex: 'dates',
      valueType: 'date',
      formItemProps: {
        rules: [{ required: true, message: '直播日期为必填项' }],
      },
      width: 'md',
    },
    {
      title: '直播时间',
      dataIndex: 'stamps',
      // hideInTable: true,
      hideInSearch: true,
      valueType: 'timeRange',
      formItemProps: {
        rules: [{ required: true, message: '直播时间为必填项' }],
      },
      render: (_, record) => record?.stamps,
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
        <a
          key="show"
          onClick={async () => {
            const success = await handleRemove({ ...record, status: record.status === 1 ? 0 : 1 });
            if (success) {
              actionRef.current?.reload();
            }
          }}
        >
          {record.status === 1 ? '关闭' : '展示'}
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.LivePreview>
        headerTitle="直播预告列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await pageLivePreview(params);
          return { data: data?.records || [], success: true, total: data?.totle || 0 };
        }}
        pagination={false}
        columns={columns}
      />
      {createModalOpen && (
        <EditModal<API.LivePreview>
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
          columns={columns as ProFormColumnsType<API.LivePreview>[]}
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
          <ProDescriptions<API.LivePreview>
            column={1}
            title="直播预告详情"
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.LivePreview>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default LivePreviewList;

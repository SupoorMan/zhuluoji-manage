import { listBanner, deleteBanner } from '@/services/miniprogram/banner';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message, Image } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * 禁用开启轮播
 * @param selectedRows
 */
const handleRemove = async (fields: API.Banner) => {
  const hide = message.loading(`删除中`);
  if (!fields) return true;
  try {
    await deleteBanner({ ...fields });
    hide();
    message.success(`删除成功`);
    return true;
  } catch (error) {
    hide();
    message.error(`删除失败, 请稍后重试`);
    return false;
  }
};

const ConfigList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); // 新建窗口的弹窗
  const [currentRow, setCurrentRow] = useState<API.Banner>();
  const columns: ProColumns<API.Banner>[] = [
    {
      title: '图片',
      dataIndex: 'url',
      valueType: 'image',
      hideInSearch: true,
      formItemProps: {
        rules: [{ required: true, message: '轮播图片为必填项' }],
      },
      render: (_, record) => <Image src={record.url} width={130} height={80} />,
    },
    {
      title: '链接',
      dataIndex: 'links',
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      // hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '首页' },
        1: { text: '直播预告' },
      },
    },
    {
      title: '排序',
      dataIndex: 'sorts',
      valueType: 'digit',
      hideInSearch: true,
      fieldProps: {
        style: {
          width: '200px',
        },
      },
      formItemProps: {
        rules: [{ required: true, message: '排序为必填项' }],
      },
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
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
            setShowDetail(true);
          }}
        >
          查看
        </a>,
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
      <ProTable<API.Banner>
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
          const { data } = await listBanner();
          return { data: (data as []) || [], success: true, total: data?.totle || 0 };
        }}
        pagination={false}
        columns={columns}
      />
      <EditModal<API.Banner>
        title={`${currentRow ? `编辑` : `新建`} 轮播`}
        width={720}
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
        columns={columns as ProFormColumnsType<API.Banner>[]}
      />
      <Drawer
        width={500}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.Banner>
            column={1}
            title="轮播详情"
            dataSource={currentRow}
            columns={columns.slice(0, columns.length - 1) as ProDescriptionsItemProps<API.Banner>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigList;

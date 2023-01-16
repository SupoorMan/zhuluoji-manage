import { pageActProd, deleteActProd } from '@/services/miniprogram/activityProduct';
import { listProdSpecs } from '@/services/miniprogram/prodSpces';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message, Image } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * @zh-CN 删除商品
 * @param selectedRows
 */
const handleRemove = async (field: API.ActivityProduct) => {
  const hide = message.loading('正在删除');
  try {
    await deleteActProd({ id: field.id! });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败, 请稍后重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false); //新建窗口的弹窗
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ActivityProduct>();

  const columns: ProColumns<API.ActivityProduct>[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
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
      formItemProps: {
        rules: [{ required: true, message: '商品名称为必填项' }],
      },
    },
    {
      title: '商品类型',
      dataIndex: 'topType',
      valueType: 'select',
      valueEnum: {
        0: '餐具摆件',
        1: '睡衣浴袍',
        2: '床品家纺',
        3: '生活日用',
      },
      formItemProps: {
        rules: [{ required: true, message: '商品类型为必填项' }],
      },
    },

    {
      title: '简介',
      dataIndex: 'details',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
    },
    {
      title: '商品图片',
      valueType: 'image',
      dataIndex: 'images',
      hideInSearch: true,
      hideInTable: true,
      width: 'md',
      formItemProps: {
        rules: [{ required: true, message: '商品图片为必填' }],
      },
      render: (_, record) => <Image src={record.images} width={100} height={80} />,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            const { data } = await listProdSpecs({ productId: record?.id, type: 1 });
            setShowDetail(false);
            handleModalOpen(true);
            setCurrentRow({ ...record, list: data || [] });
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={async () => {
            const success = await handleRemove(record);
            if (success) {
              actionRef.current?.reload();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ActivityProduct>
        headerTitle="直播商品管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        params={{ type: 0 }}
        request={async (params) => {
          const { data } = await pageActProd({ ...params });
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
      />
      <EditModal<API.ActivityProduct>
        title={`${currentRow ? `编辑` : `新建`} 商品`}
        width={700}
        open={createModalOpen}
        modalProps={{
          onCancel: () => handleModalOpen(false),
        }}
        onFinish={(success: boolean) => {
          if (success) {
            actionRef.current?.reload();
            handleModalOpen(false);
          }
        }}
        onOpenChange={(open) => {
          if (!open && currentRow) {
            setCurrentRow(undefined);
          }
        }}
        current={currentRow}
        columns={columns as ProFormColumnsType<API.ActivityProduct>[]}
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
        <ProDescriptions<API.ActivityProduct>
          column={1}
          dataSource={currentRow}
          columns={columns as ProDescriptionsItemProps<API.ActivityProduct>[]}
        />
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

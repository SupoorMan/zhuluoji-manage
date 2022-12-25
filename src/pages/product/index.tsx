import { deleteProd, getProds, upDownProducts } from '@/services/miniprogram/product';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import EditModal from './components/EditModal';

/**
 * @description 批量上下架商品
 * @ids 商品id数组
 * @upOrDown 上下架对应状态
 */
const handleUpdate = async (ids: number[], upOrDown: number) => {
  const hide = message.loading('更新中');
  try {
    await upDownProducts({ ids, shopping: upOrDown });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败, 请稍后重试!');
    return false;
  }
};

/**
 * @zh-CN 删除商品
 * @param selectedRows
 */
const handleRemove = async (field: API.IntegralProduct) => {
  const hide = message.loading('正在删除');
  try {
    await deleteProd(field);
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
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.IntegralProduct>();
  const [selectedRows, setSelectedRows] = useState<API.IntegralProduct[]>([]);

  const columns: ProColumns<API.IntegralProduct>[] = [
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
      dataIndex: 'productType',
      valueType: 'select',
      valueEnum: {
        // 0.玻璃餐具 1.睡衣浴袍 2.床上用品 3.家具装点
        0: '玻璃餐具',
        1: '睡衣浴袍',
        2: '床上用品',
        3: '家具装点',
      },
      formItemProps: {
        rules: [{ required: true, message: '商品类型为必填项' }],
      },
    },
    {
      title: '价值',
      dataIndex: 'integral',
      valueType: 'money',
      hideInSearch: true,
      fieldProps: {
        moneySymbol: false,
        style: { width: '240px' },
        addonAfter: '积分',
        precision: 0,
      },
      render: (_) => <>{_}积分</>,
      formItemProps: {
        rules: [{ required: true, message: '商品积分为必填项' }],
      },
    },
    {
      title: '星级',
      dataIndex: 'starter',
      valueType: 'rate',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'shopping',
      valueEnum: {
        0: {
          text: '下架',
          status: 'Default',
        },
        1: {
          text: '上架',
          status: 'Processing',
        },
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择上下架状态' }],
      },
    },
    {
      title: '标签',
      dataIndex: 'tagType',
      valueEnum: {
        0: {
          text: '新品',
          status: 'Success',
        },
        1: {
          text: '人气',
          status: 'Error',
        },
        2: {
          text: '无',
          status: 'Default',
        },
      },
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      valueType: 'switch',
      initialValue: 0,
      render: (_, record) => {
        return record.recommend === 1 ? <Tag color="green">推荐</Tag> : <Tag>不推荐</Tag>;
      },
    },
    {
      title: '更新时间',
      hideInForm: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
    },
    {
      title: '商品图片',
      valueType: 'image',
      dataIndex: 'productImage',
      hideInSearch: true,
      hideInTable: true,
      fieldProps: {
        width: 120,
      },
      formItemProps: {
        rules: [{ required: true, message: '至少有一张商品图片' }],
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleModalOpen(true);
            setShowDetail(false);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a key="subscribeAlert">配置图文详情</a>,
        <TableDropdown
          key="actionGroup"
          menus={[
            {
              key: 'change',
              name: record.shopping === 1 ? '下架' : '上架',
              onClick: async () => {
                await handleUpdate([record.id!], record.shopping === 1 ? 0 : 1);
                actionRef?.current?.reload();
              },
            },
            {
              key: 'delete',
              name: '删除',
              onClick: async () => {
                const success = await handleRemove(record);
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
    <PageContainer header={{ title: '' }}>
      <ProTable<API.IntegralProduct, API.PageParams>
        headerTitle="积分商品管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await getProds(params);
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <a
                onClick={() => {
                  handleUpdate(
                    selectedRows.map((n) => n.id!),
                    1,
                  );
                  actionRef?.current?.reload();
                  onCleanSelected();
                }}
              >
                批量上架
              </a>
              <a
                onClick={async () => {
                  await handleUpdate(
                    selectedRows.map((n) => n.id!),
                    0,
                  );
                  actionRef?.current?.reload();
                  onCleanSelected();
                }}
              >
                批量下架
              </a>
            </Space>
          );
        }}
      />

      <EditModal<API.IntegralProduct>
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
        columns={columns as ProFormColumnsType<API.IntegralProduct>[]}
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
        {currentRow?.productName && (
          <ProDescriptions<API.IntegralProduct>
            column={1}
            title={currentRow?.productName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.productName,
            }}
            columns={columns as ProDescriptionsItemProps<API.IntegralProduct>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

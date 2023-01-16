import {
  deleteProd,
  getProds,
  upDownProducts,
  updateProd,
  getProdDetail,
} from '@/services/miniprogram/product';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Card, Drawer, message, Space, Tag, Image } from 'antd';
import React, { useRef, useState } from 'react';
import RichEditor from './components/BraftEdit';
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
 * @description 更新商品信息
 * @field 商品信息
 * @details 商品图文详情
 */
const handleUpdateDetail = async (field: API.IntegralProduct, details: string) => {
  const hide = message.loading('更新中');
  try {
    await updateProd({ ...field, details });
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
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [newDetail, setNewDetail] = useState<string>('');
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
        // 0.餐具摆件 1.睡衣浴袍 2.床品家纺 3.生活日用
        0: '餐具摆件',
        // 1: '睡衣浴袍',
        2: '床品家纺',
        3: '生活日用',
      },
      formItemProps: {
        rules: [{ required: true, message: '商品类型为必填项' }],
      },
    },
    {
      title: '剩余数量',
      dataIndex: 'totals',
      valueType: 'digit',
      hideInSearch: true,
      width: 'md',
      formItemProps: {
        rules: [{ required: true, message: '剩余数量为必填项' }],
      },
      fieldProps: {
        precision: 0,
      },
    },

    {
      title: '限购数量 ',
      dataIndex: 'purchaseLimit',
      valueType: 'digit',
      render: (_) => <>每人限购{_}个</>,
      hideInSearch: true,
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      hideInTable: true,
      hideInForm: true,
      hideInDescriptions: true,
      valueEnum: {
        0: {
          text: '不推荐',
          status: 'Default',
        },
        1: {
          text: '推荐',
          status: 'Processing',
        },
      },
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      valueType: 'switch',
      hideInSearch: true,
      initialValue: 0,
      render: (_, record) => {
        return record.recommend === 1 ? <Tag color="green">推荐</Tag> : <Tag>不推荐</Tag>;
      },
    },
    {
      title: '上架状态',
      dataIndex: 'shopping',
      valueEnum: {
        1: {
          text: '上架',
          status: 'Processing',
        },
        0: {
          text: '下架',
          status: 'Default',
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
      width: 'md',
      formItemProps: {
        rules: [{ required: true, message: '至少有一张商品图片' }],
      },
      render: (_, record) => {
        const imags = record.productImage?.split(',');
        return (
          <Space>
            {imags?.map((n) => (
              <Image src={n} width={100} height={80} key={n} />
            ))}
          </Space>
        );
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
            const { data } = await getProdDetail({ productId: record.id, type: 0 });
            console.log(data);
            setCurrentRow(data);
            setShowDetail(false);
            handleModalOpen(true);
          }}
        >
          编辑
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          配置图文详情
        </a>,
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
    <PageContainer>
      <ProTable<API.IntegralProduct>
        headerTitle="积分商品管理"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await getProds({ ...params });
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
        width={'60%'}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {/* {currentRow?.productName && ( */}
        <Card type="inner" title="商品信息" style={{ marginBottom: 24 }}>
          <ProDescriptions<API.IntegralProduct>
            column={3}
            dataSource={currentRow}
            columns={
              [...columns].splice(
                0,
                columns.length - 1,
              ) as ProDescriptionsItemProps<API.IntegralProduct>[]
            }
          />
        </Card>
        {/* )} */}
        {/* {currentRow && ( */}
        <Card
          type="inner"
          title="图文详情"
          extra={
            <a
              onClick={async () => {
                if (!currentRow) return;
                const success = await handleUpdateDetail(currentRow, newDetail);
                if (success) {
                  actionRef.current?.reload();
                }
              }}
            >
              保存
            </a>
          }
          bodyStyle={{ padding: 0, height: 850 }}
        >
          {currentRow && <RichEditor detail={currentRow?.details || ''} onChange={setNewDetail} />}
        </Card>
        {/* )} */}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

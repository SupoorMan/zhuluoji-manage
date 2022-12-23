/* eslint-disable no-debugger */
import { addProd, deleteProd, getProds, updateProd } from '@/services/miniprogram/product';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  TableDropdown,
} from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';

// /**
//  * @en-US Add node
//  * @zh-CN 添加节点
//  * @param fields
//  */
// const handleAdd = async (fields: API.IntegralProduct) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addProd({ ...fields });
//     hide();
//     message.success('Added successfully');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Adding failed, please try again!');
//     return false;
//   }
// };

// /**
//  * @en-US Update node
//  * @zh-CN 更新节点
//  *
//  * @param fields
//  */
// const handleUpdate = async (fields: API.IntegralProduct) => {
//   const hide = message.loading('Configuring');
//   try {
//     await updateProd(fields);
//     hide();

//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };

// /**
//  *  Delete node
//  * @zh-CN 删除节点
//  *
//  * @param selectedRows
//  */
// const handleRemove = async (selectedRows: API.IntegralProduct[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await deleteProd(selectedRows);
//     hide();
//     message.success('删除成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败, 请稍后重试');
//     return false;
//   }
// };

const TableList: React.FC = () => {
  /**
   * @zh-CN 新建窗口的弹窗
   *  */
  // const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  // const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.IntegralProduct>();
  // const [selectedRowsState, setSelectedRows] = useState<API.IntegralProduct[]>([]);

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
    },
    {
      title: '商品类型',
      dataIndex: 'productType',
      valueType: 'select',
    },
    {
      title: '价值',
      dataIndex: 'integral',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      renderText: (val: string) => `${val} 积分`,
    },

    {
      title: '是否推荐',
      dataIndex: 'recommend',
      sorter: true,
      renderText: (val: string) => `${val}万`,
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
    },
    {
      title: '商品状态',
      dataIndex: 'state',
      valueEnum: {
        0: {
          text: '无效',
          status: 'Default',
        },
        1: {
          text: '有效',
          status: 'Processing',
        },
      },
    },
    {
      title: '标签',
      dataIndex: 'tagType',
      valueEnum: {
        0: {
          text: '新品',
          status: 'Default',
        },
        1: {
          text: '人气',
          status: 'Processing',
        },
      },
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder={'Please enter the reason for the exception!'} />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '简介',
      dataIndex: 'introduction',
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
            // handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a key="subscribeAlert">配置图文详情</a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => actionRef?.current?.reload()}
          menus={[
            { key: 'copy', name: '上架' },
            { key: 'delete', name: '删除' },
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
        rowKey="key"
        // search={{
        //   labelWidth: 120,
        // }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data } = await getProds(params);
          console.log(data);
          return { data: data?.list || 0, success: true, total: data?.totle || 0 };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />

      {/* <ModalForm
        title="创建商品"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.IntegralProduct);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '商品名称',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      /> */}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.productName && (
          <ProDescriptions<API.IntegralProduct>
            column={2}
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

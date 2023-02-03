import { pageConvert, updateConvert } from '@/services/miniprogram/orderConvert';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer, InputNumber, message, Modal, Image, Input } from 'antd';
import React, { useRef, useState } from 'react';

/**@description 更新订单
 * @fields 订单信息
 */
const handleUpdate = async (fields: API.OrderConvert) => {
  const hide = message.loading('更新中');
  try {
    await updateConvert({ ...fields });
    hide();
    message.success('更新订单成功');
    return true;
  } catch (error) {
    hide();
    message.success('更新订单失败，请稍后重试');
    return false;
  }
};

const OrderList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [modalOpen, handleModalOpen] = useState<1 | 2 | 0>(0); //
  const [errorText, setError] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.OrderConvert>();
  const actionRef = useRef<ActionType>();
  const sendIntegral = useRef<any>();
  const resonText = useRef<any>();
  const columns: ProColumns<API.OrderConvert>[] = [
    {
      title: '订单平台',
      dataIndex: 'type',
      valueEnum: {
        4: {
          text: '其他',
          status: 'Default',
        },
        0: {
          text: '微信',
          status: 'Success',
        },
        1: {
          text: '淘宝',
          status: 'Warning',
        },
        2: {
          text: '小红书',
          status: 'Error',
        },
        3: {
          text: '抖音',
          status: 'Processing',
        },
      },
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
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
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '待审核',
          status: 'Processing',
        },
        1: {
          text: '通过',
          status: 'success',
        },
        2: {
          text: '未通过',
          status: 'warning',
        },
      },
    },
    {
      title: '消费金额',
      dataIndex: 'costs',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '审核备注',
      dataIndex: 'remark',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '订单图片',
      dataIndex: 'images',
      valueType: 'image',
      hideInSearch: true,
      hideInTable: true,
      render: (_, record) =>
        record.images ? <Image src={record.images} width={80} height={130} /> : '-',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => {
        return record.status === 0
          ? [
              <a
                key="config"
                onClick={() => {
                  setCurrentRow(record);
                  handleModalOpen(1);
                }}
              >
                通过
              </a>,
              <a
                key="nopass"
                onClick={async () => {
                  setCurrentRow(record);
                  handleModalOpen(2);
                }}
              >
                不通过
              </a>,
            ]
          : '';
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.OrderConvert>
        headerTitle="列表"
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { data } = await pageConvert(params);
          return { data: data?.records || 0, success: true, total: data?.total || 0 };
        }}
        pagination={{ defaultPageSize: 10 }}
        columns={columns}
      />
      <Modal
        width={360}
        destroyOnClose={true}
        title={modalOpen === 1 ? '请输入该订单消费金额' : '请输入不通过原因'}
        open={modalOpen !== 0}
        onOk={async () => {
          if (modalOpen === 2) {
            if (resonText && !resonText.current.resizableTextArea.textArea.value) {
              setError(true);
              return false;
            }
          } else {
            if (sendIntegral && !sendIntegral.current.value) {
              setError(true);
              return false;
            }
          }
          setError(false);
          const data =
            modalOpen === 1
              ? {
                  status: modalOpen,
                  costs: sendIntegral.current.value,
                  integral: Math.floor(sendIntegral.current.value),
                  remark: resonText.current.resizableTextArea.textArea.value || '通过',
                }
              : {
                  status: modalOpen,
                  remark: resonText.current.resizableTextArea.textArea.value,
                };
          await handleUpdate({
            ...currentRow,
            ...data,
          });
          actionRef.current?.reload();
          handleModalOpen(0);
        }}
        onCancel={() => {
          handleModalOpen(0);
          setError(false);
        }}
      >
        <>
          {errorText && (
            <div style={{ color: 'red' }}>
              {modalOpen === 2 ? `请输入不通过原因` : `请输入订单兑换积分`}
            </div>
          )}
          {modalOpen === 1 && (
            <>
              <InputNumber
                ref={sendIntegral}
                style={{ marginTop: 8, marginBottom: 16, width: 200 }}
                placeholder="订单消费金额"
              />
              <br />
            </>
          )}
          <Input.TextArea
            ref={resonText}
            style={{ marginTop: 8, marginBottom: 16, width: 300 }}
            placeholder={modalOpen === 1 ? '审核备注' : '拒绝原因'}
          />
        </>
      </Modal>
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
          <ProDescriptions<API.OrderConvert>
            column={1}
            title={'订单详情'}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={
              columns.slice(0, columns.length - 1) as ProDescriptionsItemProps<API.OrderConvert>[]
            }
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OrderList;

import React, { useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { message, Space } from 'antd';
import { addActivity, updateActivity } from '@/services/miniprogram/activity';
import { pageActProd } from '@/services/miniprogram/activityProduct';
import { listProdSpecs } from '@/services/miniprogram/prodSpces';
import { TagsOutlined } from '@ant-design/icons';

interface Iprops<T> {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: T;
  columns: ProFormColumnsType<T>[];
  [key: string]: any;
}
/**
 * @param fields 用户信息
 */
const handleSubmit = async (
  fields: API.Activity & { deleteList?: number[] },
  backFn: (arg: any) => Promise<API.CommonResult>,
) => {
  const hide = message.loading('正在' + (fields?.id ? '添加' : '更新'));
  try {
    const { code } = await backFn({ ...fields });
    hide();
    if (code === 200) {
      message.success(fields?.id ? '更新成功' : '添加成功');
      return true;
    } else {
      throw Error('失败');
    }
  } catch (error) {
    hide();
    message.error((fields?.id ? '添加' : '更新') + '失败, 请稍后重试!');
    return false;
  }
};

/*
  编辑
*/
const CreateTeamModal = <T extends API.Activity>(props: Iprops<T>) => {
  const { title, current, onOpenChange, columns, onFinish, ...otherConfig } = props;
  const formRef = useRef<ProFormInstance>();
  const [prods, setProds] = useState<API.ActivityProduct[]>();
  const [deletids, setDeletids] = useState<number[]>([]);
  /**
   * @name proColumns 商品信息Columns
   *
   */
  const proColumns: ProFormColumnsType<API.ActivityDetail> = {
    title: (
      <Space>
        <TagsOutlined style={{ color: '#5a54f9' }} /> <strong>直播商品</strong>{' '}
      </Space>
    ),
    valueType: 'formList',
    dataIndex: 'list',
    colProps: { md: 24 },
    initialValue: [{ name: '' }],
    fieldProps: {
      copyIconProps: false,
      creatorButtonProps: {},
      itemRender: ({ listDom, action }: any, { record }: any) => {
        return (
          <Space align="start">
            {listDom}
            <a
              onClick={() => {
                if (record.id) {
                  setDeletids([...deletids, record.id]);
                }
              }}
            >
              {action}
            </a>
          </Space>
        );
      },
    },
    rowProps: { gutter: [24, 24] },
    columns: [
      {
        valueType: 'group',
        width: 'md',
        colProps: { md: 24 },
        rowProps: { gutter: [24, 0] },
        columns: [
          {
            dataIndex: 'activityProductId',
            valueType: 'select',
            formItemProps: {
              rules: [{ required: true, message: '请选择直播商品' }],
            },
            fieldProps: {
              showSearch: true,
              placeholder: '请输入商品名称搜索直播商品库',
              fieldNames: {
                label: 'productName',
                value: 'id',
              },
              onSearch: async (value?: string) => {
                const result = await pageActProd({
                  productName: value,
                  type: 0,
                  pageSize: 30,
                  current: 1,
                });
                setProds(result.data?.records);
                return result.data?.records;
              },
              options: prods,
            },
            colProps: { span: 12 },
          },
          {
            colProps: { span: 12 },
            width: 'md',
            dataIndex: 'stamps',
            valueType: 'timeRange',
            formItemProps: {
              rules: [{ required: true, message: '请选择直播时间段' }],
            },
            fieldProps: {
              placeholder: ['直播开始时间', '直播结束时间'],
            },
          },
          {
            colProps: { span: 8 },
            valueType: 'dependency',
            name: ['activityProductId'],
            columns: ({ activityProductId }) => {
              // console.log('shangping', activityProductId);
              return activityProductId
                ? [
                    {
                      width: 'md',
                      dataIndex: 'activityGiftId',
                      colProps: { span: 8 },
                      fieldProps: {
                        labelInValue: true,
                        placeholder: '请选择规格',
                        fieldNames: {
                          label: 'sizes',
                          value: 'id',
                        },
                      },
                      params: { productId: activityProductId },
                      formItemProps: {
                        rules: [{ required: true, message: '请选择规格' }],
                      },
                      proFieldProps: {
                        request: async (params: any) => {
                          const result = await listProdSpecs({
                            ...params,
                            type: 1,
                          });
                          return result.data;
                        },
                      },
                    },
                  ]
                : [];
            },
          },
          {
            valueType: 'dependency',
            name: ['activityGiftId'],
            columns: ({ activityGiftId }) => {
              if (activityGiftId) {
                return [
                  {
                    colProps: { span: 8 },
                    width: 'md',
                    dataIndex: 'price',
                    valueType: 'money',
                    fieldProps: {
                      addonBefore: '原价',
                      disabled: true,
                      // placeholder: '到手价',
                    },
                    initialValue: activityGiftId?.price,
                  },
                  {
                    colProps: { span: 8 },
                    width: 'md',
                    dataIndex: 'lastPrice',
                    valueType: 'money',
                    formItemProps: {
                      rules: [{ required: true, message: '请输入直播价' }],
                    },
                    fieldProps: {
                      addonBefore: '直播价',
                      // placeholder: '直播价',
                    },
                  },
                ];
              }
              return [];
            },
          },
        ],
      },
    ],
  };
  return (
    <SchemaForm<T>
      formRef={formRef}
      title={title}
      onOpenChange={(open: boolean) => {
        onOpenChange(open);
        if (open) {
          if (current) {
            const newList: any[] = [];
            setProds(
              current.list?.reduce((p: API.ActivityProduct[], c) => {
                newList.push({ ...c, stamps: c?.stamps ? c?.stamps.split(',') : [] });
                if (p.length > 0 && p.find((m) => m.id === c.activityProductId)) {
                  return p;
                } else {
                  return [...p, { id: c.activityProductId, productName: c.productName }];
                }
              }, []),
            );
            formRef.current?.setFieldsValue({
              ...current,
              sources: `${current.sources}`,
              list: newList,
            });
          }
        } else {
          formRef.current?.resetFields();
        }
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        const newProds = values.list!.map((n: any) =>
          typeof n.activityGiftId === 'object'
            ? { ...n, activityGiftId: n.activityGiftId.id, stamps: n.stamps.toString() }
            : { ...n, stamps: n.stamps.toString() },
        );
        if (current) {
          onFinish(
            await handleSubmit(
              { ...current, ...values, list: newProds, deleteList: deletids },
              updateActivity,
            ),
          );
        } else {
          onFinish(
            await handleSubmit({ ...values, list: newProds, type: 0, status: 0 }, addActivity),
          );
        }
      }}
      columns={[...columns, proColumns] as any}
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;

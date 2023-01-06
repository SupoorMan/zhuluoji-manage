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
  fields: API.Activity,
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
    },
    columns: [
      {
        valueType: 'group',
        width: 'md',
        colProps: { md: 24 },
        rowProps: { gutter: [24, 24] },
        columns: [
          {
            dataIndex: 'activityProductId',
            valueType: 'select',
            fieldProps: {
              showSearch: true,
              placeholder: '请输入商品名称搜索直播商品库',
              fieldNames: {
                label: 'productName',
                value: 'id',
              },
              onSearch: async (value?: string) => {
                const result = await pageActProd({ productName: value, pageSize: 30, current: 1 });
                setProds(result.data?.records);
                return result.data?.records;
              },
              options: prods,
            },
            colProps: { span: 8 },
          },
          {
            colProps: { span: 8 },
            valueType: 'dependency',
            name: ['activityProductId'],
            columns: ({ activityProductId }) => {
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
                      proFieldProps: {
                        request: async () => {
                          const result = await listProdSpecs({ productId: activityProductId });
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
                    colProps: { span: 6 },
                    width: 'md',
                    dataIndex: 'price',
                    valueType: 'money',
                    fieldProps: {
                      placeholder: '到手价',
                    },
                    initialValue: activityGiftId?.price,
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
            setProds(
              current.list?.reduce((p: API.ActivityProduct[], c) => {
                if (p.length > 0 && p.find((m) => m.id === c.activityProductId)) {
                  return p;
                } else {
                  return [...p, { id: c.activityProductId, productName: c.productName }];
                }
              }, []),
            );
            formRef.current?.setFieldsValue({ ...current, sources: `${current.sources}` });
          }
        } else {
          formRef.current?.resetFields();
        }
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        const newProds = values.list!.map((n: any) =>
          typeof n.activityGiftId === 'object'
            ? { ...n, activityGiftId: n.activityGiftId.id }
            : { ...n },
        );
        if (current) {
          onFinish(await handleSubmit({ ...current, ...values, list: newProds }, updateActivity));
        } else {
          onFinish(
            await handleSubmit({ ...values, list: newProds, type: 0, status: 1 }, addActivity),
          );
        }
      }}
      columns={[...columns, proColumns] as any}
      {...otherConfig}
    />
  );
};

export default CreateTeamModal;

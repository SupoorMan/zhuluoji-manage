import React from 'react';
import type { ProFormColumnsType, ProFormLayoutType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';

interface indexType<T> {
  layoutType: ProFormLayoutType; //props
  open: boolean;
  columns: ProFormColumnsType<T>[];
  onFinish: (values: T) => void;
  [key: string]: any;
}
const Index = <T extends { [key: string]: any }>({
  layoutType,
  open,
  columns,
  onFinish,
  ...otherConfig
}: indexType<T>) => {
  const config = {
    layoutType,
    open,
    colProps: { span: 12 },
    rowProps: { gutter: [24, 0] },
    grid: layoutType !== 'LightFilter' && layoutType !== 'QueryFilter',
    onFinish: async (values: T) => onFinish(values),
    columns: (layoutType === 'StepsForm' ? [columns] : columns) as any,
    ...otherConfig,
  };
  return <BetaSchemaForm<T> {...config} />;
};

export default Index;

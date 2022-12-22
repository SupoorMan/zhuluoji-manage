// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增配置 配置信息需要前后端约定 POST /configInfo/add */
export async function addConfigInfo(body: API.ConfigInfo, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/configInfo/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除配置 POST /configInfo/delete */
export async function deleteConfigInfo(body: API.ConfigInfo, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/configInfo/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询指定配置 配置信息需要前后端约定 GET /configInfo/get */
export async function getConfig(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ConfigInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/configInfo/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询配置列表 GET /configInfo/list */
export async function listConfigInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ListConfigInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/configInfo/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新配置 配置信息需要前后端约定 POST /configInfo/update */
export async function updateConfigInfo(body: API.ConfigInfo, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/configInfo/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增积分商品 POST /product/add */
export async function addProd(body: API.IntegralProduct, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/product/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除积分商品 POST /product/delete */
export async function deleteProd(body: API.IntegralProduct, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/product/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 积分商品详情 详情查询 GET /product/get */
export async function getProdDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ProdDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/product/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 积分商品分页查询 分页查询 GET /product/page */
export async function getProds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.PageProdParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/product/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新积分商品 POST /product/update */
export async function updateProd(body: API.IntegralProduct, options?: { [key: string]: any }) {
  return request<API.CommonResult>('/product/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 批量更新积分商品[上下架] POST /product/updateProducts */
export async function upDownProducts(
  body: API.UpDownProductsParams,
  options?: { [key: string]: any },
) {
  return request<API.CommonResult>('/product/updateProducts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

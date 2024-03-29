﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '管理员',
    icon: 'crown',
    component: './admin',
    // access: 'canAdmin',
    // routes: [
    //   {
    //     path: '/admin',
    //     redirect: '/admin/sub-page',
    //   },
    //   {
    //     path: '/admin/sub-page',
    //     name: '列表',
    //     component: './Admin',
    //   },
    // ],
  },
  {
    name: '积分商品',
    icon: 'tags',
    path: '/product',
    component: './product',
  },
  {
    name: '商城订单',
    icon: 'profile',
    path: '/order',
    component: './order',
  },
  {
    name: '三方订单',
    icon: 'interaction',
    path: '/transferOrder',
    component: './transferOrder',
  },
  // {
  //   name: '售后',
  //   icon: 'ShoppingCart',
  //   path: '/salesAfter',
  //   component: './afterSales',
  // },

  {
    name: '轮播广告',
    icon: 'tool',
    path: '/banner',
    component: './banner',
  },
  {
    name: '直播',
    icon: 'videoCamera',
    path: '/live',
    routes: [
      {
        path: '/live',
        redirect: '/live/priview',
      },
      {
        path: '/live/priview',
        name: '直播预告',
        component: './LivePriview/priview',
      },
      {
        path: '/live/product',
        name: '直播商品',
        component: './LivePriview/product',
      },
    ],
  },
  {
    name: '配置',
    icon: 'setting',
    path: '/setting',
    access: 'canAdmin',
    component: './setting',
  },
  {
    name: '侏罗纪的家',
    icon: 'home',
    path: '/home',
    component: './home',
  },
  {
    name: '买家秀',
    icon: 'gift',
    path: '/buyerShow',
    component: './saleShow',
  },

  {
    name: '会员',
    icon: 'team',
    path: '/user/manage',
    component: './User/Searching',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];

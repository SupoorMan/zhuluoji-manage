import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import { PageContainer, PageLoading, Settings as LayoutSettings } from '@ant-design/pro-components';
// import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import React from 'react';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.AppletUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.AppletUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = localStorage.getItem('user');
      return msg ? JSON.parse(msg) : undefined;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    style: {
      height: '100vh',
    },
    token: {
      header: {
        colorBgHeader: '#fff',
        //   colorHeaderTitle: '#595959',
        //   colorTextMenu: '#dfdfdf',
        //   colorTextMenuSecondary: '#dfdfdf',
        //   colorTextMenuSelected: '#fff',
        //   colorBgMenuItemSelected: '#22272b',
        //   colorTextRightActionsItem: '#dfdfdf',
      },
      sider: {
        colorMenuBackground: '#fff',
        // colorMenuItemDivider: '#dfdfdf',
        // colorTextMenu: '#fff',
        colorTextMenuSelected: '#6662d9',
        colorBgMenuItemSelected: '#f3f0ff',
        colorBgMenuItemHover: '#f3f0ff',
        colorBgMenuItemCollapsedHover: '#f3f0ff',
      },
    },
    // layoutBgImgList: [
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
    //     left: 85,
    //     bottom: 100,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
    //     bottom: -68,
    //     right: -45,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
    //     bottom: 0,
    //     left: 0,
    //     width: '331px',
    //   },
    // ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          /> */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

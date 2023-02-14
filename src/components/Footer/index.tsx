import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '数筑云科技';
  const beianhao = '浙ICP备2020030617号-2';
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          title: (
            <>
              <img src="../beian_icon.png" alt="" style={{ verticalAlign: 'middle' }} /> 浙网公安备
              33010602012935号
            </>
          ),
          href: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602012935',
          blankTarget: true,
          key: '1',
        },
        {
          key: '2',
          title: beianhao,
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;

import Welcome from './overview/Welcome';
import Input from './form/Input';
import Breadcrumb from './breadcrumb/Breadcrumbs';
import InputNumber from './form/InputNumber';

export default [
  {
    title: '综述',
    parents: [
      {
        title: '欢迎页面',
        component: Welcome
      },
      {
        title: '欢迎页面111',
        component: Welcome
      },
      {
        title: '面包屑导航',
        component: Breadcrumb
      },
    ]
  },
  {
    title: '表单',
    parents: [
      {
        title: '输入框',
        component: Input
      },
      {
        title: 'InputNumber 数字输入框',
        component: InputNumber,
      }
    ]
  }
];

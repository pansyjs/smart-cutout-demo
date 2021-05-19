import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  dynamicImport: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true
  },
  webpack5: {}
})
import React from 'react';
import { Upload as AntUpload } from 'antd';
import { UploadProps as AntUploadProps } from 'antd/es/upload';
import InboxOutlined from '@ant-design/icons/InboxOutlined';

const { Dragger } = AntUpload;

interface UploadProps extends AntUploadProps {
  desc?: string;
}

export const Upload: React.FC<UploadProps> = ({ desc, ...rest }) => {
  return (
    <Dragger {...rest}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">单击或将文件拖到该区域以上传</p>
      <p className="ant-upload-hint">
        {desc}
      </p>
    </Dragger>
  )
}

Upload.defaultProps = {
  accept: '.png,.jpg,.jpeg',
  showUploadList: false,
  desc: '仅支持png、jpg、jpeg格式的文件'
}
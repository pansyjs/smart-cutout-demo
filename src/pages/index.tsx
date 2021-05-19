import { useState } from 'react';
import { 
  Button, 
  Image as AntImage, 
  Row, 
  Col, 
  Space 
} from 'antd';
import { UploadProps } from 'antd/es/upload';
import { Upload } from '@/components';
import { getImgInfo, ImageInfo } from '@/utils';

/**
 * 
 */
type Step = 'init' | 'upload' | 'cutout';

export default () => {
  const [step, setStep] = useState<Step>('init');
  const [imgInfo, setImgInfo] = useState<ImageInfo>({} as ImageInfo);
  const [resultBase64, setResultBase64] = useState<string>();

  const uploadProps: UploadProps = {
    beforeUpload: async (file) => {
      const info = await getImgInfo(file);
      setImgInfo(info);
      return false;
    }
  };

  const handleCutout = () => {
    if (!imgInfo.base64) return;
    const canvas = document.createElement('canvas');

    const width = imgInfo.width;
    const height = imgInfo.height;

    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(imgInfo.image, 0, 0);

      // 获取四个边角的色值
      let tl = Array.prototype.slice.call(ctx.getImageData(0, 0, 1, 1).data).join(',');
      let tr = Array.prototype.slice.call(ctx.getImageData(width - 1, 0, 1, 1).data).join(',');
      let br = Array.prototype.slice.call(ctx.getImageData(width - 1, height - 1, 1, 1).data).join(',');
      let bl = Array.prototype.slice.call(ctx.getImageData(0, height - 1, 1, 1).data).join(',');

      // 需要抠除的背景色
      const bg: number[] = tl.split(',').map(item => +item);

      // 获取所有像素点
      const imgDataUrl = ctx.getImageData(0, 0, width, height);
      const length = imgDataUrl.data.length;

      for (let i = 0; i < length; i += 4) {
        let r = imgDataUrl.data[i]
        let g = imgDataUrl.data[i + 1]
        let b = imgDataUrl.data[i + 2];

        const isBG = [r, g, b].every((item, index) => {
          return item >= bg[index] - 60 && item <= bg[index] + 60
        });

        if (isBG) {
          // imgDataUrl.data[i] = 255;
          // imgDataUrl.data[i + 1] = 20;
          // imgDataUrl.data[i + 2] = 147;
          imgDataUrl.data[i + 3] = 0;
        }
      }

      ctx.putImageData(imgDataUrl, 0, 0);

      setResultBase64(canvas.toDataURL('image/png'));

    }
  }

  // if (step === 'init') {
  //   return (
  //     <Upload {...uploadProps} />
  //   )
  // }

  return (
    <div>
      <Space>
        <Upload {...uploadProps} />
        <Button onClick={handleCutout}>一键抠图</Button>
      </Space>
      <Row gutter={16}>
        <Col span={12}>
          <AntImage style={{ height: 500 }} preview={false} src={imgInfo.base64} />
        </Col>
        <Col span={12}>
          <AntImage style={{ height: 500 }} preview={false} src={resultBase64} />
        </Col>
      </Row>
    </div>
  )
}
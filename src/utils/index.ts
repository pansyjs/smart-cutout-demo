export interface ImageInfo {
  image: HTMLImageElement;
  base64: string;
  width: number;
  height: number;
}

export function getImgInfoByUrl(url: string, type?: string): Promise<ImageInfo> {
  return new Promise(function (resolve) {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement('canvas'),
        width = img.width,
        height = img.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
      resolve({ 
        image: img,
        base64: canvas.toDataURL(type),
        width, 
        height
      });
    };
  });  
}

export function getImgInfo(url: string | File, type?: string): Promise<ImageInfo> {
  if (typeof url === 'string') {
    return getImgInfoByUrl(url, type);
  }

  return new Promise(function (resolve) {
    let imgUrl: string = '';
    const reader = new FileReader();
    reader.readAsDataURL(url);
    reader.onload = (evt) => {
      imgUrl = evt.target?.result as string;
      getImgInfoByUrl(imgUrl, type)
        .then(item => {
          resolve(item);
        })
    };
  })
}
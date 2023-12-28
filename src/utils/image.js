import html2canvas from "html2canvas";

export const saveImg = id => {
    // 想要保存的图片节点
    const dom = document.getElementById(id);
    // 创建一个新的canvas
    const Canvas = document.createElement("canvas");
    const width = document.body.offsetWidth; // 可见屏幕的宽
    const height = document.body.offsetHeight; // 可见屏幕的高
    const scale = window.devicePixelRatio; // 设备的devicePixelRatio
    // 将Canvas画布放大scale倍，然后放在小的屏幕里，解决模糊问题
    Canvas.width = width * scale;
    Canvas.height = height * scale;
    Canvas.getContext("2d").scale(scale, scale);
    html2canvas(dom, {
        canvas: Canvas,
        scale,
        useCORS: true,
        logging: true,
        width: width + "px",
        hegiht: height + "px"
    }).then(canvas => {
        const context = canvas.getContext("2d");
        // 关闭抗锯齿形
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        // canvas转化为图片
        const imgStr = canvas2ImageStr(canvas, canvas.width, canvas.height);
        const _image = new Image();
        _image.src = imgStr;
        _image.crossOrigin = "*";
        _image.onload = function () {
            const a = document.createElement("a");
            a.download = "qrcode"; // 设置a节点的download属性值
            a.href = imgStr; // 将图片的src赋值给a节点的href
            a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })); // 兼容火狐
        };
    });
};

export const canvas2ImageStr = (canvas, width, height) => {
    const retCanvas = document.createElement("canvas");
    const retCtx = retCanvas.getContext("2d");
    retCanvas.width = width;
    retCanvas.height = height;
    retCtx.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
    // const img = document.createElement("img");
    // img.src = retCanvas.toDataURL("image/jpeg"); // 可以根据需要更改格式
    return retCanvas.toDataURL("image/jpeg");
};

//data 图片数据 FileReader readAsDataURL方法得到的数据
export const compressImage = (file, quality = 0.8) => {
    if (!file) return;
    const { type, name } = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const canvas = document.createElement("canvas");
            const img = new Image();
            img.onload = function () {
                img.width *= quality;
                img.height *= quality;
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                // canvas清屏
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // 将图像绘制到canvas上
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // 必须等压缩完才读取canvas值，否则canvas内容是黑帆布
                canvas.toBlob(
                    blob => {
                        const newFile = new File([blob], name, { type });
                        resolve(newFile);
                    },
                    type,
                    quality
                );
            };
            img.onerror = reject;
            // 记住必须先绑定事件，才能设置src属性，否则img没有内容可以画到canvas
            img.src = reader.result;
        };
    });
};

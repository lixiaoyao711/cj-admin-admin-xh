// 导出页面为PDF格式
import html2canvas from 'html2canvas';
import JSPDF from 'jspdf';
import { formatDate } from '@/utils/common';
export default {
  install(Vue, options) {
    Vue.prototype.ExportSavePdf = function(
      htmlTitle,
      height = 220,
      width = 210,
      type = 'p',
      id = 'pdfCentent',
      currentTime = formatDate(Date.now())
    ) {
      console.log('height', height);
      console.log('width', width);
      console.log('id', id);
      let element = document.getElementById(id);
      // console.log(element.style);
      html2canvas(element, {
        logging: false,
        scale: 2,
      }).then(function(canvas) {
        // let pdf = new JSPDF('p', 'mm', 'a4'); // A4纸，纵向
        let pdf = new JSPDF(type, 'mm', [height, width]); // 高,宽
        let ctx = canvas.getContext('2d');
        // let a4w = 210;
        // let a4h = 297;
        let a4w = 190;
        let a4h = 297; // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        let imgHeight = Math.floor((a4h * canvas.width) / a4w); // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0;

        while (renderedHeight < canvas.height) {
          let page = document.createElement('canvas');
          page.width = canvas.width;
          page.height = Math.min(imgHeight, canvas.height - renderedHeight); // 可能内容不足一页

          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page
            .getContext('2d')
            .putImageData(
              ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)),
              0,
              0
            );
          pdf.addImage(
            page.toDataURL('image/jpeg', 1.0),
            'JPEG',
            10,
            10,
            a4w,
            Math.min(a4h, (a4w * page.height) / page.width)
          ); // 添加图像到页面，保留10mm边距

          renderedHeight += imgHeight;
          if (renderedHeight < canvas.height) {
            pdf.addPage();
          } // 如果后面还有内容，添加一个空页
          // delete page;
        }
        pdf.save(htmlTitle + currentTime);
      });
    };
  },
};

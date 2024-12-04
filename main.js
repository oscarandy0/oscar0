document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const compressionPanel = document.getElementById('compressionPanel');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 拖放处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = var(--primary-color);
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#dadada';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#dadada';
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    });

    // 点击上传
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // 质量滑块
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage(currentFile);
        }
    });

    function handleImageUpload(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        currentFile = file;
        compressionPanel.style.display = 'block';
        
        // 显示原图
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            compressImage(file);
        };
        reader.readAsDataURL(file);
    }

    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const quality = qualitySlider.value / 100;
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

                compressedImage.src = compressedDataUrl;
                
                // 计算压缩后大小
                const compressedBytes = Math.round((compressedDataUrl.length - 22) * 3 / 4);
                compressedSize.textContent = formatFileSize(compressedBytes);

                // 设置下载
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `compressed-${file.name}`;
                    link.href = compressedDataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 
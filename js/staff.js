let images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // 图片列表
let currentImage = 0;
let textContainer = document.querySelector('.text-container');
let scrollSpeed = 1; // 可以调整滚动速度
let scrollPosition = 0;

// 图片切换函数
function changeImage() {
    document.querySelector('.image-container').style.backgroundImage = `url(${images[currentImage]})`;
    currentImage = (currentImage + 1) % images.length;
    setTimeout(changeImage, 3000); // 每3秒更换一次图片
}

// 平滑滚动文字
function scrollText() {
    let maxScrollHeight = textContainer.scrollHeight - window.innerHeight;
    if (scrollPosition < maxScrollHeight) {
        scrollPosition += scrollSpeed;
        window.scrollTo(0, scrollPosition);
        requestAnimationFrame(scrollText);
    } else {
        scrollPosition = 0;
    }
}

// 启动动画
changeImage();
requestAnimationFrame(scrollText);

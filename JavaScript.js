// Initialize global variable for initial image. 
let initialImage = null;

function uploadImage() {
    // Draw initial image to canvas and show its size.
    initialImage = new SimpleImage(document.getElementById('image'));
    initialImage.drawTo(document.getElementById('canvas'));
}

function showImageSize(width, height) {
    // Show an image size.
    document.getElementById("size").innerHTML = `Size: ${width}px x ${height}px`;
}

function imageIsLoaded(image) {
    // Check if an image is loaded and display its size.
    if (image && image.complete()) {
        showImageSize(initialImage.getWidth(), initialImage.getHeight());
        return true;
    }
    window.alert('No image has been uploaded yet.');
    return false;
}

function resetImage() {
    // Draw initial image on canvas.
    if (imageIsLoaded(initialImage)) {
        initialImage.drawTo(document.getElementById('canvas'));
    }
}

function getAvg(pixel) {
    return (pixel.getRed()+pixel.getGreen()+pixel.getBlue()) / 3;
}

function setNewRGBl(pixel, avg, pixelR, pixelG, pixelB) {
    // Set new RGB to a pixel.
    pixel.setRed(calculateRGBForFilters(avg, pixelR));
    pixel.setGreen(calculateRGBForFilters(avg, pixelG));
    pixel.setBlue(calculateRGBForFilters(avg, pixelB));
}

function grayscaleFilter() {
    // Helper function for the doGray() function which contains filter algorithm.
    let grayscaleImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    for (let pixel of initialImage.values()) {
        let avg = getAvg(pixel);
        let targetPixel = grayscaleImage.getPixel(pixel.getX(), pixel.getY());
        setNewRGBl(targetPixel, avg, avg, avg, avg);
    }
    return grayscaleImage;
}

function doGray() {
    // Apply grayscale filter on an image and draw it on canvas.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = grayscaleFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function redFilter() {
    // Helper function for the doRed() function which contains filter algorithm.
    let redImage = new SimpleImage(initialImage.getWidth(), initialImage.getHeight());
    for (let pixel of initialImage.values()) {
        let avg = getAvg(pixel);
        let targetPixel = redImage.getPixel(pixel.getX(), pixel.getY());
        if (avg < 128) {
            setNewRGBl(targetPixel, avg, 2*avg, 0, 0);
        } else {
            setNewRGBl(targetPixel, avg, 255, 2*avg - 255, 2*avg - 255);
        }
    }
    return redImage;
}

function doRed() {
    // Apply red filter on an image and draw it on canvas.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = redFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

function calculateRGBForFilters(avg, color) {
   
    if (avg === color && (color === 0 || color === 255)) {
        return color;
    } else if (avg < 128) {
        return Math.round(color/127.5*avg);
    } else {
        return Math.round((2 - color/127.5)*avg + 2*color - 255);
    }
}
function blurFilter() {
    // Blur filter algorithm. 
    let intensity = document.getElementById('blur').value;
    let imageWidth = initialImage.getWidth();
    let imageHeight = initialImage.getHeight();
    let resultImage = new SimpleImage(imageWidth, imageHeight);
    const newRandomCoordinate = (currenCoordinate, intensity, maxValue) => {
        let blurValue = currenCoordinate + Math.floor(Math.random() * (2*intensity) - intensity);
        if (blurValue >= 0 && blurValue < maxValue) {
            return blurValue;
        } else {
            return blurValue < 0 ? 0 : maxValue - 1;
        }
    };
    for (let pixel of initialImage.values()) {
        let pixelX = pixel.getX();
        let pixelY = pixel.getY();
        if (Math.random() < 0.5) {
            resultImage.setPixel(pixelX, pixelY, pixel);
        } else {
            resultImage.setPixel(
                pixelX, pixelY,
                initialImage.getPixel(
                    newRandomCoordinate(pixelX, intensity, imageWidth),
                    newRandomCoordinate(pixelY, intensity, imageHeight)
                )
            );
        }

    }
    return resultImage;
}

function doBlur() {
    // Apply blur filer.
    if (!imageIsLoaded(initialImage)) {
        return null;
    }
    let resultImage = blurFilter();
    resultImage.drawTo(document.getElementById('canvas'));
}

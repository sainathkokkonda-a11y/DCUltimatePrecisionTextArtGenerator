const imageInput = document.getElementById('imageInput');
const customWidth = document.getElementById('customWidth');
const aspectStretch = document.getElementById('aspectStretch');
const brightness = document.getElementById('brightness');
const threshold = document.getElementById('threshold');
const invertMode = document.getElementById('invertMode');
const renderStyle = document.getElementById('renderStyle');
const customSymbol = document.getElementById('customSymbol');
const spaceType = document.getElementById('spaceType');
const artOutput = document.getElementById('artOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const copyTestBtn = document.getElementById('copyTestBtn');
const testerBox = document.getElementById('testerBox');
const testCopyMsg = document.getElementById('testCopyMsg');

let loadedImage = null;

copyTestBtn.addEventListener('click', () => {
  testerBox.select();
  document.execCommand('copy');
  testCopyMsg.textContent = 'Copied Test Line!';
  setTimeout(() => testCopyMsg.textContent = '', 2000);
});

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      loadedImage = new Image();
      loadedImage.onload = () => convertImage();
      loadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function convertImage() {
  if (!loadedImage) return;

  const sym = customSymbol.value || '.';
  const emptyChar = spaceType.value;
  const targetWidth = parseInt(customWidth.value) || 30;
  const stretchFactor = parseFloat(aspectStretch.value);
  const bVal = parseInt(brightness.value);
  
  const aspect = loadedImage.height / loadedImage.width;
  const targetHeight = Math.round(targetWidth * aspect * stretchFactor);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(loadedImage, 0, 0, targetWidth, targetHeight);
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;

  let result = '';
  const threshVal = parseInt(threshold.value);
  const isInverted = invertMode.value === 'invert';
  const isShading = renderStyle.value === 'shading';

  const shadeChars = [' ', '░', '▒', '▓', '█'];

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const i = (y * targetWidth + x) * 4;
      
      // Apply Brightness offset
      let r = Math.min(255, Math.max(0, imageData[i] + bVal));
      let g = Math.min(255, Math.max(0, imageData[i + 1] + bVal));
      let b = Math.min(255, Math.max(0, imageData[i + 2] + bVal));

      let calcBrightness = (0.299 * r + 0.587 * g + 0.114 * b);

      if (isShading) {
        let index = Math.floor((calcBrightness / 255) * (shadeChars.length - 1));
        if (isInverted) index = (shadeChars.length - 1) - index;
        result += shadeChars[index];
      } else {
        let showSymbol = calcBrightness < threshVal;
        if (isInverted) showSymbol = !showSymbol;
        result += showSymbol ? sym : emptyChar;
      }
    }
    result += '\n';
  }

  artOutput.value = result;
}

generateBtn.addEventListener('click', convertImage);
customWidth.addEventListener('input', convertImage);
aspectStretch.addEventListener('input', convertImage);
brightness.addEventListener('input', convertImage);
threshold.addEventListener('input', convertImage);
invertMode.addEventListener('change', convertImage);
renderStyle.addEventListener('change', convertImage);
customSymbol.addEventListener('input', convertImage);
spaceType.addEventListener('change', convertImage);

copyBtn.addEventListener('click', () => {
  if (!artOutput.value) return;
  artOutput.select();
  document.execCommand('copy');
  alert('Precision Art Copied to Clipboard!');
});

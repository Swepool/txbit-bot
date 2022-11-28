

const min = Math.min(...data)
const max = Math.max(...data)
let pixelPoints = prices
    .reverse()
    .map((number, index) => {
        return `${index * (576 / (prices.length - 1))},` + (((number - min) / (max - min)) * 260).toFixed()
    })
    .join(' ')


    <svg width="576px" height="260px" viewBox="0 0 576 260" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
    <linearGradient x1="50%" y1="0.792176573%" x2="50%" y2="100%" id="linearGradient---eqj2d9u3-1">
    <stop stopColor={color} stopOpacity="0.2" offset="0%"></stop>
<stop stopColor={color} stopOpacity="0" offset="100%"></stop>
</linearGradient>
</defs>
<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <g id="Artboard">
        <polyline id="line" stroke={color} strokeWidth="5" points={pixelPoints}></polyline>
        <polygon id="gradient" fill="url(#linearGradient---eqj2d9u3-1)" points={'0 260 ' + pixelPoints + ' 576 260'}></polygon>
    </g>
</g>
</svg>


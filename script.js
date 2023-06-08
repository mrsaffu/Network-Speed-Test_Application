// Loader slector
const loaderEl = document.getElementById('loader')
// button slector
const detectSpeedBtn = document.getElementById('detect-speed')
// bits text container slector
const bitsEl = document.getElementById('bits-speed')
// kbps text container slector
const kbpsEl = document.getElementById('kbps-speed')
// mbps text container slector
const mbpsEl = document.getElementById('mbps-speed')

// Source of an image to load to check the speed
let imageSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/132C_trans.gif/230px-132C_trans.gif?time="+ (new Date().getTime());

detectSpeedBtn.addEventListener('click', e => {
    // prevent default
    e.preventDefault
    var bits = 0;
    var kbps = 0;
    var mbps = 0;
    var starTime = 0;
    var endTime = 0;
    detectSpeedBtn.disabled = true
    loaderEl.style.display = `flex`

    var img = new Image()
    img.crossOrigin = ''
    var imgSize = 0;

    starTime = new Date().getTime();
    img.src = imageSrc

    img.onload = async ()=>{
        endTime = new Date().getTime()

        // Wait for the image link response and get image size
        await fetch(imageSrc)
        .then(response => {
            imgSize = response.headers.get("content-length")
            console.log(imgSize)
            var timeDiff = (endTime - starTime) / 1000;
            var loadedImgSizeInBits = imgSize * 8;
            bits = (loadedImgSizeInBits / timeDiff)
            kbps = (bits / 1024)
            mbps = (kbps / 1024)
            return
        })
        .then( () =>{
            var tmpBits = 0;
            var tmpKb = 0;
            var tmpMb = 0;
            // Animating the network result
            function animate(){
                if(tmpBits < bits || tmpKb < kbps || tmpMb < mbps){
                    bitsEl.innerText = tmpBits.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    kbpsEl.innerText = tmpKb.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    mbpsEl.innerText = tmpMb.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    tmpBits = tmpBits + (bits  / 20);
                    tmpKb = tmpKb + (kbps  / 20);
                    tmpMb = tmpMb + (mbps  / 20);
                    setTimeout(animate, 30)
                }else{
                    bitsEl.innerText = bits.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    kbpsEl.innerText = kbps.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    mbpsEl.innerText = mbps.toLocaleString('en-US',{style:'decimal', maximumFractionDigits:2})
                    detectSpeedBtn.disabled = false
                    detectSpeedBtn.innerText = `Re-Check Network Speed`
                    loaderEl.style.display = `none`
                }
            }
            animate()
        })
    }
})
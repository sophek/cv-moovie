const { MUTE, SKIP, BLUR } = {
    MUTE: "MUTE",
    SKIP: "SKIP",
    BLUR: "BLUR",
}
const video = document.querySelector("video")

const filters = [{ id: 1, start: 5, end: 8, type: "MUTE" }, { id: 2, start: 10, end: 15, type: "BLUR" }, { id: 3, start: 18, end: 20, type: "SKIP" }]

// Proxy is used to simulate a watch for reactivity
const targetObj = {};
const targetProxy = new Proxy(targetObj, {
    set: function (target, key, value) {
        target[key] = value;
        return true;
    }
});

// Set the counter to 0, this counter is used to keep track of the current filters start and end time
targetProxy.counter = 0

const inBetween = (x, min, max) => {
    // This checks if a number is between two numbers
    return { inRange: (x >= min && x <= max), amount: max - min };
}

const muteVideo = (video, seconds) => {
    if (!video) return
    video.muted = true
    setTimeout(() => {
        video.muted = false
    }, seconds * 1000)
}

const skipVideo = (video, seconds) => {
    if (!video) return
    video.currentTime = video.currentTime + seconds
    video.play()
}

const blurVideo = (video, seconds) => {
    if (!video) return
    video.style = 'filter: blur(1.5rem);'
    setTimeout(() => {
        video.style = ''
    }, seconds * 1000)
}

const applyFilters = (event, video, filters) => {
    if (!video) return
    let currentTc = +(event.target.currentTime)
    let filterObj = filters[targetProxy.counter]

    if (filterObj) {
        let rangeObj = inBetween(currentTc, filterObj.start, filterObj.end)
        if (rangeObj.inRange) {
            targetProxy.counter = targetProxy.counter + 1;

            console.log('mute', rangeObj.amount)
            switch (filterObj.type) {
                case MUTE:
                    muteVideo(video, rangeObj.amount)
                    break;
                case SKIP:
                    skipVideo(video, rangeObj.amount)
                    break;
                case BLUR:
                    blurVideo(video, rangeObj.amount)
                    break;

                default:
                    break;
            }
        }
        console.log(currentTc)
    }
}

const runVideoFilters = (video,filters) => {
    video.addEventListener('timeupdate', (event) => {
        applyFilters(event, video, filters)
    });
}




export {filters,runVideoFilters,applyFilters,blurVideo,muteVideo,skipVideo,MUTE,SKIP,BLUR,video}
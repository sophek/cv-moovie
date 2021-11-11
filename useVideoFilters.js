export default function useVideoFilters() {
  const { MUTE, SKIP, BLUR, ALT_RIGHT, ALT_LEFT, SHIFT_LEFT, SHIFT_RIGHT } = {
    MUTE: "MUTE",
    SKIP: "SKIP",
    BLUR: "BLUR",
    ALT_RIGHT: "AltRight",
    ALT_LEFT: "AltLeft",
    SHIFT_RIGHT: "ShiftRight",
    SHIFT_LEFT: "ShiftLeft",
  };

  const video = document.querySelector("video");

  let start;
  let end;
  let isBlur = false;

  const filters = [
    { id: 1, start: 5, end: 8, type: "MUTE" },
    { id: 2, start: 10, end: 15, type: "BLUR" },
    { id: 3, start: 18, end: 20, type: "SKIP" },
  ];

  // Proxy is used to simulate a watch for reactivity
  const targetObj = {};
  const targetProxy = new Proxy(targetObj, {
    set: function (target, key, value) {
      target[key] = value;
      return true;
    },
  });

  // Set the counter to 0, this counter is used to keep track of the current filters start and end time
  targetProxy.counter = 0;

  const inBetween = (x, min, max) => {
    // This checks if a number is between two numbers
    return { inRange: x >= min && x <= max, amount: max - min };
  };

  video.addEventListener("seeked", (event) => {
    console.log(
      "Video found the playback position it was looking for.",
      event.target.currentTime
    );
    let idx = findNearest(event.target.currentTime);
    console.log({ idx: idx });
  });

  const closestValue = (value, array = [{ start: 1, end: 2 }]) => {
    let result;
    let lastDelta;

    array
      .map((i) => i.start)
      .some((item) => {
        var delta = Math.abs(value - item);
        if (delta > lastDelta) {
          return true;
        }
        result = item;
        lastDelta = delta;
      });
    result < value ? array.map((j) => j.start).find((i) => i > result) : result;
    return Math.abs(result - value) <= 5 ? result : 0;
  };

  const findNearest = (curr) => {
    let spots = [];
    let idx;
    filters.forEach((filter) => {
      let spot = inBetween(curr, filter.start, filter.end).inRange;
      if (spot) {
        spots.push(filter);
      }
    });
    if (spots.length) {
      idx = filters.findIndex((item) => item.id === spots[0].id);
    }
    if (idx === undefined) {
      let index = closestValue(curr, filters)
      idx = filters.findIndex((item) => item.start === index);
    }

    return idx;
  };

  const muteVideo = (video, seconds) => {
    if (!video) return;
    video.muted = true;
    setTimeout(() => {
      video.muted = false;
    }, seconds * 1000);
  };

  const skipVideo = (video, seconds) => {
    if (!video) return;
    video.currentTime = video.currentTime + seconds;
    video.play();
  };

  const blurVideo = (video, seconds) => {
    if (!video) return;
    video.style = "filter: blur(1.5rem);";
    setTimeout(() => {
      video.style = "";
    }, seconds * 1000);
  };

  const applyFilters = (event, video, filters) => {
    if (!video) return;
    let currentTc = +event.target.currentTime;
    let filterObj = filters[targetProxy.counter];

    if (filterObj) {
      let rangeObj = inBetween(currentTc, filterObj.start, filterObj.end);
      if (rangeObj.inRange) {
        targetProxy.counter = targetProxy.counter + 1;

        console.log("mute", rangeObj.amount);
        switch (filterObj.type) {
          case MUTE:
            muteVideo(video, rangeObj.amount);
            break;
          case SKIP:
            skipVideo(video, rangeObj.amount);
            break;
          case BLUR:
            blurVideo(video, rangeObj.amount);
            break;

          default:
            break;
        }
      }
      console.log(currentTc, targetProxy.counter);
    }
  };

  const runVideoFilters = (video, filters) => {
    video.addEventListener("timeupdate", (event) => {
      applyFilters(event, video, filters);
    });
  };

  const runMoovie = (movie,filters) => {

    console.log(movie.currentTime)

    //movie.customEvents[index].to()
  }

  const clickEvent = () => {
    window.addEventListener("keydown", (evt) => {
      clickEventHandler(evt);
    });
  };

  const muteSoundAndAddToFilters = (video, filters) => {
    video.muted = true;
    isBlur = !isBlur;
    isBlur ? (start = video.currentTime) : (end = video.currentTime);
    if (start && end) {
      addFilterRow(filters, start, end, MUTE);
      start = null;
      end = null;
    }
  };

  const clickEventHandler = (evt) => {
    switch (evt.code) {
      case SHIFT_RIGHT:
        console.log("Add Skip scene");
        break;
      case SHIFT_LEFT:
        console.log("Add mute scene");
        muteSoundAndAddToFilters(video, filters);

        break;
      default:
        break;
    }
  };

  const getFilters = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/");
    const data = await response.json();
    return data;
  };

  const addFilterRow = (filters, start, end, type) => {
    filters.push({
      id: filters[filters.length - 1].id + 1,
      start: start,
      end: end,
      type: type,
    });
    console.log(filters);
  };

  const cloneVideoElement = (elementToClone,elementCloneTo) => {
        const clone = document.querySelector(elementCloneTo);
        const videoContainer = document.querySelector(elementToClone);
        if(!videoContainer) return

        const elementClone = videoContainer.cloneNode(true);

        if(elementClone){
          clone.appendChild(elementClone);
          return true
        }

        return false
  }

  const hideClonedElement = (clonedElement) => {
    const videoContainer = document.querySelector(clonedElement);
    videoContainer.style.display = "none";
  }

  clickEvent();

  return {
    getFilters,
    filters,
    runVideoFilters,
    applyFilters,
    blurVideo,
    muteVideo,
    skipVideo,
    MUTE,
    SKIP,
    BLUR,
    video,
    cloneVideoElement,
    hideClonedElement,
    runMoovie
  };
}

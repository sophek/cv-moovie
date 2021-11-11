import useVideoFilters from "./useVideoFilters.js";

const { filters } = useVideoFilters();

//runVideoFilters(video, filters)
const container = document.querySelector("#video-container");
const originalStyle = container.style.cssText;

const blurStyle = (isBlur) => {
  let defaultStyle = container.style.cssText;
  const blurStyle = "filter:blur(2em)";

  let blurCss = isBlur
    ? defaultStyle + blurStyle
    : defaultStyle.replace(blurStyle, "");
  container.style = blurCss;
};

const blur = (container, duration) => {
  blurStyle(true);
  setTimeout(() => {
    container.style = originalStyle;
    blurStyle(false);
  }, duration);
};

const skip = (movie, end) => {
  movie.currentTime = end;
};

const mute = (movie, duration) => {
  movie.muted = true;
  setTimeout(() => {
    movie.muted = false;
  }, duration);
};

const skipBlurMute = (start, end, type) => {
  const duration = (end - start) * 1000;

  if (type === "BLUR") {
    blur(container, duration);
  }

  if (type === "MUTE") {
    mute(movie, duration);
  }

  if (type === "SKIP") {
    skip(movie, end);
  }
};

let customFilters = filters.map((item) => {
  return {
    type: "function",
    to: (start, end, type) => skipBlurMute(item.start, item.end, item.type),
    starttime: item.start,
    endtime: item.end,
    content: "Skip Intro",
    position: "bottom-left",
    class: "my_class",
  };
});

var movie = new Moovie({
  selector: "#example",
  customEvents: customFilters,
  dimensions: {
    width: "100%",
  },
  config: {
    storage: {
      captionOffset: false,
      playrateSpeed: false,
      captionSize: false,
    },
    controls: {
      playtime: false,
      volume: false,
      subtitles: false,
      fullscreen: false,
      submenuCaptions: true,
      submenuOffset: true,
      allowLocalSubtitles: false,
    },
  },
  icons: {
    path: "https://raw.githubusercontent.com/BMSVieira/moovie.js/main/icons/",
  },
});

//runMoovie(movie, filters);

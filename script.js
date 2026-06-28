const featuredShot = document.querySelector("#featuredShot");
const thumbRow = document.querySelector(".thumb-row");
const mediaPrev = document.querySelector(".media-prev");
const mediaNext = document.querySelector(".media-next");
const mapImageButtons = document.querySelectorAll(".map-image-button");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxNote = document.querySelector("#lightboxNote");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const blankImage =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const tocLinks = document.querySelectorAll(".toc-link");
const observedSections = Array.from(tocLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const mapImageItems = Array.from(mapImageButtons).map((button) => {
  const image = button.querySelector("img");

  return {
    full: button.dataset.full,
    alt: image?.alt || "MECCHA CHAMELEON map reference",
    map: button.dataset.map || "Map reference",
    note: button.dataset.note || "",
  };
});
const stageItems = [
  ...Array.from(document.querySelectorAll(".thumb")).map((thumb) => {
    const image = thumb.querySelector("img");

    return {
      full: thumb.dataset.shot,
      thumb: image?.src || thumb.dataset.shot,
      alt: image?.alt || "MECCHA CHAMELEON screenshot",
    };
  }),
  ...mapImageItems.map((item) => ({
    full: item.full,
    thumb: item.full.replace("w=1200", "w=420"),
    alt: item.alt,
  })),
];
let activeMapImageIndex = 0;
let activeStageIndex = 0;

const renderStageThumbs = () => {
  thumbRow.textContent = "";

  stageItems.forEach((item, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.className = index === activeStageIndex ? "thumb active" : "thumb";
    button.type = "button";
    button.dataset.index = String(index);
    image.src = item.thumb;
    image.alt = item.alt;
    button.append(image);
    thumbRow.append(button);
  });
};

const showStageImage = (index) => {
  if (!stageItems.length) {
    return;
  }

  activeStageIndex = (index + stageItems.length) % stageItems.length;
  featuredShot.src = stageItems[activeStageIndex].full;
  featuredShot.alt = stageItems[activeStageIndex].alt;

  thumbRow.querySelectorAll(".thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === activeStageIndex);
  });
};

renderStageThumbs();

thumbRow.addEventListener("click", (event) => {
  const thumb = event.target.closest(".thumb");

  if (!thumb) {
    return;
  }

  showStageImage(Number(thumb.dataset.index));
});

mediaPrev.addEventListener("click", () => {
  showStageImage(activeStageIndex - 1);
});

mediaNext.addEventListener("click", () => {
  showStageImage(activeStageIndex + 1);
});

const showMapImage = (index) => {
  if (!mapImageItems.length) {
    return;
  }

  activeMapImageIndex =
    (index + mapImageItems.length) % mapImageItems.length;
  lightboxImage.src = mapImageItems[activeMapImageIndex].full;
  lightboxImage.alt = mapImageItems[activeMapImageIndex].alt;
  lightboxNote.textContent = `${mapImageItems[activeMapImageIndex].map}: ${mapImageItems[activeMapImageIndex].note}`;
};

mapImageButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showMapImage(index);
    imageLightbox.hidden = false;
  });
});

const closeLightbox = () => {
  imageLightbox.hidden = true;
  lightboxImage.src = blankImage;
  lightboxNote.textContent = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  showMapImage(activeMapImageIndex - 1);
});

lightboxNext.addEventListener("click", (event) => {
  event.stopPropagation();
  showMapImage(activeMapImageIndex + 1);
});

imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (imageLightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showMapImage(activeMapImageIndex - 1);
  } else if (event.key === "ArrowRight") {
    showMapImage(activeMapImageIndex + 1);
  }
});

const setActiveTocLink = (sectionId) => {
  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
  });
};

let tocTicking = false;

const updateTocFromScroll = () => {
  const marker = window.innerHeight * 0.38;
  const currentSection = observedSections.reduce((current, section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= marker ? section : current;
  }, observedSections[0]);

  if (currentSection) {
    setActiveTocLink(currentSection.id);
  }

  tocTicking = false;
};

window.addEventListener("scroll", () => {
  if (!tocTicking) {
    window.requestAnimationFrame(updateTocFromScroll);
    tocTicking = true;
  }
});

window.addEventListener("load", updateTocFromScroll);
updateTocFromScroll();

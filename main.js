// References to DOM Elements
const book = document.querySelector("#book");
const papers = document.querySelectorAll(".paper");
const PAGE79_INDEX = papers.length - 1;

let currentLocation = 1;
let numOfPapers = papers.length;
let maxLocation = numOfPapers + 1;

/* ⭐ 初始化每一頁疊放順序 */
papers.forEach((paper, index) => {
  paper.style.zIndex = numOfPapers - index;
});

function openBook() {
  book.style.setProperty("--book-translate", "50%");
}

function closeBook(isAtBeginning) {
  book.style.setProperty(
    "--book-translate",
    isAtBeginning ? "0%" : "100%"
  );
}

function goNextPage() {
  if (currentLocation < maxLocation) {
    if (currentLocation === 1) openBook();

    const index = currentLocation - 1;
    const paper = papers[index];

    paper.style.zIndex = numOfPapers + 1;
    paper.classList.add("flipped");

    setTimeout(() => {
      paper.style.zIndex = index + 1;
    }, 500);

    if (currentLocation === numOfPapers) {
      closeBook(false);
    }

    currentLocation++;
    setTimeout(updatePage79Hotspot, 520);
  }
}

function goPrevPage() {
  if (currentLocation > 1) {
    currentLocation--;

    if (currentLocation === 1) closeBook(true);

    const index = currentLocation - 1;
    const paper = papers[index];

    paper.style.zIndex = numOfPapers + 1;
    paper.classList.remove("flipped");

    setTimeout(() => {
      paper.style.zIndex = numOfPapers - index;
    }, 500);

    if (currentLocation === numOfPapers) {
      openBook();
    }
    setTimeout(updatePage79Hotspot, 520);
  }
}

/* ===== 翻頁提示 ===== */
const hint = document.getElementById("hint");
let hintUsed = false;

window.addEventListener("load", () => {
  hint?.classList.add("blink");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goNextPage();
  if (e.key === "ArrowRight") goPrevPage();

  if (!hintUsed && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    hintUsed = true;
    hint?.classList.remove("blink");
    hint?.remove();
  }
});

/* ===== 手機滑動翻頁（只在手機啟用） ===== */
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  book.addEventListener("touchstart", (e) => {
    // ⭐ 點在 hotspot 上就不要翻頁
    if (e.target.closest("#page79-gmail-hotspot, #page79-ig-hotspot")) return;

    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  book.addEventListener("touchend", (e) => {
    if (e.target.closest("#page79-gmail-hotspot, #page79-ig-hotspot")) return;

    touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    deltaX < 0 ? goNextPage() : goPrevPage();

    if (!hintUsed) {
      hintUsed = true;
      hint?.remove();
    }
  });
}


if (window.innerWidth < 768 && hint) {
  hint.textContent = "左右滑動翻頁";
}

const gmail79 = document.getElementById("page79-gmail-hotspot");
const ig79 = document.getElementById("page79-ig-hotspot");

function updatePage79Hotspot() {
  if (currentLocation - 1 === PAGE79_INDEX) {
    const rect = book.getBoundingClientRect();

    // Gmail
    gmail79.style.left   = rect.left + rect.width * 0.17 + "px";
    gmail79.style.top    = rect.top  + rect.height * 0.84 + "px";
    gmail79.style.width = rect.width * 0.30 + "px";
    gmail79.style.height= rect.height * 0.04 + "px";
    gmail79.style.display = "block";

    // IG
    ig79.style.left   = rect.left + rect.width * 0.75 + "px";
    ig79.style.top    = rect.top  + rect.height * 0.84 + "px";
    ig79.style.width = rect.width * 0.12 + "px";
    ig79.style.height= rect.height * 0.04 + "px";
    ig79.style.display = "block";

  } else {
    gmail79.style.display = "none";
    ig79.style.display = "none";
  }
}

gmail79.addEventListener("click", (e) => {
  e.stopPropagation();
  window.location.href = "mailto:catherinet515gc@gmail.com";
});

ig79.addEventListener("click", (e) => {
  e.stopPropagation();
  window.open(
    "https://www.instagram.com/_yun.pho?igsh=YzV4dG5qN21mcWtv&utm_source=qr/",
    "_blank"
  );
});


window.addEventListener("load", updatePage79Hotspot);
window.addEventListener("resize", updatePage79Hotspot);

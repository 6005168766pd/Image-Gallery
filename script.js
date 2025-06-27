const imagesWrapper = document.querySelector(".images");
const loadmorebtn = document.querySelector(".load-more");
const searchinput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox");
const closeBTn = lightBox.querySelector(".fa-xmark");
// const downloadbtn = lightBox.querySelector("fa-download");

const apiKey = "ncYHJG0VTD0ny8eSNGrzXj2QilCL2izLBIVJ9YWNjN0ml1JrFhc6lu19";
const perPage = 15;
let currentPage = 1;
let searchterm = null;

const downloadimg = (imgURL) => {
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
  }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  // downloadbtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

const hidelightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "none";
}


const generateHTML = (images) => {
  imagesWrapper.innerHTML += images.map(img =>
    `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
    <img src="${img.src.large2x}" alt="">
        <div class="details">
          <div class="photographer">
            <i class="fa-solid fa-camera-retro"></i>
            <span>${img.photographer}</span>
          </div>
          <button
          onclick="downloadimg('${img.src.large2x}');event.stopPropagation();"><i class="fa-solid fa-download"></i></button>
        </div>
      </li>`
  ).join("");
}
// Fetching Images by API call with authorization header
loadmorebtn.innerText = "Loading...";
loadmorebtn.classList.add("disabled");
const getImages = (apiURL) => {
  fetch(apiURL, {
    headers: { Authorization: apiKey }
  }).then(res => res.json()).then(data => {
    generateHTML(data.photos);
    loadmorebtn.innerText = "Load more ";
    loadmorebtn.classList.remove("disabled");
  }).catch(() => alert("Failed to load images!"));
}

const loadmoreimages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchterm ? `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
}

const loadsearchimages = (e) => {
  if (e.key === "Enter") {
    currentPage = 1;
    searchterm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPage}&per_page=${perPage}`);
  }
  if (e.target.value === "") return searchterm = null;
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadmorebtn.addEventListener("click", loadmoreimages);
searchinput.addEventListener("keyup", loadsearchimages);
closeBTn.addEventListener("click", hidelightbox);
// downloadbtn.addEventListener("click", (e) => downloadimg(e.target.dataset.img));
const mobileIcon = document.querySelector(".js-mobile-icon");
const shortenList = document.querySelector(".shorten-list");
const shortenForm = document.querySelector(".shorten-form");
let itemList = [];

mobileIcon.addEventListener("click", function () {
  this.closest(".mobile-menu").classList.toggle("active");
});

const fetchUrl = async function (val) {
  try {
    const data = await fetch(`https://api.shrtco.de/v2/shorten?url=${val}`);
    const response = await data.json();

    if (!response) return;

    const { original_link, short_link } = response.result;

    itemList.push({
      original_link,
      short_link,
    });

    reset();

    setLocalStorage();
  } catch (err) {
    console.error(err);
  }
};

const renderShortenLink = function (link) {
  let html = `
    <li class="shorten-item">
        <span class="real-link">${link.original_link}</span>
        <div class="shorten-item__flex">
          <span class="shorten-link">${link.short_link}</span>
          <button class="btn btn-copy" onClick="copyValue(this)">Copy</button>
        </div>
    </li>
`;

  shortenList.insertAdjacentHTML("afterbegin", html);
};

function setLocalStorage() {
  localStorage.setItem("list", JSON.stringify(itemList));
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("list"));

  if (!data) return;

  itemList = data;

  itemList.forEach((item) => {
    renderShortenLink(item);
  });
}

function reset() {
  localStorage.removeItem("list");
  location.reload();
}

function clear() {
  shortenForm.querySelector(".shorten-form__input").value = "";
}

function copyValue(element) {
  element.classList.add("copied");
  element.innerText = "Copied!";

  var copyText = element.previousElementSibling.innerText;
  navigator.clipboard.writeText(copyText);

  setTimeout(function () {
    element.classList.remove("copied");
    element.innerText = "Copy";
  }, 1000);
}

shortenForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let input = this.querySelector(".shorten-form__input");
  let linkValue = input.value;

  if (linkValue === "") this.classList.add("error");
  else this.classList.remove("error");

  fetchUrl(linkValue);
  clear();
});

function init() {
  getLocalStorage();
}

init();

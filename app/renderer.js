const linksSection = document.querySelector(".links");
const errorMessage = document.querySelector(".errorMessage");
const newLinkForm = document.querySelector(".newLinkForm");
const newLinkUrl = document.querySelector(".newLinkUrl");
const newLinkSubmit = document.querySelector(".newLinkSubmit");
const clearStorage = document.querySelector(".clearStorage");
const { shell } = require("electron");

const domParser = new DOMParser();

const parseResponse = (text) => {
	return domParser.parseFromString(text, "text/html");
};

const findTitle = (nodes) => {
	return nodes.querySelector("title").innerText;
};

const clearForm = () => {
	newLinkUrl.value = null;
};

const storeLink = (title, url) => {
	localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
};

const getLinks = () => {
	const localStorageData = localStorage;
	console.log(`localStorageData:${localStorageData}`);

	return Object.keys(localStorage).map((key) => JSON.parse(localStorage.getItem(key)));
};

const convertToElement = (link) => {
	return `<div class="link">
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}">${link.url}</a>
            </p>
            </div>`;
};

const renderLinks = () => {
	const linkElements = getLinks().map(convertToElement).join("");
	linksSection.innerHTML = linkElements;
};

//清除所有数据
const clearAll = () => {
	linksSection.innerHTML = "";
};

const handleError = (error, url) => {
	errorMessage.innerHTML = `
        There was an issue adding "${url}":${error.message} 
    `.trim();

	setTimeout(() => {
		errorMessage.innerText = null;
	}, 5000);
};

clearStorage.addEventListener("click", () => {
	localStorage.clear();
	clearAll();
});

//初始载入也显示
renderLinks();

const validateResponse = (response) => {
	if (response.ok) {
		return response;
	}

	throw new Error(`Status code of ${response.status} ${response.statusText}`);
};
newLinkForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const url = newLinkUrl.value;
	console.log(`input url is ${url}`);

	fetch(url)
		.then(validateResponse)
		.then((response) => response.text())
		.then(parseResponse)
		.then(findTitle)
		.then((title) => storeLink(title, url))
		.then(clearForm)
		//新增一个之后，也显示所有
		.then(renderLinks)
		.catch((error) => handleError(error, url));
});

newLinkUrl.addEventListener("keyup", () => {
	newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

//监听默认行为
linksSection.addEventListener("click", (event) => {
	if (event.target.href) {
		event.preventDefault();
		shell.openExternal(event.target.href);
	}
});

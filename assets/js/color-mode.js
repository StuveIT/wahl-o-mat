const colorModeLink = document.querySelector("#color-mode");

function toggleColorMode() {
  console.log(colorModeLink.getAttribute("href"), colorModeLink.getAttribute("href").endsWith("root.css"));
  if(colorModeLink.getAttribute("href").endsWith("root.css")) {
    localStorage.setItem("colorMode", "dark");
    colorModeLink.href = colorModeLink.href.replace("root.css", "root-dark.css");
  } else {
    localStorage.setItem("colorMode", "light");
    colorModeLink.href = colorModeLink.href.replace("root-dark.css", "root.css");
  }
}

if(localStorage.getItem("colorMode") === "dark") {
  colorModeLink.href = colorModeLink.href.replace("root.css", "root-dark.css");
} else {
  colorModeLink.href = colorModeLink.href.replace("root-dark.css", "root.css");
}
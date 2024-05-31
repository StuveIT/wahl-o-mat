const userCounter = document.querySelector(".userCounter");

function fetchUserCounter() {
  fetch("/api/usercount").then(response => response.json()).then(data => {
    const formattedCount = formatUserCounter(data.count);
    console.log(formattedCount);

    userCounter.innerHTML = formattedCount;
  });
}

function formatUserCounter(count) {
    // Add leading zeros, such that the count is always 4 digits long
    return count.toString().padStart(4, "0");
}

function incrementUserCounter() {
  fetch("/api/usercount", {
    method: "POST"
  }).then(response => response.json()).then(data => {
    const formattedCount = formatUserCounter(data.count);
    console.log(formattedCount);

    userCounter.innerHTML = formattedCount;
  });
}

fetchUserCounter();

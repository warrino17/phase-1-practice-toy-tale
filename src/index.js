document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  let addToy = false;

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyFormContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;
    postToyData(toyName, toyImage);
    e.target.reset();
  });

  toyCollection.addEventListener("click", (e) => {
    if (e.target.className === "like-btn") {
      const toyId = e.target.dataset.id;
      const likesCount = e.target.previousElementSibling.textContent;
      patchLikesCount(toyId, likesCount);
    }
  });

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        renderToy(toy);
      });
    });

  function renderToy(toy) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const toyName = document.createElement("h2");
    toyName.textContent = toy.name;

    const toyImage = document.createElement("img");
    toyImage.src = toy.image;
    toyImage.className = "toy-avatar";

    const toyLikes = document.createElement("p");
    toyLikes.textContent = `${toy.likes} Likes`;

    const toyLikeBtn = document.createElement("button");
    toyLikeBtn.className = "like-btn";
    toyLikeBtn.dataset.id = toy.id;
    toyLikeBtn.textContent = "Like ❤️";

    cardDiv.append(toyName, toyImage, toyLikes, toyLikeBtn);
    toyCollection.appendChild(cardDiv);
  }

  function postToyData(toyName, toyImage) {
    const formData = {
      name: toyName,
      image: toyImage,
      likes: 0,
    };

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    };

    fetch("http://localhost:3000/toys", configObj)
      .then((response) => response.json())
      .then((toy) => renderToy(toy))
      .catch((error) => console.log(error));
  }

  function patchLikesCount(toyId, likesCount) {
    const newLikesCount = parseInt(likesCount) + 1;
    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikesCount }),
    };

    fetch(`http://localhost:3000/toys/${toyId}`, configObj)
      .then((response) => response.json())
      .then((updatedToy) => {
        const toyCard = document.querySelector(`[data-id='${toyId}']`).parentElement;
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => console.log(error));
  }
});

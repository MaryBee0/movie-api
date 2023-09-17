// Modal Handling
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = (e) => {
  e.preventDefault();
  modal.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
};

btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Filter Population
const populateFilter = (selectId, dataKey) => {
  const selectElement = document.getElementById(selectId);

  fetch("http://localhost:7878/api/movies")
    .then((response) => response.json())
    .then((result) => {
      selectElement.innerHTML = `<option value="all" class="movie__form__option smalltext">Select a ${dataKey}</option>`;

      const uniqueItems = new Set();
      result.movies.forEach((item) => {
        if (Array.isArray(item[dataKey])) {
          item[dataKey].forEach((value) => {
            uniqueItems.add(value);
          });
        }
      });

      uniqueItems.forEach((item) => {
        selectElement.insertAdjacentHTML(
          "beforeend",
          `<option value="${item}" class="movie__form__option smalltext">${item}</option>`
        );
      });
    })
    .catch((error) => console.log(`Error ${dataKey}: `, error));
};

populateFilter("title", "title");
populateFilter("genres", "genres");

// Movie Cards
const createMovieCard = (movie) => {
  return `
    <div class="col-4">
      <div class="movie__cards">
        <div class="movie__cards__description">
          <h5 class="mediumtext">${movie.title}</h5>
          <p class="smalltext">${movie.releaseDate}</p>
          <a href="${movie.trailerLink}" target="_blank">See the trailer</a>
        </div>
        <div class="movie__cards__poster">
          <img class="movie__cards__poster__img" src="${movie.posterUrl}" alt="${movie.title}">
        </div>
        <div class="movie__cards__footer">
          <p class="smalltext">Genres: ${movie.genres.join(", ")}</p>
        </div>
      </div>
    </div>
  `;
};

const createMovieCards = () => {
  fetch("http://localhost:6362/api/movies")
    .then((response) => response.json())
    .then((result) => {
      const cardContainer = document.getElementById("movie__cards");
      cardContainer.innerHTML = "";

      result.movies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        cardContainer.insertAdjacentHTML("beforeend", movieCard);
      });
    });
};

createMovieCards();

// Filter Button Handling
const filterBtn = document.getElementById("filter__btn");
filterBtn.addEventListener("click", () => {
  const selectedTitle = document.getElementById("title").value;
  const selectedGenre = document.getElementById("genres").value;

  // Construct and fetch the URL based on selectedTitle and selectedGenre
  const filters = { id: selectedTitle, genres: selectedGenre };
  const queryString = encodeURIComponent(JSON.stringify({ filters }));
  const url = `http://localhost:7878/api/movies/?filters=${queryString}`;

  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  fetch(url, { headers })
    .then((response) => response.json())
    .then((data) => {
      const cardContainer = document.getElementById("movie__cards");
      cardContainer.innerHTML = "";

      data.movies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        cardContainer.insertAdjacentHTML("beforeend", movieCard);
      });
    })
    .catch((error) => console.error("Error fetching movies:", error));
});

// Login Handling
const loginForm = document.getElementById("loginForm");

const login = async (email, password) => {
  try {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    const response = await fetch("http://localhost:7878/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      alert("Login failed");

      const loginModal = document.getElementById("idModal");
      loginModal.classList.add("hidden");
    } else {
      const data = await response.json();

      if (data.accessToken && data.user) {
        const { accessToken, user } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);

        handleAfterLogin();

        const loginModal = document.getElementById("idModal");
        loginModal.classList.add("hidden");
      }
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("emailModal").value;
  const password = document.getElementById("passwordModal").value;

  try {
    await login(email, password);

    alert("Logged in successfully");
    modal.classList.add("hidden");
  } catch (error) {
    console.error("Login failed:", error);
  }
});

// After Login Handling
const handleAfterLogin = () => {
  const logoutContainer = document.getElementById("logout__container");
  logoutContainer.innerHTML = `<a href="#" id="logout__link" class="navbar__menu__list__item text">Logout</a>`;

  const loginContainer = document.getElementById("login__container");
  loginContainer.style.display = "none";

  const logoutLink = document.getElementById("logout__link");
  logoutLink.addEventListener("click", () => {
    handleLogout();
  });
};

handleAfterLogin();

// Logout Handling
const handleLogout = () => {
  localStorage.removeItem("accessToken");

  const logoutContainer = document.getElementById("logout__container");
  logoutContainer.innerHTML = "";

  const loginContainer = document.getElementById("login__container");
  loginContainer.style.display = "block";
};

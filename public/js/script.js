// AP PLAYER
document.addEventListener("DOMContentLoaded", () => {
  const aplayer = document.querySelector("#aplayer");
  if (aplayer) {
    try {
      let dataSong = aplayer.getAttribute("data-song");
      let dataSinger = aplayer.getAttribute("data-singer");
      dataSong = JSON.parse(dataSong);
      dataSinger = JSON.parse(dataSinger);

      const ap = new APlayer({
        autoplay: true,
        container: aplayer,
        lrcType: 3,
        audio: {
          name: dataSong.title,
          artist: dataSinger.fullName,
          url: dataSong.audio,
          cover: dataSong.avatar,
          lrc: "lrc.lrc",
        },
      });

      ap.on("ended", function () {
        const link = `/songs/listen/${dataSong._id}`;
        const option = {
          method: "PATCH",
        };
        fetch(link, option)
          .then((res) => res.json())
          .then((data) => {
            // Cập nhật số lượt nghe
            const elementListen = document.querySelector(
              `.inner-action.inner-listen span.listen-count`
            );
            if (elementListen) {
              elementListen.textContent = `${data.listen} lượt nghe`;
            }
          });
      });
    } catch (error) {
      console.error("Error parsing data or initializing APlayer:", error);
    }
  } else {
    console.error("Element with ID 'aplayer' not found.");
  }
});
// END AP PLAYER
// BUTTON LIKE
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");

    const typeLike = isActive ? "dislike" : "like";
    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH",
    };
    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        const span = buttonLike.querySelector("span");
        span.innerHTML = `${data.like} thích`;
        buttonLike.classList.toggle("active");
      });
  });
}
// BUTTON LIKE

// BUTTON FAVORITE
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if (listButtonFavorite.length > 0) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");

      const typeFavorite = isActive ? "unfavorite" : "favorite";
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;

      const option = {
        method: "PATCH",
      };

      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          // Kiểm tra response thành công
          if (data.code === 200) {
            buttonFavorite.classList.toggle("active");
          } else {
            console.error("Error:", data.message);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
  });
}
// BUTTON FAVORITE
// SEARCH SUGGEST
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");
  input.addEventListener("keyup", () => {
    const keyword = input.value;
    const link = `/search/suggest?keyword=${keyword}`;
    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        const songs = data.songs;
        if (songs.length > 0) {
          boxSuggest.classList.add("show");

          const htmls = songs.map((song) => {
            return `<a href="/songs/detail/${song.slug}" class="inner-item">
                      <div class="inner-image">
                          <img src=${song.avatar} alt=${song.title}>
                      </div>
                      <div class="inner-info">
                          <div class="inner-title">${song.title}</div>
                          <div class="inner-singer">
                              <i class="fa-solid fa-microphone-lines"></i>
                              ${song.infoUser.fullName}
                          </div>
                      </div>
                    </a>`;
          });
          const boxList = boxSuggest.querySelector(".inner-list");
          boxList.innerHTML = htmls.join("");
        } else {
          boxSuggest.classList.remove("show");
        }
      });
  });
}

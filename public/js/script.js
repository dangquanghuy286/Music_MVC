// AP PLAYER
const aplayer = document.querySelector("#aplayer");
let dataSong = aplayer.getAttribute("data-song");
let dataSinger = aplayer.getAttribute("data-singer");
dataSong = JSON.parse(dataSong);
dataSinger = JSON.parse(dataSinger);
if (aplayer) {
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
}
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
const buttonFavorite = document.querySelector("[button-favorite]");
if (buttonFavorite) {
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
}
// BUTTON LIKE

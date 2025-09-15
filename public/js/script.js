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

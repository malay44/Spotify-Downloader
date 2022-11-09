document.addEventListener("touchstart", function () {}, true);
document.querySelector(".search-icon").addEventListener("click", function () {
  // document.querySelector(".search-icon").classList.toggle("search-icon-click");
  // document.querySelector(".search-container").classList.add("go-up");
  // document.querySelector(".search-box").classList.toggle("minimize-search");
  // document.querySelector(".content").classList.remove("hide");
});
let linkjson;

let link;
let d;

let form = document.querySelector(".search-container");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  document.querySelector(".fa-magnifying-glass").outerHTML="<i class=\"fa-solid fa-circle-notch fa-spin icon-m\"></i>";
  link = document.getElementById("search-box").value;
  console.log(link);
  // if (link.substring(25,30) == "track" || link.substring(8,23) == "www.youtube.com" || link.substring(8,16) == "youtu.be"){ 

  //  }


  let fetchRes = fetch(
    `http://localhost:3000/details?id=${link}`
  );
  // fetchRes is the promise to resolve
  // it by using.then() method
  fetchRes
    .then((res) => res.json())
    .then((d) => {
      new Vue({
        el: "#app",
        data() {
          return {
            audio: null,
            circleLeft: null,
            barWidth: null,
            duration: null,
            currentTime: null,
            classes: "",
            audioformat: "mp3",
            isTimerPlaying: false,
            isFullScreen: false,
            indownload: true,
            mp3: true,
            wav: false,
            tracks: [
              {
                name: d.SongName,
                artist: d.ArtistName,
                cover: d.CoverArtLink,
                url: "https://www.youtube.com/watch?v=z3wAjJXbYzA",
              },
            ],
            currentTrack: null,
            currentTrackIndex: 0,
            transitionName: null,
          };
        },
        methods: {
          name_modifier(){
            Sname=d.SongName.replace(/ /g,"_");
          },

          buttonpress() {
            if (this.indownload) {
              this.windowToggle("maximize");
            } else {
              this.windowToggle("minimize");
            }
            this.indownload = !this.indownload;
          },

          windowToggle(name) {
            this.classes = name;
          },
          play() {
            if (this.audio.paused) {
              this.audio.play();
              this.isTimerPlaying = true;
            } else {
              this.audio.pause();
              this.isTimerPlaying = false;
            }
          },
          fullscreen() {
            if (
              window.fullScreen ||
              (window.innerWidth == screen.width &&
                window.innerHeight == screen.height)
            ) {
              closeFullscreen();
              this.isFullScreen = false;
            } else {
              openFullscreen();
              this.isFullScreen = true;
            }
          },
          favorite(format) {
            if (format == "mp3") {
              this.mp3 = true;
              this.wav = false;
            } else {
              this.mp3 = false;
              this.wav = true;
            }
          },
        },
        created() {
          let vm = this;
          this.currentTrack = this.tracks[0];
        },
      });
      Vue.config.productionTip = false;
      Vue.config.devtools = false;

      let elem = document.documentElement;
      let fullscreen = false;

      /* View in fullscreen */
      function openFullscreen() {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          /* Safari */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          /* IE11 */
          elem.msRequestFullscreen();
        }
      }

      function closeFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE11 */
          document.msExitFullscreen();
        }
      }

      document.querySelector(".search-icon").classList.toggle("search-icon-click");
      document.querySelector(".search-container").classList.add("go-up");
      document.querySelector(".search-box").classList.toggle("minimize-search");
      document.querySelector(".content").classList.remove("hide");
      document.querySelector(".fa-circle-notch").outerHTML="<i class=\"fa-solid fa-magnifying-glass icon-m\"></i>";

    });
});

import axios from "axios";

let playBtn = document.getElementById("playBtn")!;
let stopBtn = document.getElementById("stopBtn")!;

playBtn.onclick = (ev) => {
  axios.put("http://127.0.0.1:4000/backend/log", "enable", {
    headers: { "Content-Type": "text/plain" },
  }).finally(() => {
    console.log("requested enable")
  });
};

stopBtn.onclick = (ev) => {
  axios.put("http://127.0.0.1:4000/backend/log", "disable", {
    headers: { "Content-Type": "text/plain" },
  }).finally(() => {
    console.log("requested disable")
  });;
};
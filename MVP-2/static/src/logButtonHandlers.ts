import axios from "axios";

let playBtn = document.getElementById("playBtn")!;
let stopBtn = document.getElementById("stopBtn")!;

playBtn.onclick = (ev) => {
  axios.put("http://127.0.0.1:5000/log", "enable", {
    headers: { "Content-Type": "text/plain" },
  });
};

stopBtn.onclick = (ev) => {
  axios.put("http://127.0.0.1:5000/log", "disable", {
    headers: { "Content-Type": "text/plain" },
  });
};

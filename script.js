const audio    = document.getElementById('audio');
const fileInput = document.getElementById('file');
const playBtn  = document.getElementById('play');
const fill     = document.getElementById('fill');
const cover    = document.getElementById('cover');
const progress = document.getElementById('progress');
const cur      = document.getElementById('cur');
const dur      = document.getElementById('dur');
const vol      = document.getElementById('vol');

/* ── Load file ── */
fileInput.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;

  audio.src = URL.createObjectURL(f);

  jsmediatags.read(f, {
    onSuccess: tag => {
      const tags = tag.tags;

      document.getElementById('title').innerText  = tags.title  || f.name;
      document.getElementById('artist').innerText = tags.artist || "Unknown Artist";

      if (tags.picture) {
        let data   = tags.picture.data;
        let format = tags.picture.format;
        let bytes  = "";
        for (let i = 0; i < data.length; i++) bytes += String.fromCharCode(data[i]);
        cover.src = `data:${format};base64,${btoa(bytes)}`;
      }
    },
    onError: () => {
      document.getElementById('title').innerText = f.name;
    }
  });
};

/* ── Play / Pause ── */
playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    cover.classList.add('playing');
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';
  } else {
    audio.pause();
    cover.classList.remove('playing');
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
};

/* ── Progress updates ── */
audio.addEventListener('loadedmetadata', () => {
  dur.innerText = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  fill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  cur.innerText = formatTime(audio.currentTime);
});

/* ── Seek on click ── */
progress.onclick = e => {
  const r = progress.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
};

/* ── Volume ── */
vol.oninput = () => audio.volume = vol.value;

/* ── Time formatter ── */
function formatTime(t) {
  let m = Math.floor(t / 60);
  let s = Math.floor(t % 60);
  if (s < 10) s = '0' + s;
  return m + ':' + s;
}

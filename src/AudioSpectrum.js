var nbars;
var audio;
var container;
var bg;
var bg2;
var mbg;
var max;
var w;
var h;
var s;
var analayzer;
var frequencyData;

function setStyle(style) {
  bg = style.bg;
  bg2 = style.bg2;
  mbg = style.mbg;
  max = style.maxfreq;
  w = style.w;
  h = style.h;
  s = style.s;
}

function createSpectrum(nob, a, c) {
  nbars = nob;
  audio = document.querySelector(a);

  const ctx = new AudioContext();

  const audioSource = ctx.createMediaElementSource(audio);

  analayzer = ctx.createAnalyser();

  audioSource.connect(analayzer);
  audioSource.connect(ctx.destination);

  frequencyData = new Uint8Array(analayzer.frequencyBinCount);
  analayzer.getByteFrequencyData(frequencyData);

  container = document.querySelector(c);

  for (let i = 0; i < nbars; i++) {
    const bar = document.createElement("div");
    bar.setAttribute("id", "bar" + i);
    bar.setAttribute("class", "barcontainer");
    bar.style.width = w + "px";
    if (bg2 != null) {
      bar.style.background = "linear-gradient(" + bg + "," + bg2 + ")";
    } else {
      bar.style.background = bg;
    }
    bar.style.margin = 0 + (s || 0) + "px";
    container.appendChild(bar);
  }

  function renderFrame() {
    analayzer.getByteFrequencyData(frequencyData);

    for (let i = 0; i < nbars; i++) {
      const freqData = frequencyData[i];

      const barHeight = Math.max(h || 2, freqData);

      var bars = document.getElementById("bar" + i);

      var freq = frequencyData.at(i).toString();

      if (mbg && max != null) {
        if (freq >= max) {
          if (bg2 != null) {
            bars.style.background = "linear-gradient(" + mbg + "," + bg + ")";
          } else {
            bars.style.background = mbg;
          }
        } else {
          if (bg2 != null) {
            bars.style.background = "linear-gradient(" + bg2 + "," + bg + ")";
          } else {
            bars.style.background = bg;
          }
        }
      }

      if (!bars) {
        continue;
      }
      bars.style.height = barHeight + "px";
    }
    requestAnimationFrame(renderFrame);
  }
  renderFrame();
}

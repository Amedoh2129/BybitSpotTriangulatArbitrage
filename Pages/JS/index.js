const socket = io.connect('/');
let runFlag = true;
let minPL = 0;

const runToggle = () => {
  runFlag = !runFlag;
  document.getElementById('runDiv').innerHTML =
    `<button onclick="runToggle();" type="button" class="btn ${runFlag ? 'btn-success' : 'btn-danger'}" id="runFlag">Toggle</button>`;
};

const minLimit = (ml) => {
  minPL = parseFloat(ml);
};

socket.on('ARBITRAGE', (pl) => {
  if (runFlag) {
    let markup = '';
    pl.filter((p) => p.value >= minPL).forEach((d, i) => {
      markup +=
        `<tr class='table-success'><td>${i + 1}</td><td>${d.tpath}</td><td>${d.value}</td></tr>`;
    });
    document.getElementById('tartbitBody').innerHTML = markup;
  }
});

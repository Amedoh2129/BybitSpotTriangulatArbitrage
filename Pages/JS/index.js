const socket = io.connect('/');
let runFlag = 'X';
let minPL = 0;

const runToggle = () => {
  if (runFlag) {
    runFlag = '';
    document.getElementById('runDiv').innerHTML =
      '<button onclick="runToggle();" type="button" class="btn btn-danger" id="runFlag">Toggle</button>';
  } else {
    runFlag = 'X';
    document.getElementById('runDiv').innerHTML =
      '<button onclick="runToggle();" type="button" class="btn btn-success" id="runFlag">Toggle</button>';
  }
};

const minLimit = (ml) => {
  minPL = parseFloat(ml);
};

socket.on('ARBITRAGE', (pl) => {
  if (runFlag) {
    let markup = '';
    pl.filter((p) => p.value >= minPL).forEach((d, i) => {
      markup +=
        "<tr class='table-success'><td>" +
        (i + 1) +
        '</td><td>' +
        d.tpath +
        '</td><td>' +
        d.value +
        '</td></tr>';
    });
    document.getElementById('tartbitBody').innerHTML = markup;
  }
});

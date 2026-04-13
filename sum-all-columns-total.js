var final = 0
var tbody = document.querySelector("tbody");
var howManyCols = tbody.rows[0].cells.length;
var totalRow = tbody.rows[tbody.rows.length - 1];
for (var j = 1; j < howManyCols; j++) {
  final = computeTableColumnTotal(j);
  totalRow.cells[j].innerText = final;
}

function computeTableColumnTotal(colNumber) {

  var result = 0;

  try {
    var tableBody = document.querySelector("tbody");
    var howManyRows = tableBody.rows.length;

    for (var i = 1; i < (howManyRows - 1); i++) {
      var thisNumber = parseInt(tableBody.rows[i].cells[colNumber].childNodes.item(0).data);

      if (!isNaN(thisNumber))
        result += thisNumber;
    }
  } finally {
    return result;
  }
}

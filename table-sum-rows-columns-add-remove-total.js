function sumColAndRows(row, col, nameTable) {

    //tabla
    const table = document.getElementById(`${nameTable}`)

    //sumas filas
    let rowSelect = table.getElementsByClassName(`row${row}`)
    let rowTotal = table.querySelector(`#rowTotal${row}`)
    let rowTotalArray = []

    for (let i = 0; i < rowSelect.length; i++) {
        if (rowSelect[i].value > 0) {
            rowTotalArray.push(parseFloat(rowSelect[i].value))
        }
    }

    let sumaTotal = rowTotalArray.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)

    rowTotal.innerText = parseFloat(sumaTotal).toFixed(2)

    //suma columnas
    let colSelect = table.getElementsByClassName(`col${col}`)
    let colTotal = table.querySelector(`#colTotal${col}`)
    let colTotalArray = []

    for (let i = 0; i < colSelect.length; i++) {
        if (colSelect[i].value > 0) {
            colTotalArray.push(parseFloat(colSelect[i].value))
        }
    }

    let sumaTotal2 = colTotalArray.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)

    colTotal.innerText = parseFloat(sumaTotal2).toFixed(2)


    let colTotalTotal = table.getElementsByClassName('col8')
    const totalTotal = table.querySelector('#totalTotal')
    let colTotalTotalArray = []

    for (let i = 0; i < colTotalTotal.length; i++) {
        if (colTotalTotal[i].innerText > 0) {
            colTotalTotalArray.push(parseFloat(colTotalTotal[i].innerText))
        }
    }

    let sumaTotal3 = colTotalTotalArray.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)

    totalTotal.innerText = parseFloat(sumaTotal3).toFixed(2)
    
  //IF YOU ADD MORE COLS O REMOVE COLS
  
  //total of totals
  //if u add more cols, you only have to change the col name depending of your cols,
  //in this example col8 is the column total of the rows
  
  //spanish
  //si agregas mas filas, 
  //solo tienes que cambiar al numero de columna respectiva al que va la columna donde esta el
  //total del total de filas!
  
  //DM ig for more explanation: @jsebast1an
}


function addRowTable(event, type) {
    event.preventDefault()

    let rowCount = document.getElementById(`${type}`).rows.length-1

    const cascoBuquesTableEmbarcacionesBody = document.getElementById(`${type}Body`)
    const tr = document.createElement('tr')

    cascoBuquesTableEmbarcacionesBody.appendChild(tr)
    tr.id = `newRowTable${rowCount}`
    tr.innerHTML =
        `
        <td style="text-align: center">
            ${rowCount}
        </td>
        <td>
          <input type="number" class="row${rowCount} col1"  onkeyup="sumColAndRows(${rowCount}, 1, '${type}')" placeholder="..." style="width:56px">
        </td>
        <td>
          <input type="number" class="row${rowCount} col2"  onkeyup="sumColAndRows(${rowCount}, 2, '${type}')" placeholder="..." style="width:56px"> 
        </td>
        <td>
          <input type="number" class="row${rowCount} col3"  onkeyup="sumColAndRows(${rowCount}, 3, '${type}')" placeholder="..." style="width:56px">
        </td>   
        <td>
          <input type="number" class="row${rowCount} col4"  onkeyup="sumColAndRows(${rowCount}, 4, '${type}')" placeholder="..." style="width:56px">
        </td>
        <td>
          <input type="number" class="row${rowCount} col5"  onkeyup="sumColAndRows(${rowCount}, 5, '${type}')" placeholder="..." style="width:56px">
        </td>
        <td>
          <input type="number" class="row${rowCount} col6"  onkeyup="sumColAndRows(${rowCount}, 6, '${type}')" placeholder="..." style="width:56px">
        </td>
        <td>
          <input type="number" class="row${rowCount} col7"  onkeyup="sumColAndRows(${rowCount}, 7, '${type}')" placeholder="..." style="width:56px">
        </td>
        <td style="text-align: center">
          <span class="slipTitle col8" id="rowTotal${rowCount}">0</span>$
        </td>
        <td>
            <button id="${rowCount}" type="button" class="btn btn-danger btn-xs btn-delete"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
        </td>
        `

}


$(document).on('click', '.btn-delete', function (e) {
    e.preventDefault()

    var id = $(this).attr('id')
    $('#newRowTable' + id).remove()

})

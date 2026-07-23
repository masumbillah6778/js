function add_text_input() {
  var table = document.getElementById('mytable');
  var x = table.rows.length;
  table.insertRow(-1).innerHTML = '<tr>' +
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="title'+x+'" /></td>'+
    '<td> <input type="text" id="description'+x+'" /></td></tr>';
}
function save_data(){
  var table = document.getElementById('mytable');
  var tableRows = table.rows.length;
  var data = [];
  for (var i = 1; i <= tableRows-1; i++) {
    var title = document.getElementById('title'+ i).value;
    var desc = document.getElementById('description'+ i).value;
    var temp = {title: title, description: desc};
    data.push(temp);
  }
  window.localStorage.setItem('Table1', JSON.stringify(data));
}

loadData = function(){
  let data = JSON.parse(window.localStorage.getItem('Table1'));
  for(i=0; i<data.length;i++){
    add_text_input();
    document.getElementById('title'+ (i+1)).value = data[i].title;
    document.getElementById('description'+ (i+1)).value = data[i].description;
  }
}


loadData();

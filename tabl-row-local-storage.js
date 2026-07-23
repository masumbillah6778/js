function add_text_input() {
  var table = document.getElementById('mytable');
  var x = table.rows.length;
  table.insertRow(-1).innerHTML = '<tr>' +
    '<td> <input type="text" id="no'+x+'" /></td>'+
    '<td> <input type="text" id="reg.no'+x+'" /></td>'+
    '<td> <input type="text" id="rank'+x+'" /></td>'+
    '<td> <input type="text" id="name'+x+'" /></td>'+
    '<td> <input type="text" id="workplace'+x+'" /></td>'+
    '<td> <input type="text" id="transfer'+x+'" /></td>'+
    '<td> <input type="text" id="date'+x+'" /></td>'+
    '<td> <input type="text" id="memorandum'+x+'" /></td>'+
    '<td> <input type="text" id="mobile'+x+'" /></td></tr>';
}
function save_data(){
  var table = document.getElementById('mytable');
  var tableRows = table.rows.length;
  var data = [];
  for (var i = 1; i <= tableRows-1; i++) {
    var title = document.getElementById('no'+ i).value;
    var desc = document.getElementById('reg.no'+ i).value;
    var title = document.getElementById('rank'+ i).value;
    var desc = document.getElementById('name'+ i).value;
    var title = document.getElementById('workplace'+ i).value;
    var desc = document.getElementById('transfer'+ i).value;
    var title = document.getElementById('date'+ i).value;
    var title = document.getElementById('memorandum'+ i).value;
    var desc = document.getElementById('mobile'+ i).value;
    var temp = {title: title, description: desc};
    data.push(temp);
  }
  window.localStorage.setItem('Table1', JSON.stringify(data));
}

loadData = function(){
  let data = JSON.parse(window.localStorage.getItem('Table1'));
  for(i=0; i<data.length;i++){
    add_text_input();
    document.getElementById('no'+ (i+1)).value = data[i].no;
    document.getElementById('reg.no'+ (i+1)).value = data[i].reg.no;
    document.getElementById('rank'+ (i+1)).value = data[i].rank;
    document.getElementById('name'+ (i+1)).value = data[i].name;
    document.getElementById('workplace'+ (i+1)).value = data[i].workplace;
    document.getElementById('transfer'+ (i+1)).value = data[i].transfer;
    document.getElementById('date'+ (i+1)).value = data[i].date;
    document.getElementById('memorandum'+ (i+1)).value = data[i].memorandum;
    document.getElementById('mobile'+ (i+1)).value = data[i].mobile;
  }
}


loadData();

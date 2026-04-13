$(document).ready( function () {
    var table = $('#example').DataTable({
      "columnDefs": [
        { targets : [ 8 ], data:  function ( row, type, val, meta ) {
          return parseInt(row[3],10) +
              parseInt(row[4],10) +
              parseInt(row[5],10) +
              parseInt(row[6],10) +
              parseInt(row[7],10);
            }
         }  
      ]    
    });
});

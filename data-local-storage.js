var emptyRow = "<tr><td colspan='10' class='text-center'> কোনো তথ্য এন্ট্রি নেই ! 😡 </td></tr>";
    $(document).ready(function () {
      loadDataFromLocal();
      $('#tblData').on('click', '.btn-edit', function () {
        debugger;
        const regno = $(this).parent().parent().find(".txtRegNo").html();
        const rank = $(this).parent().parent().find(".txtRank").html();
        const name = $(this).parent().parent().find(".txtName").html();
        const workplace = $(this).parent().parent().find(".txtWorkplace").html();
        const transfer = $(this).parent().parent().find(".txtTransfer").html();
        const contact = $(this).parent().parent().find(".txtContact").html();
        const date = $(this).parent().parent().find(".txtDate").html();
        const memorandum = $(this).parent().parent().find(".txtMemorandum").html();



        const id = $(this).parent().parent().find(".txtRegNo").attr("data-id");
        $("#txtRegNo").val(regno);
        $("#txtRank").val(rank);
        $("#txtName").val(name);
        $("#txtWorkplace").val(workplace);
        $("#txtTransfer").val(transfer);
        $("#txtContact").val(contact);
        $("#txtDate").val(date);
        $("#txtMemorandum").val(memorandum);
        $("#txtId").val(id);
        $("#btnSave").text("Update");
      });





      $('#tblData').on('click', '.btn-delete', function () {
        debugger;
        const id = $(this).parent().parent().find(".txtRegNo").attr("data-id");
        deleteDataFromLocal(id);
      });

      $("#btnSave").click(function () {
        debugger;
        if ($("#txtId").val() == '') {
          addDataToLocal();
        } else {
          updateDataFromLocal();
        }
      });

      $("#btnClear").click(function () {
        debugger;
        clearForm();
      });
    });




    function clearForm() {
      debugger;
      $("#txtRegNo").val("");
      $("#txtRank").val("");
      $("#txtName").val("");
      $("#txtWorkplace").val("");
      $("#txtTransfer").val("");
      $("#txtContact").val("");
      $("#txtDate").val("");
      $("#txtMemorandum").val("");
      $("#btnSave").text("Add");
    }




    function addEmptyRow() {
      debugger;
      if ($("#tblData tbody").children().children().length == 0) {
        $("#tblData tbody").append(emptyRow);
      }
    }

    function loadDataFromLocal() {
      debugger;
      let localData = localStorage.getItem('localData');
      if (localData) {
        $("#tblData tbody").html("");
        let localArray = JSON.parse(localData);
        let index = 1;
        localArray.forEach(element => {
          let dynamicTR = "<tr>";
          dynamicTR = dynamicTR + "<td> " + index + "</td>";
          dynamicTR = dynamicTR + "<td class='txtRegNo'  data-id=" + element.id + ">" + element.regno + "</td>";
          dynamicTR = dynamicTR + "<td class='txtRank'  data-id=" + element.id + ">" + element.rank + "</td>";
          dynamicTR = dynamicTR + "<td class='txtName'  data-id=" + element.id + ">" + element.name + "</td>";
          dynamicTR = dynamicTR + "<td class='txtWorkplace'  data-id=" + element.id + ">" + element.workplace + "</td>";
          dynamicTR = dynamicTR + "<td class='txtTransfer'  data-id=" + element.id + ">" + element.transfer + "</td>";
          dynamicTR = dynamicTR + "<td class='txtContact'>" + element.contact + "</td>";
          dynamicTR = dynamicTR + "<td class='txtDate'>" + element.date + "</td>";
          dynamicTR = dynamicTR + "<td class='txtMemorandum'>" + element.memorandum + "</td>";
          dynamicTR = dynamicTR + "    <td class='tdAction text-center'>";
          dynamicTR = dynamicTR + "        <button class='btn btn-sm btn-success btn-edit'> </button>";
          dynamicTR = dynamicTR + "        <button class='btn btn-sm btn-danger btn-delete'> </button>";
          dynamicTR = dynamicTR + "    </td>";
          dynamicTR = dynamicTR + " </tr>";
          $("#tblData tbody").append(dynamicTR);
          index++;
        });
      }
      addEmptyRow();
    }

    function addDataToLocal() {
      debugger;
      let localData = localStorage.getItem('localData');
      if (localData) {
        let localArray = JSON.parse(localData);
        const obj = {
          id: localArray.length + 1,
          regno: $("#txtRegNo").val(),
          rank: $("#txtRank").val(),
          name: $("#txtName").val(),
          workplace: $("#txtWorkplace").val(),
          transfer: $("#txtTransfer").val(),
          contact: $("#txtContact").val(),
          date: $("#txtDate").val(),
          memorandum: $("#txtMemorandum").val()
        };
        localArray.push(obj);
        localStorage.setItem('localData', JSON.stringify(localArray));
        loadDataFromLocal();
      } else {
        const arryObj = [];
        const obj = {
          id: 1,
          regno: $("#txtRegNo").val(),
          rank: $("#txtRank").val(),
          name: $("#txtName").val(),
          workplace: $("#txtWorkplace").val(),
          transfer: $("#txtTransfer").val(),
          contact: $("#txtContact").val(),
          date: $("#txtDate").val(),
          memorandum: $("#txtMemorandum").val()
        };
        arryObj.push(obj);
        localStorage.setItem('localData', JSON.stringify(arryObj));
        loadDataFromLocal();
      }
      clearForm();
    }

    function updateDataFromLocal() {
      debugger;
      let localData = localStorage.getItem('localData');
      let localArray = JSON.parse(localData);
      const oldRecord = localArray.find(m => m.id == $("#txtId").val());
      oldRecord.regno = $("#txtRegNo").val();
      oldRecord.rank = $("#txtRank").val();
      oldRecord.name = $("#txtName").val();
      oldRecord.workplace = $("#txtWorkplace").val();
      oldRecord.transfer = $("#txtTransfer").val();
      oldRecord.contact = $("#txtContact").val();
      oldRecord.date = $("#txtDate").val();
      oldRecord.memorandum = $("#txtMemorandum").val();
      localStorage.setItem('localData', JSON.stringify(localArray));
      loadDataFromLocal();
      clearForm();
    }

    function deleteDataFromLocal(id) {
      debugger;
      let localData = localStorage.getItem('localData');
      let localArray = JSON.parse(localData);
      let i = 0;
      while (i < localArray.length) {
        if (localArray[i].id === Number(id)) {
          localArray.splice(i, 1);
        } else {
          ++i;
        }
      }
      localStorage.setItem('localData', JSON.stringify(localArray));
      loadDataFromLocal();
    }






/*==================================================== Table Filter ====================================================*/

function filterTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tblData");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
      txtValue = td[j].textContent || td[j].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        break;
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

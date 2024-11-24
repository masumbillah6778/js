myFunction = function() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue, index;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("advance-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;

// first clear any previously marked text
      // this strips out the <mark> tags leaving text (actually all tags)
      td.innerHTML = txtValue;

      index = txtValue.toUpperCase().indexOf(filter);
      if (index > -1) {

        // using substring with index and filter.length 
        // nest the matched string inside a <mark> tag
        td.innerHTML = txtValue.substring(0, index) + "<mark>" + txtValue.substring(index, index + filter.length) + "</mark>" + txtValue.substring(index + filter.length);

        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

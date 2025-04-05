function printDiv() {
    let divContents = document.getElementById("paragraph-print").innerHTML;
    let printWindow = window.open('', '',);
    printWindow.document.write(`${divContents}`);
    printWindow.print();
  }

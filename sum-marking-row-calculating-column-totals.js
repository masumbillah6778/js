// Works with IE11, Edge 15, FF, Chrome, etc.

function toNumber(num) {
  const re = /[^\d.-]+/g; // remove thousands separator, currency and % symbols
  let a = num.replace(re, '');
  a = parseFloat(a) || 0;
  /* Use Integers to avoid floating point Math
   * because .1 + .2 != .3 */
  return Math.round(a * 100);
}

function updateCaption(items, total) {
  total = total.toLocaleString("en-us",
    { useGrouping: true, minimumFractionDigits: 2 });
  document.getElementById("selitems")
    .textContent = items + " items - USD " + total;
}

function getValue(chk) {
  var row = chk.parentElement.parentElement;
  return toNumber(row.cells[6].textContent);
  //row.cells[6] == row.lastElementChild
}

function sum(accumulator, currentValue) {
  return accumulator + currentValue;
}

function calcTotal() {
  let chked = document.querySelectorAll(
    '.tbl>tbody input[name=sel]:checked');
  let values = [].map.call(chked, getValue);
  let total = values.reduce(sum, 0);
  total = total / 100;
  updateCaption(values.length, total);
}

function toggleAll(e) {
  const checked = e.currentTarget.checked;
  const chkboxes = document.querySelectorAll(
    ".tbl>tbody input[name=sel]");
  chkboxes.forEach(function(el) {
    el.checked = checked;
  });
  calcTotal();
}

(function (doc) {
  "use strict";
  doc.addEventListener("DOMContentLoaded", function() {
    let chkToggleAll = doc.querySelector(
      ".tbl>thead input[name=chkToggleAll]");
    if (chkToggleAll) {
      chkToggleAll.addEventListener(
        "change", toggleAll, false);
    }
    let tbody = doc.querySelector(".tbl>tbody");
    if (tbody) {
      tbody.addEventListener(
        "change", calcTotal, false);
    }
  });
})(document);

// Polyfill for IE11, Edge 15.
if (HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
if (NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

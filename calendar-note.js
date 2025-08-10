var select = document.querySelector('select');
select.addEventListener('change', function() {
  var url = this.value;
  window.open(url, '_blank');
});

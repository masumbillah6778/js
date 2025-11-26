// Get all menu from document
document.querySelectorAll('.triggerButton').forEach(OpenMenu);

// Menu Open and Close function
function OpenMenu(active) {
  if(active.classList.contains('triggerButton') === true){
    active.addEventListener('click', function (e) {
      e.preventDefault();        

      if (this.nextElementSibling.classList.contains('active') === true) {
        // Close the clicked dropdown
        this.parentElement.classList.remove('active');
        this.nextElementSibling.classList.remove('active');

      } else {
        // Close the opend dropdown
        closeMenu();
        // add the open and active class(Opening the DropDown)
        this.parentElement.classList.add('active');
        this.nextElementSibling.classList.add('active');
      }
    });
  }
};

// Close the openend Menu
function closeMenu() { 
  // remove the open and active class from other opened Moenu (Closing the opend Menu)
  document.querySelectorAll('.profile').forEach(function (container) { 
    container.classList.remove('active')
  });

  document.querySelectorAll('.sub-profile').forEach(function (menu) { 
    menu.classList.remove('active');
  });
}

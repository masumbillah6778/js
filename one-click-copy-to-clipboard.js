const copyButtons = document.querySelectorAll(".copy-Btn");

const successfullyCopy = (button) => {
  button.textContent = "copied";
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = "Copy";
    button.disabled = false;
  }, 1500);
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const parentEl = button.parentElement;
    const text = parentEl.querySelector("input.contact-text");
    
    try {
      await navigator.clipboard.writeText(text.value);
      
      successfullyCopy(button);
    } catch {
      text.select();
      document.execCommand("copy");
      
      text.setSelectionRange(0, 0);
      text.blur();
      
      successfullyCopy(button);
    }
  });
});

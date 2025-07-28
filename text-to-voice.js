const paragraph = document.getElementById('paragraph');
  const readButton = document.getElementById('readButton');
  
  readButton.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(paragraph.textContent);
  window.speechSynthesis.speak(utterance);
});

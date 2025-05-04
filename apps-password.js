const errorText = document.querySelector(".error-text");

function passcheck(){
    if (document.getElementById('pass1').value != Password) {
        errorText.style.display = "block";
        errorText.textContent = "দুঃখিত! ভুল পাসওয়ার্ড।";
        return false;
    }
}

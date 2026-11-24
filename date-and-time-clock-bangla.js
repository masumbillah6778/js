// বাংল ঘড়ি 

function toBanglaNumber(value) {
    const english = "0123456789";
    const bangla = "০১২৩৪৫৬৭৮৯";

    return String(value).replace(/[0-9]/g, digit =>
        bangla[english.indexOf(digit)]
    );
}

function updateBanglaClock() {
    const now = new Date();

    let day = String(now.getDate()).padStart(2, "0");
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let year = now.getFullYear();

    let hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour || 12;
    hour = String(hour).padStart(2, "0");

    const date = `${day}-${month}-${year}`;
    const time = `${hour}:${minute}:${second} ${ampm}`;

    document.getElementById("banglaDate").textContent =
        toBanglaNumber(date);

    document.getElementById("banglaTime").textContent =
        toBanglaNumber(time.replace(ampm, "")) + ampm;
}

updateBanglaClock();
setInterval(updateBanglaClock, 1000);

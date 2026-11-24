/*
      নিজের প্রয়োজন অনুযায়ী শুধু এই তালিকাটি পরিবর্তন করুন।
      title = কার্ডের নাম, url = গন্তব্য লিংক, icon = icons তালিকার ছবির নাম, theme = কার্ডের রং।
      theme-এর অনুমোদিত মান: coral, blue, green, purple, orange, teal, royal, pink, violet
      অন্য ব্যবহারকারীর জন্য ওয়েবপেজে কোনো সম্পাদনা অপশন দেখানো হয় না।
    */
    const links = [
      { title: "বকেয়া রেশন ক্যালকুলেটর", url: "https://rab-8.github.io/srb/ration-bokeya-calculator.html", theme: "coral", icon: "home" },
      { title: "বয়স নির্ণয়কারী ক্যালকুলেটরে", url: "https://rab-8.github.io/html/age-calculator-v2.html", theme: "blue", icon: "dashboard" },
      { title: "আপডেট চলছে", url: "#", theme: "green", icon: "search" },
      { title: "আপডেট চলছে", url: "#", theme: "purple", icon: "settings" },
      { title: "আপডেট চলছে", url: "#", theme: "orange", icon: "users" },
      { title: "আপডেট চলছে", url: "#", theme: "teal", icon: "download" },
      { title: "আপডেট চলছে", url: "#", theme: "royal", icon: "globe" },
      { title: "আপডেট চলছে", url: "#", theme: "pink", icon: "mail" },
      { title: "যোগাযোগ করুন", url: "tel:+8801754604359", theme: "violet", icon: "phone" }
    ];

    // প্রতিটি আইকনের সরাসরি ছবির লিংক দিন (PNG, JPG, WEBP ইত্যাদি)।
    // নিচের example.com লিংকগুলো নমুনা—নিজের ছবির URL দিয়ে বদলে দিন।
    const icons = {
      home: "https://rab-8.github.io/images/calculator.png",
      dashboard: "https://rab-8.github.io/images/calculator.png",
      search: "https://example.com/search.png",
      settings: "https://example.com/settings.png",
      users: "https://example.com/users.png",
      download: "https://example.com/download.png",
      globe: "https://example.com/globe.png",
      mail: "https://example.com/mail.png",
      phone: "https://rab-8.github.io/images/call.png"
    };

    const container = document.getElementById("linkCards");
    links.forEach(item => {
      const card = document.createElement("a");
      card.className = `card ${item.theme || "blue"}`;
      card.href = item.url;
      card.target = item.url.startsWith("http") ? "_blank" : "_self";
      if (item.url.startsWith("http")) card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `${item.title} খুলুন`);
      const iconUrl = icons[item.icon] || icons.globe;
      card.innerHTML = `
        <div class="card-top">
          <div class="icon-wrap" aria-hidden="true">
            <img class="card-icon" src="" alt="" loading="lazy">
          </div>
          <div class="card-content">
            <h2></h2>
            <span class="url"><span class="link-symbol">🔗</span><span class="url-text"></span></span>
          </div>
        </div>
        <div class="card-bottom"><span class="visit">সাইটে যান <span class="arrow">→</span></span></div>`;
      card.querySelector(".card-icon").src = iconUrl;
      card.querySelector("h2").textContent = item.title;
      card.querySelector(".url-text").textContent = item.url.replace(/^https?:\/\//, "");
      container.appendChild(card);
    });
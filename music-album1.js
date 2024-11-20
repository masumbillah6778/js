let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Preya Re Preya Re',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/best-of-zubeen-garg/raw/main/piya-re-piya-re.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'O Bondu Re',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/o_bondhu_re.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Tomar Amar Prem',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/best-of-zubeen-garg/raw/main/piya-re-piya-re.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Aaina Mon Bhanga',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/best-of-zubeen-garg/raw/main/aaina-mon-vhanga.mp3.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Tomar amar prem',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/best-of-zubeen-garg/raw/main/tomar-amar-prem.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Chokher Jole Vasiye',
        artist : 'F.A Sumon',
        music : 'https://github.com/masumbillah6778/music_lyrics/raw/main/chokher-jole-vasiye-dilam.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Amar Jonom Gelo',
        artist : 'Rama Karmakar',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/amar_jonom_gelo_vule_vule.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Dore Dore Thekona',
        artist : 'Imran & Pujaa',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/tomi_dure_dure_r_thekona.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Olo Amar Poran Sokhi',
        artist : 'Sohag',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/olo_amar_poran_sokhi.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Eto Kosto Buker Vitor',
        artist : ' Promit, Sweety',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/eto_kosto_buker_vitor.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Mon Tor Hoyeche Ki',
        artist : 'Imran Mahamudul',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/mon_tor_hoyeche_ki.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Mom Bole Priya Priya',
        artist : '',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/mon_bole_priya_priya.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Kar Basore Gumaou',
        artist : 'Atif Ahmed Niloy',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/kar_basore_gumao.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Cokher Jole Vasiye Dilam',
        artist : 'Zubeen Garg',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/chokher_jole_vasiye_dilam.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Jiboner Aina',
        artist : 'Parveg',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/jiboner_ayna.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Tumi Amar Shudhu Amar',
        artist : 'Clean Bandit',
        music : 'https://github.com/masumbillah6778/sadsong/raw/main/tumi_amar_shudhu_amar.mp3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Soite Pari Nare Doyal Re',
        artist : 'Miraj Khan',
        music : 'https://drive.google.com/uc?export=download&id=1LF6Jp1x0DR2WDBfKcu4IDFuSlDoCoHd3'
    },
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Moron Jodi Ase o Priyotoma',
        artist : 'Larjina Parbin',
        music : 'https://drive.google.com/uc?export=download&id=1MJ9cwcQL2Jf93fOtrAoQDXAj73U_QIn2'
    },
  
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'O Kolija Kolija Re',
        artist : 'Larjina Parbin',
        music : 'https://drive.google.com/uc?export=download&id=1MU_D1eKwwcEH6ZeuCym55Q6QZzp_IxA9'
    },
  
    {
        img : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKarswJaSiyByEMlXTUFVt5mmqjLph0b7I0yYjeva-L4Gzw_CnJeBmRPUOC3HYLNsaxx3LVHJxezQxoDkieJwwOmBFzpfaDOobpL4oT-CeQ2tb5gVCsboJPX6FROJup-96B2WZZ7JaBgAhgvxiCTEfvbyDreiwBhjT33jWnHXNNce9OnmuboIQC0hxlxo/s1600/1000192109.png',
        name : 'Tumi Amar Shudhu Amar',
        artist : 'Clean Bandit',
        music : 'https://drive.google.com/uc?export=download&id=1yyi8VF_N20NKwMB9TLZOP4n2-29MWxZI'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    random_bg_color();
}

function random_bg_color(){
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a){
        for(let i=0; i<6; i++){
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";
    document.body.style.background = gradient;
}
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

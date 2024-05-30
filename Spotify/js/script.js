let currentSong = new Audio()
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //  show all the song list in the playlist
    let songUl = document.querySelector(".songList").
    getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
     <img class="invert" src="img/music.svg" alt="music io">
     <div class="info">
         <div>${song.replaceAll("%20", " ")} </div>
         <div>Author</div>
     </div>
     <div class="playNow">
         <span>Play Now</span>
         <img class="invert" src="img/play.svg" alt="play">
     </div></li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}


async function displayAlbum(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-2)[0];
            //Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML +
            `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="#000" class="injected-svg"
                    data-src="https://cdn.hugeicons.com/icons/play-stroke-sharp.svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#000000" stroke-width="1.5"
                        stroke-linejoin="round"></path>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="img">
            <h2>${response.Title}</h2>
            <p>${response.Description}</p>
        </div>`
        }
    }
    
    // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
 
}

async function main() {
    // get the list of all the songs
    await getSongs("songs/crs")
    playMusic(songs[0], true)

// Display all the album on the page
displayAlbum()

    //Attach an event listener to song button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for timeudate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add add event listener to seekbar
    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamBurger
    document.querySelector(".hamBurger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for hamBurger to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listener for previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener for next button
    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // Add an event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value / 100)
    })
    
    // Add an event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()
export const error = {
    0: { title: "Incorrect Filetype uploaded.", message: "You can only upload audio files." },
    1: { title: "No song found.", message: "Please upload a song before attempting to play it." },
    2: { title: "No song found.", message: "Song must be playing in order to mute it." },
    3: { title: "No song found.", message: "Song must be playing in order to change the Volume." },
}

export const errorPopup = (id) => {
    const btn = document.querySelector("#_errorModalBtn");
    const errorTitle = document.querySelector("#_errorModalTitle");
    const errorMessage = document.querySelector("#_errorModalMessage");
    errorTitle.innerHTML = error[id].title;
    errorMessage.innerHTML = error[id].message;
    console.log("Error")
    btn.click();
}
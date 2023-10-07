let canvas;
let world;
let keyboard = new Keyboard();
let fullscreenMode = false;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    setAudio();
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (e.keyCode == 68) {
        keyboard.D = true;
    }
})

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (e.keyCode == 68) {
        keyboard.D = false;
    }
})


function fullscreen() {
    let content = document.getElementById('content');
    if (document.fullscreenElement === null) {
        content.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function setAudio() {
    let storage = localStorage.getItem('audio');
    if (storage) {
        if (storage == 'false') {
            volumeMute();
        }
    } else {
        world.audio = true
    }
}

function restart(id) {
    let content = document.getElementById(id);
    content.classList.add('d-none');
    document.getElementById('startscreen').classList.remove('d-none');
}

function openSettings() {
    let btn = document.getElementById('settingsBtn');
    btn.setAttribute('onclick', 'closeSettings()');
    btn.src = 'img/10_icons/settings-icon.png'
    document.getElementById('settings').classList.remove('d-none');
}

function closeSettings() {
    let btn = document.getElementById('settingsBtn');
    btn.setAttribute('onclick', 'openSettings()');
    btn.src = 'img/10_icons/settings-icon.png'
    document.getElementById('settings').classList.add('d-none');
}

function volumeMute() {
    world.audio = false;
    let volume = document.getElementById('volume');
    volume.src = 'img/hud/volume-off.svg';
    localStorage.setItem('audio', false)
}

let isFullscreen = false;

function toggleFullscreen() {
  const content = document.getElementById('content');

  if (!isFullscreen) {
    fullscreenON(content);
  } else {
    fullscreenOFF();
  }
}

function fullscreenON(content) {
    if (content.requestFullscreen) {
        content.requestFullscreen();
      } else if (content.mozRequestFullScreen) {
        content.mozRequestFullScreen();
      } else if (content.webkitRequestFullscreen) {
        content.webkitRequestFullscreen();
      } else if (content.msRequestFullscreen) {
        content.msRequestFullscreen();
      }
      isFullscreen = true;
}

function fullscreenOFF() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      isFullscreen = false;
} 
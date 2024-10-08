console.log('hello');

const recordingOnDiv = document.querySelector('.recording-on');
const recordingOffDiv = document.querySelector('.recording-off');
const recordBtn = document.querySelector('.record-btn');
const stopBtn = document.querySelector('.stop-btn');
const soundClips = document.querySelector('.sound-clips');

let mediaRecorder = null;
let chunks = [];

let isRecording = false;
stopBtn.disabled = true;
recordingOnDiv.style.display = 'none';

recordBtn.addEventListener('click', () => {
    isRecording = true;
    let status = handleRecording();

    if(status === 0) {
        return;
    }
    handleRecordingStatus(isRecording);
    recordBtn.disabled = true;
    stopBtn.disabled = false;


});

stopBtn.addEventListener('click', () => {
    isRecording = false;

    let status = handleStop();
    if(status === 0) {
        return
    }
    handleRecordingStatus(isRecording);
    stopBtn.disabled = true;
    recordBtn.disabled = false;
});

function handleRecordingStatus(isRecording) {
    if(!isRecording){
        recordingOnDiv.style.display = 'none';
        recordingOffDiv.style.display = 'block';
    } else {
        recordingOnDiv.style.display = 'block';
        recordingOffDiv.style.display = 'none';
    }
}

function handleRecording() {
    console.log('handleRecording');

    if(mediaRecorder) {
        mediaRecorder.start();
        console.log(mediaRecorder.state, 'mediaRecorder.state');

        mediaRecorder.ondataavailable = function(e) {
            console.log(e, 'e');
            chunks.push(e.data);
            console.log(chunks, 'chunks');
        }
        return 1;
    } else {
        console.log('mediaRecorder not available!');
        console.log('try again!');
        return 0;
    }
}

function handleStop() {
    if(mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.onstop = function(e) {
            console.log('recording stopped!');
            console.log(mediaRecorder, 'mediaRecorder');
            console.log('mimetype', mediaRecorder.mimeType);

            const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");
            const downloadButton = document.createElement("a");



            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";
            clipLabel.textContent = clipName;
            downloadButton.textContent = "Download";
            downloadButton.className = "download";
            downloadButton.download = clipName + '.ogg';
            
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(downloadButton);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);
            

            let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            console.log(blob, 'blob');
            chunks = [];
            let audioURL = URL.createObjectURL(blob);
            console.log(audioURL, 'audioURL');
            audio.src = audioURL;
            downloadButton.href = audioURL;

            deleteButton.onclick = function(e) {
                let evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }
        }

        return 1;
    } else {
        console.log('mediaRecorder not available!');
        console.log('try again!');
        return 0;
    }
}

console.log(navigator, 'navigator');
console.log(navigator.mediaDevices, 'navigator.mediaDevices');


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        console.log(stream, 'stream');
        mediaRecorder = new MediaRecorder(stream);
        console.log(mediaRecorder, 'mediaRecorder');

    }).catch(err => {
        console.log(err, 'err');
    });
} else {
    console.log('getUserMedia not supported on your browser!');
}

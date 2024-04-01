let mediaRecorder;
let isRecording = false;
let signalRConnection;

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = async event => {
      if (event.data.size > 0 /*&& signalRConnection.connectionStarted*/) {
        const arrayBuffer = await event.data.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...bytes));
        console.log(base64String);
        window.ReactNativeWebView.postMessage(base64String)
        //signalRConnection.invoke('ReceiveAudio', base64String);
      }
    };
    mediaRecorder.start(1000);
  } catch (err) {
    console.error('Error accessing the microphone', err);
    window.ReactNativeWebView.postMessage(String(err))
  }
}

async function setupSignalR() {
  signalRConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5000/audioHub', { withCredentials: false })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  await signalRConnection.start();
}

try {
  const startStopButton = document.getElementById('startStopButton');

  startStopButton.onclick = () => {
    if (!isRecording) {
      
        startRecording();
        startStopButton.textContent = 'Stop';
        isRecording = true;
      
    } else {
      mediaRecorder.stop();
      startStopButton.textContent = 'Start';
      isRecording = false;
    }
  };
} catch (err) {
    console.log(err);
    window.ReactNativeWebView.postMessage(String(err))
}
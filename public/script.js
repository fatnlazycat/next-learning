let mediaRecorder;
let isRecording = false;

async function startRecording() {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'debug', body: 'in startRecording'}));
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = async event => {
      if (event.data.size > 0) {
        const arrayBuffer = await event.data.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...bytes));
        console.log(base64String);
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'data', body: base64String}))
      }
    };
    mediaRecorder.start(500);
  } catch (err) {
    console.error('Error accessing the microphone', err);
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', body: String(err)}))
  }
}

async function toggleProcess() {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'debug', body: 'in toggle'}));
    try {
        if (!isRecording) {
          startRecording();
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'isRecording', body: true}));
          isRecording = true;
        } else {
          mediaRecorder.stop();
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'isRecording', body: false}));
          isRecording = false;
        }
    } catch (err) {
        console.log(err);
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', body: String(err)}));
    }
};

const a = {b: () => {console.log(8)}, c: 12};

window.ReactNativeWebView.postMessage(JSON.stringify({type: 'debug', body: a}));
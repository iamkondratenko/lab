let peerConnection;
let dataChannel;

function createOffer() {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel('chat');

  dataChannel.onopen = (event) => {
    console.log('Data Channel Opened');
  };

  dataChannel.onmessage = (event) => {
    displayMessage('User B', event.data);
  };

  navigator.mediaDevices.getUserMedia({ video: false, audio: false })
    .then((stream) => {
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    })
    .catch((error) => console.error('Error accessing media devices:', error));

  peerConnection.createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer))
    .then(() => {
      const offerText = document.getElementById('userAMessage');
      offerText.value = JSON.stringify(peerConnection.localDescription);
    })
    .catch((error) => console.error('Error creating offer:', error));
}

function createAnswer() {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel('chat');

  dataChannel.onopen = (event) => {
    console.log('Data Channel Opened');
  };

  dataChannel.onmessage = (event) => {
    displayMessage('User A', event.data);
  };

  navigator.mediaDevices.getUserMedia({ video: false, audio: false })
    .then((stream) => {
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    })
    .catch((error) => console.error('Error accessing media devices:', error));

  const offerText = document.getElementById('userAMessage');
  const offer = JSON.parse(offerText.value);

  peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => peerConnection.createAnswer())
    .then((answer) => peerConnection.setLocalDescription(answer))
    .then(() => {
      const answerText = document.getElementById('userBMessage');
      answerText.value = JSON.stringify(peerConnection.localDescription);
    })
    .catch((error) => console.error('Error creating answer:', error));
}

function displayMessage(user, message) {
  const messagesTextArea = user === 'User A' ? document.getElementById('userAMessage') : document.getElementById('userBMessage');
  messagesTextArea.value += `${user}: ${message}\n`;
}

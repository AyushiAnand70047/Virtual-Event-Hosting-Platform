// DOM Elements
const cameraBtn = document.getElementById('camera-btn');
const micBtn = document.getElementById('mic-btn');
const screenBtn = document.getElementById('screen-btn');
const endBtn = document.getElementById('end-btn');
const webcamVideo = document.getElementById('webcam-video');
const screenVideo = document.getElementById('screen-video');
const videoPlaceholder = document.getElementById('video-placeholder');
const cameraContainer = document.getElementById('camera-container');
const screenContainer = document.getElementById('screen-container');
const streamTimer = document.getElementById('stream-timer');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatSidebar = document.getElementById('chat-sidebar');
const chatClose = document.getElementById('chat-close');
const toast = document.getElementById('toast');
const viewerCount = document.getElementById('viewer-count');

// State variables
let stream;
let screenStream;
let streamStartTime;
let timerInterval;
let cameraOn = true;
let micOn = true;
let screenOn = false;
let viewerCounter = 0;

// Initialize the stream
async function initStream() {
    try {
        // Request camera and microphone permissions
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        
        // Display webcam video
        webcamVideo.srcObject = stream;
        
        // Start the stream timer
        startStreamTimer();
        
        // Simulate viewer count increase
        simulateViewers();
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        showToast('Failed to access camera or microphone');
    }
}

// Start the stream timer
function startStreamTimer() {
    streamStartTime = new Date();
    
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = now - streamStartTime;
        
        // Format the time as HH:MM:SS
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        
        streamTimer.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Toggle camera
function toggleCamera() {
    if (!stream) return;
    
    const videoTracks = stream.getVideoTracks();
    
    if (videoTracks.length === 0) {
        showToast('No camera detected');
        return;
    }
    
    cameraOn = !cameraOn;
    
    videoTracks.forEach(track => {
        track.enabled = cameraOn;
    });
    
    if (cameraOn) {
        cameraBtn.classList.add('active');
        webcamVideo.style.display = 'block';
        videoPlaceholder.style.display = 'none';
    } else {
        cameraBtn.classList.remove('active');
        webcamVideo.style.display = 'none';
        videoPlaceholder.style.display = 'flex';
    }
}

// Toggle microphone
function toggleMic() {
    if (!stream) return;
    
    const audioTracks = stream.getAudioTracks();
    
    if (audioTracks.length === 0) {
        showToast('No microphone detected');
        return;
    }
    
    micOn = !micOn;
    
    audioTracks.forEach(track => {
        track.enabled = micOn;
    });
    
    if (micOn) {
        micBtn.classList.add('active');
    } else {
        micBtn.classList.remove('active');
    }
}

// Toggle screen sharing
async function toggleScreenShare() {
    if (screenOn) {
        // Stop screen sharing
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        
        screenContainer.style.display = 'none';
        cameraContainer.classList.remove('sharing');
        screenOn = false;
        screenBtn.classList.remove('active');
        
    } else {
        try {
            // Start screen sharing
            screenStream = await navigator.mediaDevices.getDisplayMedia({ 
                video: { 
                    cursor: "always" 
                },
                audio: false
            });
            
            // Handle when user stops screen sharing from browser controls
            screenStream.getVideoTracks()[0].onended = function() {
                screenContainer.style.display = 'none';
                cameraContainer.classList.remove('sharing');
                screenOn = false;
                screenBtn.classList.remove('active');
            };
            
            // Display the screen sharing
            screenVideo.srcObject = screenStream;
            screenContainer.style.display = 'block';
            cameraContainer.classList.add('sharing');
            screenOn = true;
            screenBtn.classList.add('active');
            
        } catch (error) {
            console.error('Error sharing screen:', error);
            showToast('Failed to share screen');
        }
    }
}

// End the stream
function endStream() {
    if (confirm('Are you sure you want to end the live stream?')) {
        // Stop all tracks in the stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Stop screen sharing if active
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        
        // Stop the timer
        clearInterval(timerInterval);
        
        // Redirect to dashboard
        window.location.href = '../admin-home';
    }
}

// Handle chat form submission
function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add message to chat
    addChatMessage('Host', message, true);
    
    // Clear input
    chatInput.value = '';
    
    // Show toast
    showToast('Message sent');
}

// Add a message to the chat
function addChatMessage(sender, text, isHost = false) {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message${isHost ? ' message-host' : ''}`;
    
    messageElement.innerHTML = `
        <div class="message-avatar">${sender.charAt(0)}</div>
        <div class="message-content">
            <div class="message-author">
                ${sender} ${isHost ? '<span class="host-badge">HOST</span>' : ''}
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Simulate viewers joining
function simulateViewers() {
    // Start with 0 viewers
    viewerCounter = 0;
    viewerCount.textContent = viewerCounter;
    
    // Add viewers gradually
    const viewerInterval = setInterval(() => {
        // Add a random number of viewers (1-3)
        const newViewers = Math.floor(Math.random() * 3) + 1;
        viewerCounter += newViewers;
        viewerCount.textContent = viewerCounter;
        
        // Simulate a new viewer chat message occasionally
        if (Math.random() > 0.7) {
            const viewers = [
                { name: 'John', messages: ['Great stream!', 'How do I sign up for the next event?', 'Thanks for the info!'] },
                { name: 'Sarah', messages: ['This is so helpful', 'Can you go over that again?', 'Looking forward to the next one!'] },
                { name: 'Alex', messages: ['First time here!', 'Love the content', 'Will this be recorded?'] },
                { name: 'Priya', messages: ['Hello from India!', 'This is exactly what I needed', 'When is the next stream?'] }
            ];
            
            const viewer = viewers[Math.floor(Math.random() * viewers.length)];
            const message = viewer.messages[Math.floor(Math.random() * viewer.messages.length)];
            
            addChatMessage(viewer.name, message);
        }
        
        // Stop increasing after reaching ~50 viewers
        if (viewerCounter > 50) {
            clearInterval(viewerInterval);
            
            // Fluctuate viewer count slightly
            setInterval(() => {
                // Random change between -2 and +2
                const change = Math.floor(Math.random() * 5) - 2;
                viewerCounter = Math.max(48, Math.min(53, viewerCounter + change));
                viewerCount.textContent = viewerCounter;
            }, 10000);
        }
    }, 5000);
}

// Toggle chat sidebar on mobile
function toggleChatSidebar() {
    chatSidebar.classList.toggle('active');
}

// Event Listeners
cameraBtn.addEventListener('click', toggleCamera);
micBtn.addEventListener('click', toggleMic);
screenBtn.addEventListener('click', toggleScreenShare);
endBtn.addEventListener('click', endStream);
chatForm.addEventListener('submit', handleChatSubmit);
chatClose.addEventListener('click', toggleChatSidebar);

// Initialize the stream when the page loads
window.addEventListener('load', initStream);
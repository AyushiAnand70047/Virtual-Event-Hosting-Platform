// Sample data
const liveEvent = null; // Set to null to show "No live events" message
        
// Uncomment this to show a live event
/*
const liveEvent = {
    id: 1,
    title: "Introduction to Digital Marketing",
    host: "John Smith",
    description: "Learn the fundamentals of digital marketing, including SEO, social media, email marketing, and more.",
    viewers: 145,
    duration: "01:22:35",
    banner: "/api/placeholder/800/400"
};
*/

// Display live event or "no events" message
function renderLiveEvent() {
    const liveEventContent = document.getElementById('live-event-content');
    
    if (liveEvent) {
        liveEventContent.innerHTML = `
            <div class="live-event">
                <div class="event-banner" style="background-image: url('${liveEvent.banner}'); background-size: cover; background-position: center;">
                    <div class="live-badge">
                        <i class="fas fa-circle"></i> LIVE
                    </div>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${liveEvent.title}</h3>
                    <div class="event-host">
                        <div class="host-img">${liveEvent.host.charAt(0)}</div>
                        <span class="host-name">Hosted by ${liveEvent.host}</span>
                    </div>
                    <p class="event-description">${liveEvent.description}</p>
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${liveEvent.viewers} viewers</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>Started ${liveEvent.duration} ago</span>
                        </div>
                    </div>
                    <button class="join-btn">Join Now</button>
                </div>
            </div>
        `;
    } else {
        liveEventContent.innerHTML = `
            <div class="no-events">
                <i class="fas fa-video-slash"></i>
                <h3>No Live Events Right Now</h3>
                <p>There are no live events at the moment. Check back later or browse our upcoming events below.</p>
            </div>
        `;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderLiveEvent();
    // renderScheduledEvents(scheduledEvents);
});
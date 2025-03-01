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

const scheduledEvents = [
    {
        id: 1,
        title: "UX Design Workshop",
        host: "Emily Davis",
        description: "Learn the principles of UX design and how to create user-friendly interfaces.",
        date: "2025-03-05",
        time: "10:00 AM"
    },
    {
        id: 2,
        title: "Web Development Bootcamp",
        host: "Michael Johnson",
        description: "Intensive workshop covering HTML, CSS, JavaScript and responsive design.",
        date: "2025-03-08",
        time: "2:00 PM"
    },
    {
        id: 3,
        title: "AI in Business: Practical Applications",
        host: "Sarah Williams",
        description: "Discover how businesses are using AI to streamline operations and boost productivity.",
        date: "2025-03-12",
        time: "11:00 AM"
    },
    {
        id: 4,
        title: "Data Science Fundamentals",
        host: "Robert Chen",
        description: "Introduction to data science concepts, tools, and methodologies.",
        date: "2025-03-15",
        time: "3:30 PM"
    },
    {
        id: 5,
        title: "Product Management Essentials",
        host: "Jessica Miller",
        description: "Learn the key skills required to excel as a product manager in tech.",
        date: "2025-03-20",
        time: "1:00 PM"
    }
];

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

// Display scheduled events
function renderScheduledEvents(events) {
    const scheduledEventsGrid = document.getElementById('scheduled-events-grid');
    
    if (events.length === 0) {
        scheduledEventsGrid.innerHTML = `
            <div class="no-events" style="grid-column: 1 / -1;">
                <i class="fas fa-calendar-times"></i>
                <h3>No Upcoming Events</h3>
                <p>There are no upcoming events scheduled at this time. Please check back later.</p>
            </div>
        `;
        return;
    }
    
    scheduledEventsGrid.innerHTML = '';
    
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        scheduledEventsGrid.innerHTML += `
            <div class="event-card" data-date="${event.date}">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-description">${event.description}</p>
                <div class="card-time">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formattedDate} at ${event.time}</span>
                </div>
            </div>
        `;
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderLiveEvent();
    renderScheduledEvents(scheduledEvents);
});
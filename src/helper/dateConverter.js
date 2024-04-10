function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return '';
    }  else if (diffDays <= 7 && date.getDay() < now.getDay()) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const options = { hour: 'numeric', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString(undefined, options);
}

module.exports = { formatDate, formatTime }
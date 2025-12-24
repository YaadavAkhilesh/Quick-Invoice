// utils/formatTimestamp.js
function getFormattedTimestamp() {
    const now = new Date();

    // Date part → DD‑MM‑YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0‑based
    const year = now.getFullYear();
    const datePart = `${day}-${month}-${year}`;

    // Time part → hh:mm:ss AM/PM
    let hours = now.getHours();               // 0‑23
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;                 // convert to 12‑hour clock
    const timePart = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    return `${datePart} ${timePart}`;
}

module.exports = getFormattedTimestamp;

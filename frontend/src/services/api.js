import axios from 'axios';

// PHP server eke URL eka (Oya XAMPP/WAMP use karanawa nam meka galapena widihata wenas wenna oni)
const API_URL = 'http://localhost/Attendance-timetable-system/backend';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
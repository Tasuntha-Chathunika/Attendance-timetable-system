import axios from 'axios';

// Oyage backend eka thiyena htdocs path eka
const API_URL = 'http://localhost/Attendance-timetable-system/backend/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
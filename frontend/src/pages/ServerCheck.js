import React, { useEffect } from 'react';
import axios from 'axios';

const ServerCheck = () => {

    useEffect(() => {
        // שליחת בקשה GET לשרת
        axios.get('http://localhost:5000')
            .then(response => {
                // אם הבקשה הצליחה, תציג את המידע מהשרת
                console.log('Server is running:', response.data);
            })
            .catch(error => {
                // אם הבקשה נכשלה, הצג שגיאה
                console.error('Error connecting to server:', error);
            });
    }, []);

    return (
        <div>
            <h2>Checking if server is running...</h2>
        </div>
    );
};

export default ServerCheck;

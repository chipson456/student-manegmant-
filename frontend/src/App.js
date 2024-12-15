import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Home from './pages/Home';
import ServerCheck from './pages/ServerCheck'; // הוספת הקומפוננטה ServerCheck

const App = () => {
    const [token, setToken] = React.useState(null);

    const handleLogin = (userToken) => {
        // שים את ה-token ב-localStorage כדי לשמור אותו גם אחרי רענון
        localStorage.setItem('userToken', userToken);
        setToken(userToken);
    };

    React.useEffect(() => {
        // אם יש Token ב-localStorage, תעדכן את ה-state עם הערך
        const savedToken = localStorage.getItem('userToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []); // זה יקרה פעם אחת בעת טעינת ה-Component

    return (
        <Router>
            <div>
                {token && <NavBar />}
                <Routes>
                    {/* אם אין token, מציג את דף ההתחברות */}
                    {!token ? (
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                    ) : (
                        <Route path="/" element={<Home />} />
                    )}
                    {/* נתיב לבדוק אם השרת פועל */}
                    <Route path="/check-server" element={<ServerCheck />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

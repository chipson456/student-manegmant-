import React from 'react';
import './Home.css';

const Home = () => {
    const handleFileUpload = (type) => {
        alert(`Uploading ${type}`);
    };

    return (
        <div className="home">
            <div className="box" onClick={() => handleFileUpload('file')}>Upload File</div>
            <div className="box" onClick={() => handleFileUpload('image')}>Upload Image</div>
            <div className="box" onClick={() => handleFileUpload('project book')}>Submit Project Book</div>
        </div>
    );
};

export default Home;

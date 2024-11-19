import React from 'react';

const Dashboard = ({ title, children }) => {
    return (
        <div className="dashboard">
            <center><h1 className="title-box">{title}</h1></center>
            <nav>
                {/* Aquí puedes agregar enlaces de navegación, si es necesario */}
            </nav>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Dashboard;

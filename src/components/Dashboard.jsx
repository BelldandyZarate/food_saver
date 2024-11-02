import React from 'react';

const Dashboard = ({ title, children }) => {
    return (
        <div className="dashboard">
            <h1>{title}</h1>
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

import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
    );
};
export default StatCard;

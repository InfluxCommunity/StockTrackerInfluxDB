import React from 'react';

const StockDataTable = ({ data }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border">Price</th>
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 10).map((item, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border">{item.date}</td>
            <td className="px-4 py-2 border">{item.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockDataTable;
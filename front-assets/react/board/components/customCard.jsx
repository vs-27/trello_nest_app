import React, { useState } from "react";
import CardModal from "./cardModal";
import "./app.less"; // Import LESS styles

const CustomCard = ({ id, title, description, link, type, files, startDate, endDate, estimation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="custom-card">
      <h3>{title}</h3>
      <p>{description}</p>
      
      <div className="card-actions">
        <button className="link-btn" onClick={() => setIsModalOpen(true)}>🔗</button>
        <button className="delete-btn">🗑</button>
      </div>
      
      {/* Popup Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={{ id, title, description, link, type, files, startDate, endDate, estimation }}
      />
    </div>
  );
};

export default CustomCard;

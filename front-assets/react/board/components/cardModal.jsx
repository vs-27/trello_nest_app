import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { RequestServerService } from '../../../basic/services/requestServerService';
import "./app.less";

const requestService = new RequestServerService();
const CardModal = ({ isOpen, onClose, card }) => {
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const getCardVal = (key, defaultValue = '') => {
    return card && card[key] ? card[key] : defaultValue;
  };
  
  useEffect(() => {
    if (!initialized && card) {
      setInitialized(true);
      setFormData({
        title: getCardVal('title'),
        description: getCardVal('description'),
        link: getCardVal('link'),
        type: getCardVal('type'),
        files: getCardVal('files', []),
        startDate: getCardVal('startDate', null),
        endDate: getCardVal('endDate', null),
        estimation: getCardVal('estimation', null),
      });
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestService.post(`/tasks`, formData);
      onClose();
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="card-modal">
      <h2>{card && card.id ? "Edit Card" : "Create Card"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
        
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
        
        <label>Link:</label>
        <input type="text" name="link" value={formData.link} onChange={handleChange} />
        
        <label>Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="feature">Feature</option>
          <option value="bug">Bug</option>
          <option value="task">Task</option>
        </select>
        
        <label>Attachments:</label>
        <input type="file" multiple onChange={handleFileChange} />
        <ul>
          {formData.files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
        
        <label>Start Date:</label>
        <DatePicker selected={formData.startDate} onChange={(date) => setFormData((prev) => ({ ...prev, startDate: date }))} />
        
        <label>End Date:</label>
        <DatePicker selected={formData.endDate} onChange={(date) => setFormData((prev) => ({ ...prev, endDate: date }))} />
        
        <label>Estimation (hours):</label>
        <input type="number" name="estimation" value={formData.estimation} onChange={handleChange} />
        
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default CardModal;

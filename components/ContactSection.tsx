'use client';

import React, { useState } from 'react';
import { Send, MessageSquare, AtSign, Phone, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-heading mb-4">Get in Touch</h2>
                <p className="text-brown-700 mb-6">
                  Have questions or feedback? We'd love to hear from you. Fill out the form
                  and our team will respond as soon as possible.
                </p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-brown-100 p-3 rounded-full mr-4">
                    <MessageSquare className="h-5 w-5 text-brown-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">Send us a message</h3>
                    <p className="text-brown-600">We'll respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brown-100 p-3 rounded-full mr-4">
                    <AtSign className="h-5 w-5 text-brown-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">Email Us</h3>
                    <p className="text-brown-600">hello@beanhavencafe.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brown-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-brown-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">Call Us</h3>
                    <p className="text-brown-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-brown-100 p-3 rounded-full mr-4">
                    <Briefcase className="h-5 w-5 text-brown-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-brown-800 mb-1">Join Our Team</h3>
                    <p className="text-brown-600">careers@beanhavencafe.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cream-50 p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-brown-700 mb-1">Your Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-brown-700 mb-1">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-brown-700 mb-1">Subject</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="input" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">Your Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} className="input" required></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full btn btn-primary flex justify-center items-center">
                  <Send className="h-5 w-5 mr-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;

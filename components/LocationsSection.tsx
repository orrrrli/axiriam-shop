'use client';

import React, { useState } from 'react';
import { MapPin, Clock, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const locations = [
  { id: 1, name: "Bean Haven Downtown", address: "123 Main Street", city: "New York, NY 10001", hours: "Mon-Fri: 6am-8pm, Sat-Sun: 7am-6pm", phone: "(212) 555-1234", image: "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" },
  { id: 2, name: "Bean Haven Harborside", address: "456 Harbor View", city: "San Francisco, CA 94105", hours: "Mon-Fri: 6am-7pm, Sat-Sun: 8am-5pm", phone: "(415) 555-6789", image: "https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" },
  { id: 3, name: "Bean Haven Lakeside", address: "789 Lake Shore Drive", city: "Chicago, IL 60611", hours: "Mon-Sun: 7am-7pm", phone: "(312) 555-4321", image: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" }
];

const LocationsSection = () => {
  const [expandedLocation, setExpandedLocation] = useState<number | null>(null);
  
  const toggleLocation = (id: number) => {
    setExpandedLocation(expandedLocation === id ? null : id);
  };

  return (
    <div id="locations" className="section-padding bg-cream-100">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">Visit Our Locations</h2>
          <p className="text-brown-700">
            Find your nearest Bean Haven Café and experience our warm hospitality and premium coffee in person.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 overflow-hidden">
                <img src={location.image} alt={location.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-medium mb-3">{location.name}</h3>
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 text-brown-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-brown-800">{location.address}</p>
                    <p className="text-brown-600">{location.city}</p>
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${expandedLocation === location.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-2 pb-4">
                    <div className="flex items-start mb-3">
                      <Clock className="h-5 w-5 text-brown-600 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-brown-800">{location.hours}</p>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-brown-600 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-brown-800">{location.phone}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="mt-3 flex items-center text-brown-600 hover:text-brown-800 transition-colors duration-300"
                  onClick={() => toggleLocation(location.id)}
                  aria-label={`Toggle details for ${location.name}`}
                >
                  <span className="mr-2">{expandedLocation === location.id ? 'Less Info' : 'More Info'}</span>
                  {expandedLocation === location.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;

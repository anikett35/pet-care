// src/components/AdoptionSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Phone, Calendar, FileText, Home } from 'lucide-react';

const AdoptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { petName, applicationId } = location.state || {};

  const nextSteps = [
    {
      icon: Mail,
      title: 'Application Review',
      description: 'Our team will review your application within 2-3 business days',
      timeline: '1-3 days'
    },
    {
      icon: Phone,
      title: 'Phone Interview',
      description: 'We will contact you for a brief phone interview to discuss your application',
      timeline: '3-5 days'
    },
    {
      icon: Home,
      title: 'Home Visit (if required)',
      description: 'For some pets, we may schedule a virtual or in-person home visit',
      timeline: '5-7 days'
    },
    {
      icon: FileText,
      title: 'Final Approval',
      description: 'Once approved, we will schedule the adoption paperwork and pickup',
      timeline: '7-10 days'
    },
    {
      icon: Calendar,
      title: 'Adoption Day!',
      description: 'Come meet your new family member and complete the adoption process',
      timeline: '10-14 days'
    }
  ];

  if (!petName || !applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Application data not found</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Adoption
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-xl text-green-300 mb-2">
            You've applied to adopt <span className="font-semibold">{petName}</span>
          </p>
          <p className="text-gray-400">
            Application ID: <span className="font-mono text-green-400">{applicationId}</span>
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-400" />
              Contact Information
            </h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Email:</strong> adoptions@petcarepro.com</p>
              <p><strong>Phone:</strong> (555) 123-ADOPT</p>
              <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-yellow-400" />
              Required Documents
            </h3>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Government-issued ID</li>
              <li>Proof of address</li>
              <li>Proof of income (if renting)</li>
              <li>Veterinary records (if applicable)</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate('/adoption')}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 mr-4"
          >
            Browse More Pets
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Confirmation Email Note */}
        <div className="text-center mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/50">
          <p className="text-green-300">
            📧 A confirmation email has been sent to your email address with all application details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdoptionSuccess;
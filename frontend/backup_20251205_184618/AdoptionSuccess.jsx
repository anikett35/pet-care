// src/components/AdoptionSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Home, 
  Heart,
  Clock,
  Users,
  Shield,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

const AdoptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { petName, applicationId } = location.state || {};

  const nextSteps = [
    {
      icon: FileText,
      title: 'Application Review',
      description: 'Our adoption team will carefully review your application and verify all information',
      timeline: '1-3 business days',
      status: 'pending',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Phone,
      title: 'Phone Interview',
      description: 'A friendly chat to discuss your application and answer any questions you may have',
      timeline: '3-5 business days',
      status: 'upcoming',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Reference Check',
      description: 'We will contact your references to learn more about you as a potential pet parent',
      timeline: '5-7 business days',
      status: 'upcoming',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Home,
      title: 'Home Assessment',
      description: 'Virtual or in-person visit to ensure a safe and loving environment for the pet',
      timeline: '7-10 business days',
      status: 'upcoming',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Shield,
      title: 'Final Approval',
      description: 'Complete the adoption paperwork and schedule your new pet pickup',
      timeline: '10-14 business days',
      status: 'upcoming',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Heart,
      title: 'Adoption Day!',
      description: 'The exciting day you welcome your new family member home',
      timeline: '14+ business days',
      status: 'upcoming',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const resources = [
    {
      title: 'New Pet Preparation Guide',
      description: 'Everything you need to prepare your home for your new pet',
      icon: FileText
    },
    {
      title: 'Pet Care Essentials Checklist',
      description: 'Shopping list for all the supplies you will need',
      icon: CheckCircle
    },
    {
      title: 'First Week Guide',
      description: 'Tips for helping your new pet adjust to their new home',
      icon: Home
    }
  ];

  const handleDownloadApplication = () => {
    // In a real app, this would download the application PDF
    alert('Application summary downloaded!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My Adoption Application for ${petName}`,
        text: `I just applied to adopt ${petName} through PetCare Pro!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!petName || !applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <CheckCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Application Data Not Found</h2>
          <p className="text-purple-300 mb-6">Please submit an adoption application first.</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Browse Adoptable Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/adoption')}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Adoption
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Submitted!</span>
            </h1>
            <p className="text-purple-300 text-lg">
              You're one step closer to welcoming {petName} home
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Success Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Congratulations!
              </h2>
              <p className="text-xl text-purple-300 mb-2">
                You've applied to adopt <span className="font-bold text-white">{petName}</span>
              </p>
              <div className="bg-gray-700/50 rounded-xl p-4 inline-block mb-6">
                <p className="text-gray-400 text-sm">Application ID</p>
                <p className="text-green-400 font-mono text-lg font-bold">{applicationId}</p>
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleDownloadApplication}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Download Summary
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Next Steps Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-purple-400" />
                Adoption Process Timeline
              </h2>
              
              <div className="space-y-6">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCurrent = step.status === 'pending';
                  
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      {/* Timeline connector */}
                      {index < nextSteps.length - 1 && (
                        <div className="absolute left-8 top-16 w-0.5 h-12 bg-purple-500/30 ml-4"></div>
                      )}
                      
                      {/* Step number */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {index + 1}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 bg-gray-700/50 rounded-xl p-4 border border-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isCurrent 
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-gray-600 text-gray-400 border border-gray-500/30'
                          }`}>
                            {step.timeline}
                          </span>
                        </div>
                        <p className="text-purple-300 text-sm">{step.description}</p>
                        
                        {isCurrent && (
                          <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <p className="text-purple-400 text-sm font-semibold">
                              ⏳ Currently in this stage
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">Helpful Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <div key={index} className="bg-gray-700/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <Icon className="h-8 w-8 text-purple-400 mb-3" />
                      <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                      <p className="text-purple-300 text-sm">{resource.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-400" />
                Contact Our Team
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" />
                  <span>adoptions@petcarepro.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2 text-green-400" />
                  <span>(555) 123-ADOPT</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-purple-400" />
                  <span>Mon-Fri 9AM-6PM EST</span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-yellow-400" />
                Prepare These Documents
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Government-issued photo ID',
                  'Proof of current address',
                  'Landlord approval letter (if renting)',
                  'Veterinary records (current pets)',
                  'Proof of income (if required)'
                ].map((doc, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Next Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/adoption')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Browse More Pets
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Confirmation Notice */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">Confirmation Sent</p>
                  <p className="text-green-300 text-xs">
                    We've emailed your application details and next steps to your registered email address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionSuccess;
// src/components/PetDetail.jsx
import { useState, useEffect, useCallback } from 'react';

// ====================================================================
// --- Utility Components for Modularity and Reusability ---
// ====================================================================

// Reusable Input Field for Forms
const FormInput = ({ label, name, type = "text", placeholder, required = false, rows = 1, className = '' }) => {
  const isTextarea = rows > 1;
  const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea 
          id={name} 
          name={name} 
          placeholder={placeholder} 
          rows={rows} 
          required={required}
          className={`${inputClasses} ${className}`}
        ></textarea>
      ) : (
        <input 
          id={name} 
          type={type} 
          name={name} 
          placeholder={placeholder} 
          required={required}
          className={`${inputClasses} ${className}`}
        />
      )}
    </div>
  );
};

// Reusable Card for Medical/Vaccination/Medication Records
const DetailCard = ({ children, title, date, nextDue, isAlert = false }) => {
  const alertClasses = isAlert 
    ? "border-yellow-400 bg-yellow-50 shadow-lg" 
    : "border-gray-200 bg-white hover:shadow-md";

  return (
    <div className={`border-l-4 ${isAlert ? 'border-red-500' : 'border-blue-500'} rounded-r-xl p-4 shadow-sm transition duration-200 ${alertClasses}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
        <div className="text-right">
          {date && (
            <div className="text-xs text-gray-500 font-medium">
              Recorded: {new Date(date).toLocaleDateString()}
            </div>
          )}
          {nextDue && (
            <div className={`text-xs font-bold mt-1 ${isAlert ? 'text-red-600' : 'text-orange-500'}`}>
              Due: {new Date(nextDue).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

// Status Badge
const StatusBadge = ({ label, color }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
    </span>
);

const PetDetailItem = ({ label, value, icon, className = '' }) => (
  <div className={`space-y-1 p-3 bg-white rounded-lg border border-gray-100 shadow-sm ${className}`}>
    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
      <span className="text-sm">{icon}</span> {label}
    </label>
    <p className="text-gray-800 font-semibold text-sm">{value}</p>
  </div>
);

const LoadingScreen = ({ message }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
);

const ErrorScreen = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-md">
        <p className="text-2xl font-bold text-red-600 mb-4">🚨 Error</p>
        <p className="text-lg text-gray-700 mb-6">{message}</p>
        <button 
          onClick={onClose} 
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
);

const HeaderWithButton = ({ title, onClick, buttonLabel }) => (
    <div className="flex justify-between items-center mb-6 sticky top-0 pt-1 pb-4 bg-white z-10 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition duration-200 shadow-md"
            onClick={onClick}
        >
            {buttonLabel}
        </button>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="text-center bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">{message}</p>
    </div>
);

// ====================================================================
// --- Main PetDetail Component ---
// ====================================================================

const PetDetail = ({ petId, onClose }) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(null);

  // Use useCallback for fetch function to stabilize the useEffect dependency
  const fetchPet = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call delay for better UX demonstration
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`);
      if (!response.ok) throw new Error('Pet not found or server error');
      
      const data = await response.json();
      setPet(data);
    } catch (err) {
      console.error('Error fetching pet:', err);
      // setPet(null); // Keep pet as null to show error UI
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);
  
  // --- Handler Functions ---
  const createHandler = (endpoint, successCallback) => async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Basic date parsing to ensure structure before sending
    ['date', 'nextDue', 'startDate', 'endDate'].forEach(key => {
        if (data[key] === '') delete data[key];
    });

    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save record.');
      
      const updated = await response.json();
      setPet(updated);
      setShowAddForm(null);
      e.target.reset();
      
      if (successCallback) successCallback(updated);
    } catch (err) {
      console.error(`Error adding to ${endpoint}:`, err);
      alert('Error saving record. Check console for details.');
    }
  };

  const handleAddMedical = createHandler('medical-history');
  const handleAddVaccination = createHandler('vaccinations');
  const handleAddMedication = createHandler('medications');


  // --- Render Functions for Forms and Tabs ---

  const renderAddForm = (type) => {
    const isMedical = type === 'medical';
    const isVaccination = type === 'vaccination';
    const isMedication = type === 'medication';
    const handler = isMedical ? handleAddMedical : isVaccination ? handleAddVaccination : handleAddMedication;

    return (
      <form onSubmit={handler} className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl mb-6 shadow-inner space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h4 className="text-xl font-bold text-blue-800 md:col-span-2">Add New {type.charAt(0).toUpperCase() + type.slice(1)} Record</h4>
        
        {isMedical && (
          <>
            <FormInput label="Visit Date" name="date" type="date" required />
            <FormInput label="Diagnosis" name="diagnosis" placeholder="Fever, Broken Leg, Routine Checkup..." required />
            <FormInput label="Treatment/Procedure" name="treatment" placeholder="Antibiotics, Surgery, Worming..." />
            <FormInput label="Veterinarian" name="veterinarian" placeholder="Dr. Jane Smith" />
            <FormInput label="Notes" name="notes" placeholder="Detailed notes on visit and pet status." rows={3} className="md:col-span-2" />
          </>
        )}

        {isVaccination && (
          <>
            <FormInput label="Vaccine Name" name="name" placeholder="Rabies, DHLPP, Feline Flu..." required />
            <FormInput label="Date Given" name="date" type="date" required />
            <FormInput label="Next Due Date" name="nextDue" type="date" placeholder="Optional" />
            <FormInput label="Veterinarian" name="veterinarian" placeholder="Dr. Smith" />
          </>
        )}

        {isMedication && (
          <>
            <FormInput label="Medication Name" name="name" placeholder="Flea & Tick, Pain Killer..." required />
            <FormInput label="Dosage" name="dosage" placeholder="5mg, 1 tablet" />
            <FormInput label="Frequency" name="frequency" placeholder="Once daily, Every 12 hours" />
            <FormInput label="Start Date" name="startDate" type="date" />
            <FormInput label="End Date" name="endDate" type="date" />
            <FormInput label="Notes" name="notes" placeholder="Special instructions or side effects." rows={2} className="md:col-span-2" />
          </>
        )}
        
        <div className="flex gap-3 md:col-span-2 pt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition duration-200 shadow-md">
            Save Record
          </button>
          <button type="button" onClick={() => setShowAddForm(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold transition duration-200">
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const renderTabContent = () => {
    if (!pet) return null;
    const now = new Date();

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Basic Information */}
            <section className="p-4 border border-gray-100 rounded-xl bg-gray-50/70">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Core Profile</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <PetDetailItem label="Species" value={pet.species} icon="🐾" />
                <PetDetailItem label="Breed" value={pet.breed || 'Mixed/N/A'} icon="🧬" />
                <PetDetailItem label="Color" value={pet.color || 'N/A'} icon="🎨" />
                <PetDetailItem label="Age" value={`${pet.age} years`} icon="🎂" />
                <PetDetailItem label="Gender" value={pet.gender} icon="⚧" />
                <PetDetailItem label="Weight" value={pet.weight ? `${pet.weight} kg` : 'N/A'} icon="⚖️" />
                <PetDetailItem label="Microchip ID" value={pet.chipId || 'N/A'} icon="🆔" />
                <PetDetailItem label="Neutered/Spayed" value={pet.neutered ? 'Yes' : 'No'} icon="✂️" />
              </div>
            </section>

            {/* Owner Information */}
            {pet.owner && (
              <section className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/50">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PetDetailItem label="Name" value={pet.owner.name} icon="👤" />
                  <PetDetailItem label="Email" value={pet.owner.email} icon="📧" />
                  <PetDetailItem label="Phone" value={pet.owner.phone} icon="📞" />
                  <PetDetailItem label="Address" value={pet.owner.address} icon="🏠" className="md:col-span-2" />
                </div>
              </section>
            )}

            {/* Notes */}
            {pet.notes && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-2">General Notes</h3>
                <p className="text-gray-700 bg-gray-100 p-4 rounded-xl shadow-inner whitespace-pre-wrap">{pet.notes}</p>
              </section>
            )}
          </div>
        );

      case 'medical':
        return (
          <div>
            <HeaderWithButton title="Medical History" onClick={() => setShowAddForm('medical')} buttonLabel="+ Add Record" />
            {showAddForm === 'medical' && renderAddForm('medical')}
            <div className="space-y-4">
              {pet.medicalHistory?.length > 0 ? (
                // Sort by date descending
                pet.medicalHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((record, idx) => (
                  <DetailCard key={idx} title={record.diagnosis} date={record.date} isAlert={false}>
                    <p className="text-sm text-gray-700"><strong>Treatment:</strong> {record.treatment || 'N/A'}</p>
                    {record.veterinarian && <p className="text-sm text-gray-600"><strong>Vet:</strong> {record.veterinarian}</p>}
                    {record.notes && <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded">{record.notes}</p>}
                  </DetailCard>
                ))
              ) : (
                <EmptyState message="No medical history recorded. Add the first visit record above." />
              )}
            </div>
          </div>
        );

      case 'vaccinations':
        return (
          <div>
            <HeaderWithButton title="Vaccinations" onClick={() => setShowAddForm('vaccination')} buttonLabel="+ Add Vaccination" />
            {showAddForm === 'vaccination' && renderAddForm('vaccination')}
            <div className="space-y-4">
              {pet.vaccinations?.length > 0 ? (
                pet.vaccinations.sort((a, b) => new Date(b.date) - new Date(a.date)).map((vacc, idx) => {
                  const nextDueDate = vacc.nextDue ? new Date(vacc.nextDue) : null;
                  const isDue = nextDueDate && nextDueDate < now;
                  const isDueSoon = nextDueDate && nextDueDate > now && nextDueDate < new Date(Date.now() + 86400000 * 60); // Due in < 60 days
                  
                  let alertStatus = false;
                  if (isDue || isDueSoon) alertStatus = true;

                  return (
                    <DetailCard key={idx} title={vacc.name} date={vacc.date} nextDue={vacc.nextDue} isAlert={alertStatus}>
                      {vacc.veterinarian && <p className="text-sm text-gray-600"><strong>Vet:</strong> {vacc.veterinarian}</p>}
                      {isDue && <StatusBadge label="OVERDUE" color="bg-red-600 text-white mt-2" />}
                      {isDueSoon && !isDue && <StatusBadge label="DUE SOON" color="bg-orange-400 text-white mt-2" />}
                    </DetailCard>
                  );
                })
              ) : (
                <EmptyState message="No vaccinations recorded. Add a new vaccination record." />
              )}
            </div>
          </div>
        );

      case 'medications':
        return (
          <div>
            <HeaderWithButton title="Medications" onClick={() => setShowAddForm('medication')} buttonLabel="+ Add Medication" />
            {showAddForm === 'medication' && renderAddForm('medication')}
            <div className="space-y-4">
              {pet.medications?.length > 0 ? (
                pet.medications.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((med, idx) => {
                  const isActive = !med.endDate || new Date(med.endDate) > now;
                  return (
                    <DetailCard key={idx} title={med.name} isAlert={isActive}>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>Dosage:</strong> {med.dosage || 'N/A'}</p>
                        <p><strong>Frequency:</strong> {med.frequency || 'N/A'}</p>
                        <p>
                          <strong>Period:</strong> {med.startDate ? new Date(med.startDate).toLocaleDateString() : 'N/A'} 
                          {med.endDate ? ` - ${new Date(med.endDate).toLocaleDateString()}` : ' - Ongoing'}
                        </p>
                        {med.notes && <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded">{med.notes}</p>}
                      </div>
                      <StatusBadge label={isActive ? 'ACTIVE' : 'COMPLETED'} color={isActive ? 'bg-green-500 text-white mt-2' : 'bg-gray-300 text-gray-700 mt-2'} />
                    </DetailCard>
                  );
                })
              ) : (
                <EmptyState message="No medications recorded. Add a new medication prescription." />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };


  // --- Render (Loading/Error/Main Modal) ---

  if (loading) return <LoadingScreen message="Fetching detailed pet profile..." />;
  if (!pet) return <ErrorScreen message="Pet not found or API error." onClose={onClose} />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Header and Avatar */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 sticky top-0 bg-white z-20">
          <div className="flex items-start space-x-5">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center overflow-hidden border border-blue-200 shadow-inner flex-shrink-0">
              {pet.imageUrl ? (
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl text-blue-600">🐾</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{pet.name}</h1>
              <p className="text-lg text-gray-600 font-medium">{pet.species} ({pet.breed || 'Mixed'})</p>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{pet.age} years</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{pet.gender}</span>
                {pet.weight && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{pet.weight} kg</span>}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition duration-200"
            aria-label="Close Pet Detail"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 sticky top-[92px] bg-white z-10">
          <div className="flex space-x-8 px-6 overflow-x-auto">
            {['overview', 'medical', 'vaccinations', 'medications'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 font-semibold text-base border-b-4 whitespace-nowrap transition duration-200 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => { setActiveTab(tab); setShowAddForm(null); }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderTabContent()}
        </div>
        
      </div>
    </div>
  );
};

export default PetDetail;
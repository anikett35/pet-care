// src/components/PetCard.jsx
import { Link } from 'react-router-dom';

const PetCard = ({ pet, onDelete }) => {
  // Helper to determine config (Icon/Color) based on species
  const speciesConfig = {
    Dog: { emoji: '🐶', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
    Cat: { emoji: '🐱', color: 'bg-purple-600', hoverColor: 'hover:bg-purple-700' },
    Bird: { emoji: '🐦', color: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
    Fish: { emoji: '🐠', color: 'bg-cyan-600', hoverColor: 'hover:bg-cyan-700' },
    Rabbit: { emoji: '🐰', color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700' },
    Other: { emoji: '🐾', color: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' }
  };
  
  const config = speciesConfig[pet.species] || speciesConfig.Other;

  const calculateAge = (age) => {
    if (!age) return 'Age unknown';
    return age === 1 ? '1 year' : `${age} years`;
  };

  const PetBadge = ({ children, colorClass }) => (
    <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${colorClass}`}>
      {children}
    </span>
  );

  const PetDetail = ({ icon, label, value }) => (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );

  const PetStat = ({ count, label, color }) => (
    <div className="text-center p-1">
      <span className={`block text-xl font-extrabold ${color} leading-none`}>
        {count}
      </span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );

  const PetActionButton = ({ icon, label, onClick, colorClass, title }) => (
    <button 
      className={`flex-1 flex items-center justify-center p-3 rounded-xl text-sm font-medium transition duration-200 ${colorClass}`}
      onClick={onClick}
      title={title || label}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );

  return (
    // Enhanced Card Container: Better shadow, improved hover effect (Scale + Shadow)
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] transform overflow-hidden flex flex-col h-full">
      
      {/* 1. Image/Avatar Section */}
      <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {pet.imageUrl ? (
          <img 
            src={pet.imageUrl} 
            alt={pet.name} 
            className="w-full h-full object-cover transition duration-300 hover:opacity-90"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <span className={`text-7xl mb-2 text-gray-400`}>{config.emoji}</span>
            <span className="text-gray-500 text-sm font-medium">No Image</span>
          </div>
        )}
        
        {/* Species Tag */}
        <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-semibold shadow-md text-white ${config.color}`}>
            {pet.species}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Name and Basic Info */}
        <div className="mb-4">
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
            {pet.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {pet.breed && (
              <PetBadge colorClass="bg-indigo-100 text-indigo-800">
                {pet.breed}
              </PetBadge>
            )}
            {pet.gender && (
              <PetBadge colorClass={pet.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}>
                {pet.gender}
              </PetBadge>
            )}
          </div>
        </div>

        {/* 3. Core Details */}
        <div className="space-y-2 mb-5 p-3 rounded-lg border border-gray-100 bg-gray-50">
          <PetDetail icon="⏰" label="Age" value={calculateAge(pet.age)} />
          {pet.weight && <PetDetail icon="⚖️" label="Weight" value={`${pet.weight} kg`} />}
          {pet.chipId && <PetDetail icon="🆔" label="Chip ID" value={pet.chipId} />}
        </div>
        
        {/* 4. Owner Info */}
        {pet.owner?.name && (
          <div className="mb-5 pt-3 border-t border-gray-100">
             <p className="text-sm font-semibold text-gray-800 mb-1">
               Owner: <span className="font-normal text-gray-600">{pet.owner.name}</span>
             </p>
             {pet.owner.phone && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-base">📞</span> {pet.owner.phone}
              </p>
             )}
          </div>
        )}


        {/* 5. Stat Summary - More Visual */}
        <div className="grid grid-cols-3 gap-2 mb-6 pt-3 border-t border-gray-100">
          <PetStat count={pet.vaccinations?.length || 0} label="Vaccines" color="text-green-600" />
          <PetStat count={pet.appointments?.length || 0} label="Appts" color="text-orange-600" />
          <PetStat count={pet.medications?.length || 0} label="Meds" color="text-purple-600" />
        </div>

        {/* 6. Action Buttons */}
        <div className="flex gap-3 mt-auto">
          {/* Main Action - View Details */}
          <Link 
            to={`/pets/${pet._id}`}
            className={`flex-1 flex items-center justify-center ${config.color} ${config.hoverColor} text-white py-3 rounded-xl text-base font-semibold transition duration-200 shadow-lg`}
          >
            View Profile
          </Link>
          {/* Secondary Actions - Compressed into icons */}
          <PetActionButton 
            icon="✏️" 
            label="Edit" 
            colorClass="bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={() => console.log('Edit clicked')}
            title="Edit Pet Details"
          />
          <PetActionButton 
            icon="🗑️" 
            label="Delete" 
            colorClass="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onDelete(pet._id)}
            title="Delete Pet"
          />
        </div>
      </div>
    </div>
  );
};

export default PetCard;
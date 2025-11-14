// src/components/PetForm.jsx
import { useState } from 'react';

/**
 * Utility function to convert a comma/newline separated string into an array of trimmed strings.
 * @param {string} text - The raw string input from a textarea.
 * @returns {string[]} - Array of non-empty, trimmed strings.
 */
const parseListInput = (text) => {
  if (!text) return [];
  // Split by comma or newline, then filter out empty strings
  return text.split(/[,\n]/)
             .map(item => item.trim())
             .filter(item => item.length > 0);
};


const PetForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    color: '',
    // Use multi-line strings for these inputs
    allergies: '',
    medications: '', 
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // --- Client-side Validation ---
      if (!formData.name.trim()) {
        throw new Error('Pet name is required');
      }
      if (!formData.species) {
        throw new Error('Species is required');
      }

      // --- Data Transformation for API ---
      // Parse the multi-line/comma-separated strings into arrays of names/strings
      const parsedAllergies = parseListInput(formData.allergies);
      const parsedMedications = parseListInput(formData.medications);

      // The backend expects an array of medication objects with a 'name' property, 
      // but the form only collects simple names. We map the simple strings to the required structure.
      const apiMedications = parsedMedications.map(medName => ({
        name: medName,
        // The backend schema requires 'dosage' and 'frequency' but they are not collected 
        // in this simple form, so we provide defaults to avoid validation errors if possible.
        dosage: 'N/A', 
        frequency: 'N/A'
      }));

      const apiData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim() || undefined,
        // Convert empty string/invalid input to 0 or undefined for numerical fields
        age: formData.age ? parseInt(formData.age) : undefined, 
        gender: formData.gender,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        color: formData.color.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        
        // Use the parsed arrays
        allergies: parsedAllergies, 
        medications: apiMedications,

        // Initialize empty arrays for other collections expected by the backend
        medicalHistory: [], 
        vaccinations: [],
        appointments: []
      };

      // Remove undefined values to send cleaner JSON
      Object.keys(apiData).forEach(key => apiData[key] === undefined && delete apiData[key]);

      console.log('Sending data to API:', apiData);

      // --- API Call ---
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create pet';
        try {
          const errorData = await response.json();
          // Extract general message or join validation errors
          errorMessage = errorData.message || errorMessage;
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors).map(err => err.message).join('; ');
            errorMessage = `Validation failed: ${validationErrors}`;
          }
        } catch (parseError) {
          errorMessage = `${response.status} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const newPet = await response.json();
      console.log('Pet created successfully:', newPet);

      // --- Success Cleanup ---
      // Reset form
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        color: '',
        allergies: '',
        medications: '',
        notes: ''
      });

      // Notify parent component
      if (onSuccess) {
        onSuccess(newPet);
      }

    } catch (err) {
      console.error('Error creating pet:', err);
      // Ensure the error message is clean
      setError(err.message || 'An unknown error occurred.'); 
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Register New Pet 🐾</h2>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 transition-all duration-300">
          <p className="text-red-800 text-sm font-medium">⚠️ Registration Failed</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pet Name (required) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="Enter pet name"
            required
          />
        </div>

        {/* Species (required) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Species <span className="text-red-500">*</span></label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            required
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="e.g., Golden Retriever"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="0"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="200"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="e.g., 25.5"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="e.g., Brown, White"
          />
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Allergies (Separate with commas or new lines)</label>
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          rows="2"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="e.g., pollen, chicken, certain medications"
        />
      </div>

      {/* Medications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications (Separate with commas or new lines)</label>
        <textarea
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          rows="2"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="e.g., monthly flea treatment, anti-anxiety medicine"
        />
        <p className="text-xs text-gray-500 mt-1">
          Each item will be saved as a basic medication record.
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="Any additional information about your pet, like temperament or special needs."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold transition duration-200 shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Adding Pet...
            </span>
          ) : 'Add Pet'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition duration-200"
        >
          Cancel
        </button>
      </div>

      {/* Removed the Debug info block */}
    </form>
  );
};

export default PetForm;
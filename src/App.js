import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);
  const [currentSchema, setCurrentSchema] = useState('');

  const handleAddSchema = () => {
    const schema = availableSchemas.find(item => item.value === currentSchema);
    if (schema) {
      setSelectedSchemas([...selectedSchemas, schema]);
      setAvailableSchemas(availableSchemas.filter(item => item.value !== currentSchema));
      setCurrentSchema('');
    }
  };

  const handleSchemaChange = (index, newSchemaValue) => {
    const newSchema = availableSchemas.find(item => item.value === newSchemaValue);
    if (newSchema) {
      const updatedSelectedSchemas = selectedSchemas.map((schema, idx) => 
        idx === index ? newSchema : schema
      );
      const restoredSchema = selectedSchemas[index];
      setSelectedSchemas(updatedSelectedSchemas);
      setAvailableSchemas([
        ...availableSchemas,
        restoredSchema
      ].filter(item => item.value !== newSchemaValue));
    }
  };

  const handleSaveSegment = async () => {
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };
  
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://webhook.site/0b41dc3b-69f9-422d-b574-11aef477a097', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }
  
      alert('Segment saved successfully');
      setShowPopup(false);
      setSegmentName('');
      setSelectedSchemas([]);
      setAvailableSchemas([
        { label: 'First Name', value: 'first_name' },
        { label: 'Last Name', value: 'last_name' },
        { label: 'Gender', value: 'gender' },
        { label: 'Age', value: 'age' },
        { label: 'Account Name', value: 'account_name' },
        { label: 'City', value: 'city' },
        { label: 'State', value: 'state' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)}>Save segment</button>
      {showPopup && (
        <div className="popup">
          <h2>Saving Segment</h2>
          <input
            type="text"
            placeholder="Name of the segment"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          <div className="schema-container">
            {selectedSchemas.map((schema, index) => (
              <select
                key={index}
                value={schema.value}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
              >
                {availableSchemas.concat(schema).map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
            ))}
          </div>
          <select
            value={currentSchema}
            onChange={(e) => setCurrentSchema(e.target.value)}
          >
            <option value="" disabled>Select a schema</option>
            {availableSchemas.map((schema, idx) => (
              <option key={idx} value={schema.value}>{schema.label}</option>
            ))}
          </select>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleAddSchema();
            }}
          >
            +Add new schema
          </a>
          <button onClick={handleSaveSegment}>Save the Segment</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default App;
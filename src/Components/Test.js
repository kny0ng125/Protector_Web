import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import API_BASE_URL from './Config';

const Test = () => {
  const { authFetch } = useContext(AuthContext);
  const [patientIdentifierSubmit, setPatientIdentifierSubmit] = useState('');
  const [patientIdentifierDelete, setPatientIdentifierDelete] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [deleteResponse, setDeleteResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const response = await authFetch(`${API_BASE_URL}/doctor/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ 'uuid': patientIdentifierSubmit }),  // 올바른 본문 구조
      });

      setResponse(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    setError(null);
    setDeleteResponse(null);

    try {
      const response = await authFetch(`${API_BASE_URL}/doctor/patient/${patientIdentifierDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      setDeleteResponse(response.data);
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Submit Patient Identifier</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={patientIdentifierSubmit}
          onChange={(e) => setPatientIdentifierSubmit(e.target.value)}
          placeholder="Enter patient identifier"
        />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      <h1>Delete Patient Identifier</h1>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          value={patientIdentifierDelete}
          onChange={(e) => setPatientIdentifierDelete(e.target.value)}
          placeholder="Enter patient identifier to delete"
        />
        <button type="submit">Delete</button>
      </form>
      {deleteResponse && (
        <div>
          <h2>Delete Response</h2>
          <pre>{JSON.stringify(deleteResponse, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Test;

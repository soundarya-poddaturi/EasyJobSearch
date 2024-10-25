import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageRecords = ({ recordType, initialRecords, email, apiEndpoint, fields }) => {
    const [records, setRecords] = useState(initialRecords || []);
    const [newRecord, setNewRecord] = useState(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    const [editRecord, setEditRecord] = useState(null);
    const [showNewRecordForm, setShowNewRecordForm] = useState(false);

    useEffect(() => {
        if (initialRecords) {
            setRecords(initialRecords);
        }
    }, [initialRecords]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (editRecord) {
            setEditRecord({ ...editRecord, [name]: value });
        } else {
            setNewRecord({ ...newRecord, [name]: value });
        }
    };

    const handleAddRecord = async () => {
        try {
            const response = await axios.post(`${apiEndpoint}/${email}/`, newRecord);
            setRecords([...records, { ...newRecord, id: response.data.id }]);
            setNewRecord(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
            setShowNewRecordForm(false);
        } catch (error) {
            console.error(`Error adding ${recordType}:`, error);
        }
    };

    const handleEditRecord = (record) => {
        setEditRecord(record);
        setShowNewRecordForm(false);
    };

    const handleUpdateRecord = async () => {
        try {
            await axios.put(`${apiEndpoint}/${email}/`, {
                ...editRecord,
                id: editRecord.id
            });
            const updatedRecords = records.map((rec) =>
                rec.id === editRecord.id ? editRecord : rec
            );
            setRecords(updatedRecords);
            setEditRecord(null);
        } catch (error) {
            console.error(`Error updating ${recordType}:`, error);
        }
    };

    const handleDeleteRecord = async (id) => {
        try {
            await axios.delete(`${apiEndpoint}/${email}/`, { data: { id } });
            setRecords(records.filter((rec) => rec.id !== id));
        } catch (error) {
            console.error(`Error deleting ${recordType}:`, error);
        }
    };

    return (
        <div className='d-grid bg-light p-4 m-2 '>
            <div className=''>
                <h3 className='text-uppercase text-muted'>{recordType}</h3>
                <button className='btn btn-link' onClick={() => setShowNewRecordForm(!showNewRecordForm)}>
                    {showNewRecordForm ? `Hide New ${recordType} Form` : `Add +`}
                </button>
            </div>

            {showNewRecordForm && (
                <div className='d-flex m-3'>
                    {fields.map((field) => (
                        <input
                            className='form-control me-2 border-0'  // Use form-control for Bootstrap styling
                            key={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={newRecord[field.name]}
                            onChange={handleInputChange}
                        />
                    ))}
                    <button className='btn btn-dark' onClick={handleAddRecord}>Add {recordType}</button>
                </div>
            )}

            <ul className='list-unstyled d-flex justify-content-center align-items-center flex-column'>
                {records.map((rec) => (
                    <li className='fw-bold' key={rec.id}>
                        <div className='d-flex flex-row gap-5 m-2'>
                            <div>
                                <span>
                                    {rec[fields[0].name]} <span className='text-muted'>({rec[fields[1].name]})</span>
                                </span>
                            </div>
                            <div className='btn-group'>
                                <button className='btn btn-sm btn-warning' onClick={() => handleEditRecord(rec)}>Edit</button>
                                <button className='btn btn-sm btn-danger' onClick={() => handleDeleteRecord(rec.id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {editRecord && (
                <div className=' p-3'>
                    <div className='align-items-center d-flex justify-content-center justify-content-evenly border-0 m-4'>
                    {fields.map((field) => (
                        <div className='mb-3' key={field.name}>
                            <label className='form-label'>{field.placeholder}</label>
                            <input
                                className='d-block border-0 p-3 '
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={editRecord[field.name]}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}

                    </div>
                    <div className='d-flex justify-content-end'>
                    <button className='btn btn-sm btn-outline-danger border-0' onClick={() => setEditRecord(null)}>Cancel</button>
                    <button className='btn btn-sm btn-outline-primary border-0' onClick={handleUpdateRecord}>Update {recordType}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRecords;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageRecords = ({ recordType, initialRecords, apiEndpoint, fields }) => {
    const [records, setRecords] = useState(initialRecords || []);
    const [newRecord, setNewRecord] = useState(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    const [editRecord, setEditRecord] = useState(null);
    const [showNewRecordForm, setShowNewRecordForm] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isNewRecordCurrent, setIsNewRecordCurrent] = useState(false);
    const [isEditRecordCurrent, setIsEditRecordCurrent] = useState(false);

    useEffect(() => {
        if (initialRecords) setRecords(initialRecords);
    }, [initialRecords]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (editRecord) {
            setEditRecord({ ...editRecord, [name]: value });
        } else {
            setNewRecord({ ...newRecord, [name]: value });
        }
    };

    const handleNewCheckboxToggle = () => {
        const newCurrentState = !isNewRecordCurrent;
        setIsNewRecordCurrent(newCurrentState);
        setNewRecord((prev) => ({
            ...prev,
            duration_to: newCurrentState ? '1800-01-01' : '',
        }));
    };

    const handleEditCheckboxToggle = () => {
        const editCurrentState = !isEditRecordCurrent;
        setIsEditRecordCurrent(editCurrentState);
        setEditRecord((prev) => ({

            ...prev,
            duration_to: editCurrentState ? '1800-01-01' : prev.duration_to,
        }));
    };

    const validateFields = (record) => {
        const errors = {};
        fields.forEach(field => {
            if (field.required && !record[field.name]) {
                errors[field.name] = `${field.placeholder} is required.`;
            }
        });
        console.log(isNewRecordCurrent)
        console.log(isEditRecordCurrent)
        if (!isEditRecordCurrent && !isNewRecordCurrent) {
            if ((record.duration_from && !record.duration_to) || (!record.duration_from && record.duration_to)) {
                errors.duration_from = 'Both start and end dates must be filled, or both left empty.';
                errors.duration_to = 'Both start and end dates must be filled, or both left empty.';
            }
            if ( record.duration_from && record.duration_to && new Date(record.duration_from) > new Date(record.duration_to)) {
                errors.duration_from = 'Start date must be earlier than end date.';
                errors.duration_to = 'End date must be later than start date.';
            }
        }
        
        return errors;
    };
    
    const handleAddRecord = async () => {
        const errors = validateFields(newRecord);
        console.log(newRecord);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors({});
        try {
            const response = await axios.post(`${apiEndpoint}/`, newRecord);
            setRecords([...records, { ...newRecord, id: response.data.id }]);
            setNewRecord(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
            setShowNewRecordForm(false);
            setIsNewRecordCurrent(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setValidationErrors({ global: error.response.data.error });
            } else {
                console.error(`Error adding ${recordType}:`, error);
            }
        }
    };

    const handleUpdateRecord = async () => {
        const errors = validateFields(editRecord);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        setValidationErrors({});
        try {
            console.log(editRecord)
            await axios.put(`${apiEndpoint}/`, editRecord);
            setRecords(records.map((rec) => (rec.id === editRecord.id ? editRecord : rec)));
            setEditRecord(null);
            setIsEditRecordCurrent(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setValidationErrors({ global: error.response.data.error });
            } else {
                console.error(`Error updating ${recordType}:`, error);
            }
        }
    };

    const handleEditRecord = (record) => {
        setEditRecord(record);
        setShowNewRecordForm(false);
        setIsEditRecordCurrent(record.duration_to === '1800-01-01');
    };

    const handleDeleteRecord = async (id) => {
        try {
            await axios.delete(`${apiEndpoint}/`, { data: { id } });
            setRecords(records.filter((rec) => rec.id !== id));
        } catch (error) {
            console.error(`Error deleting ${recordType}:`, error);
        }
    };

    const handleCancelEdit = () => {
        setEditRecord(null);
        setValidationErrors({});
        setIsEditRecordCurrent(false);
    };

    const shouldDisplayCheckboxes = recordType !== "Certificate" && recordType !== "Education"; // Exclude for Education

    return (
        <div className='container my-4 p-4 border'>
            <h3 className='text-uppercase text-muted'>{recordType}</h3>
            <button className='btn btn-link' onClick={() => setShowNewRecordForm(!showNewRecordForm)}>
                {showNewRecordForm ? `Hide New ${recordType} Form` : `Add +`}
            </button>

            {validationErrors.global && (
                <div className="alert alert-danger">{validationErrors.global}</div>
            )}

            {/* New Record Form */}
            {showNewRecordForm && (
                <div className='mt-3'>
                    {shouldDisplayCheckboxes && (
                        <div className='form-check mb-3'>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="newCurrent"
                                checked={isNewRecordCurrent}
                                onChange={handleNewCheckboxToggle}
                            />
                            <label className="form-check-label" htmlFor="newCurrent">
                                Current
                            </label>
                        </div>
                    )}
                    <div className='row'>
                        {fields.map((field) => (
                            <div className='col-md-6 mb-3' key={field.name}>
                                <input
                                    className={`form-control ${validationErrors[field.name] ? 'is-invalid' : ''}`}
                                    type={field.type || 'text'}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={newRecord[field.name] === '1800-01-01' ? 'Present' : newRecord[field.name]}
                                    onChange={handleInputChange}
                                    disabled={isNewRecordCurrent && field.name === 'duration_to'}
                                />
                                {validationErrors[field.name] && (
                                    <div className='invalid-feedback'>{validationErrors[field.name]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className='btn btn-primary me-2' onClick={handleAddRecord}>
                        Add {recordType}
                    </button>
                </div>
            )}

            {/* Existing Records Display */}
            {records.length === 0 ? (
                <p>No records found.</p>
            ) : (
                <ul className='list-unstyled mt-4'>
                    {records.map((rec) => (
                        <li className='mb-3' key={rec.id}>
                            <div className='d-flex justify-content-between align-items-center border rounded p-3 bg-white'>
                            <div>
    <span className='fw-bold'>{rec[fields[0].name]}</span>
    {fields[1] && rec[fields[1].name] && (
        <span className='text-muted'> ({rec[fields[1].name]})</span>
    )}
</div>

                                <div className='btn-group'>
                                    <button
                                        className='btn btn-sm btn-warning'
                                        onClick={() => handleEditRecord(rec)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className='btn btn-danger btn-sm' onClick={() => handleDeleteRecord(rec.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Edit Record Section */}
            {editRecord && (
                <div className='mt-4'>
                    <h5>Edit {recordType}</h5>
                    {recordType !== "Education" && ( // Exclude for Education
                        <div className='form-check mb-3'>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="editCurrent"
                                checked={isEditRecordCurrent}
                                onChange={handleEditCheckboxToggle}
                            />
                            <label className="form-check-label" htmlFor="editCurrent">
                                Current
                            </label>
                        </div>
                    )}
                    <div className='row'>
                        {fields.map((field) => (
                            <div className='col-md-6 mb-3' key={field.name}>
                                <input
                                    className={`form-control ${validationErrors[field.name] ? 'is-invalid' : ''}`}
                                    type={field.type || 'text'}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={editRecord[field.name] === '1800-01-01' ? 'Present' : editRecord[field.name]}
                                    onChange={handleInputChange}
                                    disabled={isEditRecordCurrent && field.name === 'duration_to'}
                                />
                                {validationErrors[field.name] && (
                                    <div className='invalid-feedback'>{validationErrors[field.name]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className='btn btn-primary me-2' onClick={handleUpdateRecord}>
                        Update {recordType}
                    </button>
                    <button className='btn btn-secondary' onClick={handleCancelEdit}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageRecords;

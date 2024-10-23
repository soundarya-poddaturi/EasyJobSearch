import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Address = ({ address: initialAddress = [], email }) => {
    const [address, setAddress] = useState({
        address_line_1: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [originalAddress, setOriginalAddress] = useState(null); // Store initialAddress for cancel purposes

    // Initialize address with initialAddress prop
    useEffect(() => {
        if (initialAddress.length > 0) {
            setAddress(initialAddress[0]); // Set address state to initialAddress (first element)
            setOriginalAddress(initialAddress[0]);  // Store the original address for cancellation
        }
    }, [initialAddress]); // Only run when initialAddress changes

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const updateAddress = async () => {
        try {
            await axios.post(`http://localhost:8000/api/address/manage/${email}/`, address);
            console.log('Address data saved:', address);
            setOriginalAddress(address); // Update original after saving
            setIsEditingAddress(false); // Exit edit mode
        } catch (error) {
            console.error('Error saving address data:', error);
        }
    };

    const handleCancelEdit = () => {
        setAddress(originalAddress); // Revert to original address
        setIsEditingAddress(false);  // Exit edit mode without saving
    };

    return (
        <div>
            <h2>Address</h2>
            {/* Input fields for address */}
            <input
                type="text"
                name="address_line_1"
                placeholder="Address Line 1"
                value={address.address_line_1 || ''}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city || ''}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state || ''}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode || ''}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />

            {/* Buttons for saving and toggling edit mode */}
            {isEditingAddress ? (
                <>
                    <button type="button" onClick={updateAddress}>
                        Save Address
                    </button>
                    <button type="button" onClick={handleCancelEdit}>
                        Cancel Edit
                    </button>
                </>
            ) : (
                <button type="button" onClick={() => setIsEditingAddress(true)}>
                    Edit Address
                </button>
            )}
        </div>
    );
};

export default Address;

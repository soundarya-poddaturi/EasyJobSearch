import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Address = ({ address: initialAddress, email }) => {
    const [address, setAddress] = useState({
        address_line_1: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // Initialize address with initialAddress prop
    useEffect(() => {
        if (initialAddress) {
            setAddress(initialAddress);
        }
    }, [initialAddress]);


    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const updateAddress = async () => {
        try {
            await axios.put(`http://localhost:8000/api/address/manage/${email}/`, address);
            console.log('Address data saved:', address);
            setIsEditingAddress(false); // Exit edit mode
        } catch (error) {
            console.error('Error saving address data:', error);
        }
    };

    return (
        <div>
            <h2>Address</h2>
            <input
                type="text"
                name="address_line_1"
                placeholder="Address Line 1"
                value={address.address_line_1}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                disabled={!isEditingAddress}
            />
            <button type="button" onClick={updateAddress} disabled={!isEditingAddress}>
                Save Address
            </button>
            <button type="button" onClick={() => setIsEditingAddress(!isEditingAddress)}>
                {isEditingAddress ? 'Cancel Edit' : 'Edit Address'}
            </button>
            {/* Display current address data */}
            {!isEditingAddress && (
                <div>
                    <h3>Current Address:</h3>
                    <p>{address.address_line_1}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.pincode}</p>
                </div>
            )}
        </div>
    );
};

export default Address;

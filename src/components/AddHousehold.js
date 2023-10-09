import axios from 'axios';
import { useEffect, useState } from 'react';
import { addToSessionStorage } from '../helpers';
import { useNavigate } from 'react-router-dom';
import { isPositiveNum, classNames } from '../helpers';
import { baseUrl } from './url.js';

export default function AddHousehold() {
    const navigate = useNavigate();
    const validators = {
        isInputValid: false,
        isUntouched: true,
    };
    const [inputValidation, setInputValidation] = useState({
        email_address: {
            ...validators,
        },
        postalcodeID: {
            ...validators,
        },
        square_footage: {
            ...validators,
        },
        heating: {
            ...validators,
        },
        cooling: {
            ...validators,
        },
    });
    const [formInputs, setFormInputs] = useState({
        email_address: '',
        home_type: 'House',
        square_footage: '',
        cooling: '',
        heating: '',
        postalcodeID: '',
        no_heating: false,
        no_cooling: false,
        gas: false,
        electric: false,
        fuel_oil: false,
        steam: false,
    });
    const homeTypes = [
        'House',
        'Apartment',
        'Townhome',
        'Condominium',
        'Mobile Home',
    ];
    const publicUtilities = [
        {
            type: 'gas',
            value: 'Gas',
        },
        {
            type: 'steam',
            value: 'Steam',
        },
        {
            type: 'fuel_oil',
            value: 'Fuel Oil',
        },
        {
            type: 'electric',
            value: 'Electric',
        },
    ];

    useEffect(() => {
        window.sessionStorage.removeItem('next_appliance_id');
        window.sessionStorage.removeItem('next_generator_id');
    });

    const isValidPostalCodeFormat = (value) => {
        const POSTAL_CODE_LEN = 5;
        if (value.length !== POSTAL_CODE_LEN || !isPositiveNum(value)) {
            return false;
        }
        return true;
    };

    const checkEmailInDb = async () => {
        return await axios.get(`${baseUrl}/ValidateEmailAddress.php`, {
            params: {
                email_address: formInputs.email_address,
            },
        });
    };

    const checkPostalCodeInDb = async () => {
        return await axios.get(`${baseUrl}/ValidatePostalCode.php`, {
            params: {
                postalcodeID: formInputs.postalcodeID,
            },
        });
    };

    const areAllInputsValid = () => {
        for (const outerKey in inputValidation) {
            for (const innerKey in inputValidation[outerKey]) {
                if (innerKey === 'isInputValid') {
                    if (inputValidation[outerKey][innerKey] === false) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const setValid = (name) => {
        setInputValidation({
            ...inputValidation,
            [name]: {
                isInputValid: true,
                isUntouched: false,
            },
        });
    };
    const setInvalid = (name) => {
        setInputValidation({
            ...inputValidation,
            [name]: {
                isInputValid: false,
                isUntouched: false,
            },
        });
    };

    const handleInputValidation = (name, value) => {
        const positiveNumList = ['square_footage', 'heating', 'cooling'];

        if (name === 'email_address') {
            setValid(name, value);
        } else if (name === 'postalcodeID') {
            if (isValidPostalCodeFormat(value)) {
                setValid(name, value);
            } else {
                setInvalid(name, value);
            }
        } else if (positiveNumList.includes(name) && isPositiveNum(value)) {
            setValid(name, value);
        } else {
            setInvalid(name, value);
        }
        setFormInputs((values) => ({ ...values, [name]: value }));
    };

    const handleInput = (e) => {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;
        const validateList = Object.keys(inputValidation);

        if (validateList.includes(name)) {
            handleInputValidation(name, value);
        } else {
            setFormInputs((values) => ({ ...values, [name]: value }));
        }
    };

    const setSessionStorage = () => {
        if (
            !formInputs.gas &&
            !formInputs.electric &&
            !formInputs.fuel_oil &&
            !formInputs.steam
        ) {
            addToSessionStorage('is_off_grid', true);
        } else {
            addToSessionStorage('is_off_grid', false);
        }
        addToSessionStorage('user_email', formInputs.email_address);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRes = await checkEmailInDb();
        const postalCodeRes = await checkPostalCodeInDb();

        const isEmailInDb = emailRes?.data[0]?.email_address !== undefined;
        const isPostalCodeInDb =
            postalCodeRes?.data[0]?.postalcodeID !== undefined;

        // These need to be validated at the same time, or they'll overwrite one
        // another
        if (isEmailInDb && !isPostalCodeInDb) {
            // Both are invalid
            setInputValidation({
                ...inputValidation,
                email_address: {
                    isInputValid: false,
                    isUntouched: false,
                },
                postalcodeID: {
                    isInputValid: false,
                    isUntouched: false,
                },
            });
        } else if (isEmailInDb && isPostalCodeInDb) {
            // Only Email is invalid
            setInputValidation({
                ...inputValidation,
                email_address: {
                    isInputValid: false,
                    isUntouched: false,
                },
                postalcodeID: {
                    isInputValid: true,
                    isUntouched: false,
                },
            });
        } else if (!isEmailInDb && !isPostalCodeInDb) {
            // Only postal code is invalid
            setInputValidation({
                ...inputValidation,
                email_address: {
                    isInputValid: true,
                    isUntouched: false,
                },
                postalcodeID: {
                    isInputValid: false,
                    isUntouched: false,
                },
            });
        }

        const req = axios.post(`${baseUrl}/AddHousehold.php`, formInputs);

        if (
            inputValidation.email_address.isInputValid &&
            inputValidation.postalcodeID.isInputValid
        ) {
            const response = await req;

            if (response.data.status === 1) {
                setSessionStorage();
                navigate('/add-appliance');
            }
        }
    };

    const handleCheckbox = (e) => {
        const name = e.target.name;
        const value = e.target.checked;
        if (name === 'no_heating') {
            if (value) {
                setFormInputs({
                    ...formInputs,
                    no_heating: true,
                    heating: '',
                });
                setValid('heating');
            } else if (!value) {
                setFormInputs({
                    ...formInputs,
                    no_heating: false,
                });
                setInvalid('heating');
            }
        }
        if (name === 'no_cooling') {
            if (value) {
                setFormInputs({
                    ...formInputs,
                    no_cooling: true,
                    cooling: '',
                });
                setValid('cooling');
            } else if (!value) {
                setFormInputs({
                    ...formInputs,
                    no_cooling: false,
                });
                setInvalid('cooling');
            }
        }
    };

    return (
        <div className="w-full max-w-screen-md">
            <h1 className="mb-4">Enter Household Info</h1>
            <div className="border border-black p-4">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className={classNames.inputCol}>
                        <label
                            htmlFor="email_address"
                            className={
                                inputValidation.email_address.isInputValid ||
                                inputValidation.email_address.isUntouched
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {inputValidation.email_address.isInputValid ||
                            inputValidation.email_address.isUntouched
                                ? 'Email address:'
                                : 'Please enter a new user email address:'}
                        </label>
                        <input
                            id="email_address"
                            name="email_address"
                            type="text"
                            placeholder="george.burdell@ramblinwreck.com"
                            onChange={handleInput}
                            className={
                                inputValidation.email_address.isInputValid ||
                                inputValidation.email_address.isUntouched
                                    ? classNames.input
                                    : classNames.errorInput
                            }
                            required
                        ></input>
                    </div>
                    <div className={classNames.inputCol}>
                        <label
                            htmlFor="postalcodeID"
                            className={
                                inputValidation.postalcodeID.isInputValid ||
                                inputValidation.postalcodeID.isUntouched
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {inputValidation.postalcodeID.isInputValid ||
                            inputValidation.postalcodeID.isUntouched
                                ? 'Postal code:'
                                : 'Postal code must be a valid 5-digit postal code:'}
                        </label>
                        <input
                            id="postalcodeID"
                            name="postalcodeID"
                            type="text"
                            placeholder="78705"
                            className={
                                inputValidation.postalcodeID.isInputValid ||
                                inputValidation.postalcodeID.isUntouched
                                    ? classNames.input
                                    : classNames.errorInput
                            }
                            onChange={handleInput}
                            required
                        ></input>
                    </div>
                    <div className={classNames.inputCol}>
                        <label htmlFor="home_type">Home type:</label>
                        <select
                            id="home_type"
                            name="home_type"
                            onChange={handleInput}
                        >
                            {homeTypes.map((homeType) => (
                                <option key={homeType} value={homeType}>
                                    {homeType}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={classNames.inputCol}>
                        <label
                            htmlFor="square_footage"
                            className={
                                inputValidation.square_footage.isInputValid ||
                                inputValidation.square_footage.isUntouched
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {inputValidation.square_footage.isInputValid ||
                            inputValidation.square_footage.isUntouched
                                ? 'Square footage:'
                                : 'Square footage must be a number:'}
                        </label>
                        <input
                            id="square_footage"
                            name="square_footage"
                            type="text"
                            placeholder="2200"
                            onChange={handleInput}
                            className={
                                inputValidation.square_footage.isInputValid ||
                                inputValidation.square_footage.isUntouched
                                    ? classNames.input
                                    : classNames.errorInput
                            }
                            required
                        ></input>
                    </div>
                    <div className={classNames.inputCol}>
                        <label
                            htmlFor="heating"
                            className={
                                inputValidation.heating.isInputValid ||
                                inputValidation.heating.isUntouched
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {inputValidation.heating.isInputValid ||
                            inputValidation.heating.isUntouched
                                ? 'Heating temperature:'
                                : 'Heating temperature must be a positive number OR "No heat" checked'}
                        </label>
                        <div className={classNames.inputRow}>
                            <input
                                id="heating"
                                name="heating"
                                type="text"
                                onChange={handleInput}
                                disabled={formInputs.no_heating}
                                placeholder={
                                    formInputs.no_heating ? 'N/A' : '72'
                                }
                                value={
                                    formInputs.no_heating
                                        ? ''
                                        : formInputs.heating
                                }
                                className={`${
                                    formInputs.no_heating
                                        ? classNames.disabledInput
                                        : ''
                                } ${
                                    inputValidation.heating.isInputValid ||
                                    inputValidation.heating.isUntouched
                                        ? classNames.input
                                        : classNames.errorInput
                                }`}
                            ></input>
                            <div className="flex flex-row">
                                <input
                                    type="checkbox"
                                    id="no_heating"
                                    name="no_heating"
                                    onChange={handleCheckbox}
                                    className="mr-1 ml-2"
                                />
                                <label htmlFor="no_heating">No heat</label>
                            </div>
                        </div>
                    </div>
                    <div className={classNames.inputCol}>
                        <label
                            htmlFor="cooling"
                            className={
                                inputValidation.cooling.isInputValid ||
                                inputValidation.cooling.isUntouched
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {inputValidation.cooling.isInputValid ||
                            inputValidation.cooling.isUntouched
                                ? `Cooling temperature:`
                                : 'Cooling temperature must be a positive number OR "No cool" checked'}
                        </label>
                        <div className={classNames.inputRow}>
                            <input
                                id="cooling"
                                name="cooling"
                                type="text"
                                placeholder={
                                    formInputs.no_cooling ? 'N/A' : '68'
                                }
                                onChange={handleInput}
                                disabled={formInputs.no_cooling}
                                value={
                                    formInputs.no_cooling
                                        ? ''
                                        : formInputs.cooling
                                }
                                className={`${
                                    formInputs.no_cooling
                                        ? classNames.disabledInput
                                        : ''
                                } ${
                                    inputValidation.cooling.isInputValid ||
                                    inputValidation.cooling.isUntouched
                                        ? classNames.input
                                        : classNames.errorInput
                                }`}
                            />
                            <div className="flex flex-row">
                                <input
                                    type="checkbox"
                                    id="no_cooling"
                                    name="no_cooling"
                                    className="mr-1 ml-2"
                                    onChange={handleCheckbox}
                                />
                                <label htmlFor="no_cooling">No cool</label>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold">Public utilities:</p>
                        <p className="text-xs mb-2">
                            (If none, leave unchecked)
                        </p>
                        <div className="flex flex-col border border-black p-2">
                            {publicUtilities.map((utility) => (
                                <div
                                    className="flex flex-row"
                                    key={utility.type}
                                >
                                    <input
                                        type="checkbox"
                                        id={utility.type}
                                        name={utility.type}
                                        value={utility.value}
                                        onChange={handleInput}
                                        className="mr-1"
                                    />
                                    <label htmlFor={utility.type}>
                                        {utility.value}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className={areAllInputsValid() ? 'btn' : 'btn-disabled'}
                        type="submit"
                        disabled={!areAllInputsValid()}
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}

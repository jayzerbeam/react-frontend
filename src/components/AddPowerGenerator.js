import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    classNames,
    isPositiveNum,
    getFromSessionStorage,
    addToSessionStorage,
} from '../helpers';
import SubmissionComplete from './SubmissionComplete';
import { baseUrl } from './url.js';

export default function AddPowerGenerator() {
    const navigate = useNavigate();
    const userEmail = getFromSessionStorage('user_email');
    const userIsOffGrid = getFromSessionStorage('is_off_grid');
    const validators = {
        isInputValid: false,
        isUntouched: true,
    };
    const [inputValidation, setInputValidation] = useState({
        monthly_kwh: {
            ...validators,
        },
        battery_kwh: {
            isInputValid: true,
            isUntouched: true,
        },
    });
    const [formInputs, setFormInputs] = useState({
        email_address: userEmail,
        next_generator_id: '',
        generator_type: 'Solar-Electric',
        battery_kwh: '',
        monthly_kwh: '',
    });

    useEffect(() => {
        getGeneratorId();
    }, []);

    const handleInputValidation = (name, value) => {
        if (isPositiveNum(value, name)) {
            setInputValidation({
                ...inputValidation,
                [name]: {
                    isInputValid: true,
                    isUntouched: false,
                },
            });
            setFormInputs((values) => ({ ...values, [name]: value }));
        } else {
            setInputValidation({
                ...inputValidation,
                [name]: {
                    isInputValid: false,
                    isUntouched: false,
                },
            });
        }
    };

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const validateList = Object.keys(inputValidation);

        if (validateList.includes(name)) {
            handleInputValidation(name, value);
        } else {
            setFormInputs((values) => ({ ...values, [name]: value }));
        }
    };

    const getGeneratorId = async () => {
        const sessionGenId = getFromSessionStorage('next_generator_id');

        if (sessionGenId) {
            const nextGeneratorId = Number(sessionGenId) + 1;
            addToSessionStorage('next_generator_id', nextGeneratorId);
            setFormInputs({
                ...formInputs,
                next_generator_id: nextGeneratorId,
            });
        } else {
            const req = axios.get(`${baseUrl}/GetNextPowerGeneratorId.php`, {
                params: {
                    email_address: userEmail,
                },
            });

            const response = await req;

            if (response?.data[0]?.next_generator_id) {
                const nextGeneratorId = response.data[0].next_generator_id;
                setFormInputs({
                    ...formInputs,
                    next_generator_id: nextGeneratorId,
                });
                addToSessionStorage('next_generator_id', nextGeneratorId);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputValidation.monthly_kwh.isInputValid) {
            await axios.post(`${baseUrl}/AddPowerGenerator.php`, formInputs);
            navigate('/view-power-generators');
        }
    };

    return (
        <div className="flex flex-col max-w-screen-md">
            <h1 className="mb-2">Add Power Generator</h1>
            <p className="mb-4">Please provide power generator details.</p>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col max-w-sm items-stretch"
            >
                <div className="flex flex-col justify-between mb-3">
                    <label htmlFor="generator_type">Type:</label>
                    <select
                        name="generator_type"
                        onChange={handleInput}
                        id="generator_type"
                    >
                        <option value="Solar-Electric">Solar-Electric</option>
                        <option value="Wind">Wind</option>
                    </select>
                </div>
                <div className="flex flex-col justify-between mb-3">
                    <label
                        className={
                            inputValidation.monthly_kwh.isInputValid ||
                            inputValidation.monthly_kwh.isUntouched
                                ? ''
                                : classNames.errorInputLabel
                        }
                        htmlFor="monthly_kwh"
                    >
                        {inputValidation.monthly_kwh.isInputValid ||
                        inputValidation.monthly_kwh.isUntouched
                            ? 'Monthly kWh:'
                            : 'Monthly kWh must be a positive number:'}
                    </label>
                    <input
                        name="monthly_kwh"
                        id="monthly_kwh"
                        type="text"
                        required="required"
                        className={
                            inputValidation.monthly_kwh.isInputValid ||
                            inputValidation.monthly_kwh.isUntouched
                                ? classNames.input
                                : classNames.errorInput
                        }
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-col justify-between mb-3">
                    <label
                        className={
                            inputValidation.battery_kwh.isInputValid ||
                            inputValidation.battery_kwh.isUntouched
                                ? ''
                                : classNames.errorInputLabel
                        }
                        htmlFor="battery_kwh"
                    >
                        {inputValidation.battery_kwh.isInputValid ||
                        inputValidation.battery_kwh.isUntouched
                            ? 'Battery kWh (optional):'
                            : 'Battery kWh (optional) must be a positive number:'}
                    </label>
                    <input
                        name="battery_kwh"
                        id="battery_kwh"
                        type="text"
                        className={
                            inputValidation.battery_kwh.isInputValid ||
                            inputValidation.battery_kwh.isUntouched
                                ? classNames.input
                                : classNames.errorInput
                        }
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-row mt-4">
                    {userIsOffGrid === 'false' && (
                        <Link
                            to="/submission-complete"
                            element={<SubmissionComplete />}
                            className="btn no-underline text-center mr-4"
                        >
                            Skip
                        </Link>
                    )}
                    {!inputValidation.battery_kwh.isInputValid ? (
                        <button
                            className={
                                inputValidation.monthly_kwh.isInputValid &&
                                inputValidation.battery_kwh.isInputValid
                                    ? 'btn'
                                    : 'btn-disabled'
                            }
                            type="submit"
                            disabled={
                                !inputValidation.monthly_kwh.isInputValid ||
                                !inputValidation.battery_kwh.isInputValid
                            }
                        >
                            Add
                        </button>
                    ) : (
                        <button
                            className={
                                inputValidation.monthly_kwh.isInputValid
                                    ? 'btn'
                                    : 'btn-disabled'
                            }
                            type="submit"
                            disabled={!inputValidation.monthly_kwh.isInputValid}
                        >
                            Add
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

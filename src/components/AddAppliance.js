import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './url.js';
import {
    classNames,
    isPositiveNum,
    getFromSessionStorage,
    addToSessionStorage,
} from '../helpers';

export default function AddAppliance() {
    const navigate = useNavigate();
    const userEmail = getFromSessionStorage('user_email');
    const [manufacturers, setManufacturers] = useState();
    const [applianceChecks, setApplianceChecks] = useState({
        isAcChecked: false,
        isHeaterChecked: false,
        isHeatPumpChecked: false,
    });
    const validators = {
        isInputValid: false,
        isUntouched: true,
    };
    const [inputValidation, setInputValidation] = useState({
        capacity: {
            ...validators,
        },
        temperature_setting: {
            ...validators,
        },
        seer: {
            ...validators,
        },
        hspf: {
            ...validators,
        },
        eer: {
            ...validators,
        },
        btu_rating: {
            ...validators,
        },
    });
    const [formInputs, setFormInputs] = useState({
        next_appliance_id: '',
        email_address: userEmail,
        appliance_type: 'Air Handler',
        model_name: '',
        btu_rating: '',
        manufacturer_id: '1',
        eer: '',
        water_heater_energy_source: 'Electric',
        seer: '',
        hspf: '',
        energy_source: 'Electric',
        capacity: '',
        temperature_setting: '',
    });

    useEffect(() => {
        getManufacturers();
        getApplianceId();
    }, []);

    const getManufacturers = async () => {
        const data = [];

        await axios
            .get(`${baseUrl}/GetApplianceManufacturers.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        appliance_type: obj.appliance_type,
                        manufacturer_name: obj.manufacturer_name,
                        manufacturer_id: obj.manufacturerID,
                    });
                });
            })
            .then(() => {
                setManufacturers(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getApplianceId = async () => {
        const sessionAppId = getFromSessionStorage('next_appliance_id');

        if (sessionAppId) {
            addToSessionStorage('next_appliance_id', Number(sessionAppId) + 1);
        } else {
            const req = axios.get(`${baseUrl}/GetNextApplianceId.php`, {
                params: {
                    email_address: userEmail,
                },
            });

            const response = await req;

            if (response?.data[0]?.next_appliance_id) {
                const nextApplianceId = response.data[0].next_appliance_id;
                addToSessionStorage('next_appliance_id', nextApplianceId);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formInputs.next_appliance_id) {
            await axios.post(`${baseUrl}/AddAppliance.php`, formInputs);
            if (formInputs.appliance_type === 'Air Handler') {
                await axios.post(
                    `${baseUrl}/AddApplianceAirHandler.php`,
                    formInputs
                );
                navigate('/view-appliances');
            } else if (formInputs.appliance_type === 'Water Heater') {
                await axios.post(
                    `${baseUrl}/AddApplianceWaterHeater.php`,
                    formInputs
                );
                navigate('/view-appliances');
            }
        } else {
            console.error('no appliance id present');
        }
    };

    const isInnerKeyValid = (outerKey) => {
        for (const innerKey in inputValidation[outerKey]) {
            if (innerKey === 'isInputValid') {
                if (inputValidation[outerKey][innerKey] === false) {
                    return false;
                }
            }
        }
        return true;
    };

    const areAllInputsValid = () => {
        const generalKeys = ['btu_rating'];
        const acKeys = [...generalKeys, 'eer'];
        const heatPumpKeys = [...generalKeys, 'seer', 'hspf'];
        const waterHeaterKeys = [
            ...generalKeys,
            'capacity',
            'temperature_setting',
        ];
        if (formInputs.appliance_type === 'Water Heater') {
            for (const outerKey in inputValidation) {
                if (waterHeaterKeys.includes(outerKey)) {
                    if (!isInnerKeyValid(outerKey)) return false;
                }
            }
            return true;
        } else if (formInputs.appliance_type === 'Air Handler') {
            for (const outerKey in inputValidation) {
                if (generalKeys.includes(outerKey)) {
                    if (!isInnerKeyValid(outerKey)) return false;
                }
                if (applianceChecks.isAcChecked) {
                    if (acKeys.includes(outerKey)) {
                        if (!isInnerKeyValid(outerKey)) return false;
                    }
                }
                if (applianceChecks.isHeatPumpChecked) {
                    if (heatPumpKeys.includes(outerKey)) {
                        if (!isInnerKeyValid(outerKey)) return false;
                    }
                }
            }
            return true;
        }
    };

    const handleInputValidation = (name, value) => {
        if (isPositiveNum(value)) {
            setInputValidation({
                ...inputValidation,
                [name]: {
                    isInputValid: true,
                    isUntouched: false,
                },
            });
            setFormInputs((values) => ({
                ...values,
                next_appliance_id: getFromSessionStorage('next_appliance_id'),
                [name]: value,
            }));
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

    const resetAppliance = (valueAsName) => {
        if (valueAsName === 'Air Handler') {
            setFormInputs({
                ...formInputs,
                capacity: '',
                temperature_setting: '',
            });
            setInputValidation({
                ...inputValidation,
                capacity: {
                    ...validators,
                },
                temperature_setting: {
                    ...validators,
                },
            });
        } else if (valueAsName === 'Water Heater') {
            setApplianceChecks({
                isAcChecked: false,
                isHeaterChecked: false,
                isHeatPumpChecked: false,
            });
            setFormInputs({
                ...formInputs,
                eer: '',
                seer: '',
                hspf: '',
            });
            setInputValidation({
                ...inputValidation,
                eer: {
                    ...validators,
                },
                seer: {
                    ...validators,
                },
                hspf: {
                    ...validators,
                },
            });
        }
    };

    const handleInput = (e) => {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;
        const validateList = Object.keys(inputValidation);

        resetAppliance(value);

        if (validateList.includes(name)) {
            handleInputValidation(name, value);
        } else {
            setFormInputs((values) => ({
                ...values,
                next_appliance_id: getFromSessionStorage('next_appliance_id'),
                [name]: value,
            }));
        }
    };

    return (
        <div className="border border-black p-4 max-w-screen-sm">
            <h1 className="mb-2">Add appliance</h1>
            <h2 className="mb-8">
                Please provide the details for the appliance.
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label
                        className="font-semibold mb-1"
                        htmlFor="appliance_type"
                    >
                        Appliance type:
                    </label>
                    <select
                        name="appliance_type"
                        id="appliance_type"
                        onChange={handleInput}
                        defaultValue={'Air Handler'}
                    >
                        <option value="DEFAULT" disabled>
                            Select an appliance type
                        </option>
                        <option value="Air Handler">Air Handler</option>
                        <option value="Water Heater">Water Heater</option>
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <label
                        className="font-semibold mb-1"
                        htmlFor="manufacturer_id"
                    >
                        Manufacturer:
                    </label>
                    {manufacturers && (
                        <select name="manufacturer_id" onChange={handleInput}>
                            {formInputs &&
                                formInputs.appliance_type === 'Air Handler' &&
                                manufacturers.map(
                                    (data) =>
                                        data.appliance_type ===
                                            'Air Handler' && (
                                            <option
                                                key={data.manufacturer_name}
                                                value={data.manufacturer_id}
                                            >
                                                {data.manufacturer_name}
                                            </option>
                                        )
                                )}
                            {formInputs &&
                                formInputs.appliance_type === 'Water Heater' &&
                                manufacturers.map(
                                    (data) =>
                                        data.appliance_type ===
                                            'Water Heater' && (
                                            <option
                                                key={data.manufacturer_name}
                                                value={data.manufacturer_id}
                                            >
                                                {data.manufacturer_name}
                                            </option>
                                        )
                                )}
                        </select>
                    )}
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="model_name">Model name (optional):</label>
                    <input
                        type="text"
                        id="model_name"
                        name="model_name"
                        onChange={handleInput}
                    />
                </div>
                <div className="flex flex-col mb-8">
                    <label
                        htmlFor="btu_rating"
                        className={
                            inputValidation.btu_rating.isInputValid ||
                            inputValidation.btu_rating.isUntouched
                                ? ''
                                : classNames.errorInputLabel
                        }
                    >
                        {inputValidation.btu_rating.isInputValid ||
                        inputValidation.btu_rating.isUntouched
                            ? 'BTU Rating:'
                            : 'BTU Rating must be a positive number:'}
                    </label>
                    <input
                        type="text"
                        name="btu_rating"
                        id="btu_rating"
                        onChange={handleInput}
                        className={
                            inputValidation.btu_rating.isInputValid ||
                            inputValidation.btu_rating.isUntouched
                                ? classNames.input
                                : classNames.errorInput
                        }
                        required
                    ></input>
                </div>
                {formInputs && formInputs.appliance_type === 'Air Handler' ? (
                    <div className="flex flex-row mb-6">
                        <div className="flex flex-col border border-black p-4 mr-4">
                            <div className="flex flex-row">
                                <input
                                    onChange={() => {
                                        setApplianceChecks({
                                            ...applianceChecks,
                                            isAcChecked:
                                                !applianceChecks.isAcChecked,
                                        });
                                    }}
                                    type="checkbox"
                                    id="air_conditioner"
                                    name="air_conditioner"
                                    className="mr-3"
                                />
                                <label htmlFor="air_conditioner">
                                    Air Conditioner
                                </label>
                            </div>
                            <div className="flex flex-row">
                                <input
                                    onChange={() => {
                                        setApplianceChecks({
                                            ...applianceChecks,
                                            isHeaterChecked:
                                                !applianceChecks.isHeaterChecked,
                                        });
                                    }}
                                    type="checkbox"
                                    name="heater"
                                    id="heater"
                                    className="mr-3"
                                />
                                <label htmlFor="heater">Heater</label>
                            </div>
                            <div className="flex flex-row">
                                <input
                                    onChange={() => {
                                        setApplianceChecks({
                                            ...applianceChecks,
                                            isHeatPumpChecked:
                                                !applianceChecks.isHeatPumpChecked,
                                        });
                                    }}
                                    type="checkbox"
                                    name="heat_pump"
                                    id="heat_pump"
                                    className="mr-3"
                                />
                                <label htmlFor="heat_pump">Heat Pump</label>
                            </div>
                        </div>
                        <div>
                            {applianceChecks.isAcChecked && (
                                <div className="flex flex-col mb-2">
                                    <label
                                        htmlFor="eer"
                                        className={
                                            inputValidation.eer.isInputValid ||
                                            inputValidation.eer.isUntouched
                                                ? ''
                                                : classNames.errorInputLabel
                                        }
                                    >
                                        {inputValidation.eer.isInputValid ||
                                        inputValidation.eer.isUntouched
                                            ? 'Energy efficiency ratio:'
                                            : 'Energy efficiency ratio must be a positive number:'}
                                    </label>
                                    <input
                                        type="text"
                                        name="eer"
                                        id="eer"
                                        onChange={handleInput}
                                        className={
                                            inputValidation.eer.isInputValid ||
                                            inputValidation.eer.isUntouched
                                                ? classNames.input
                                                : classNames.errorInput
                                        }
                                        required
                                    ></input>
                                </div>
                            )}
                            {applianceChecks.isHeaterChecked && (
                                <div className="flex flex-col mb-2">
                                    <label htmlFor="energy_source">
                                        Energy source:
                                    </label>
                                    <select
                                        name="energy_source"
                                        id="energy_source"
                                        onChange={handleInput}
                                        defaultValue={'Electric'}
                                    >
                                        <option value="Electric">
                                            Electric
                                        </option>
                                        <option value="Gas">Gas</option>
                                        <option value="Fuel Oil">
                                            Fuel Oil
                                        </option>
                                    </select>
                                </div>
                            )}
                            {applianceChecks.isHeatPumpChecked && (
                                <>
                                    <div className="flex flex-col mb-2">
                                        <label
                                            htmlFor="seer"
                                            className={
                                                inputValidation.seer
                                                    .isInputValid ||
                                                inputValidation.seer.isUntouched
                                                    ? ''
                                                    : classNames.errorInputLabel
                                            }
                                        >
                                            {inputValidation.seer
                                                .isInputValid ||
                                            inputValidation.seer.isUntouched
                                                ? 'Seasonal energy efficiency rating:'
                                                : 'Seasonal energy efficiency rating must be a positive number:'}
                                        </label>
                                        <input
                                            type="text"
                                            name="seer"
                                            id="seer"
                                            onChange={handleInput}
                                            className={
                                                inputValidation.seer
                                                    .isInputValid ||
                                                inputValidation.seer.isUntouched
                                                    ? classNames.input
                                                    : classNames.errorInput
                                            }
                                            required
                                        ></input>
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <label
                                            htmlFor="hspf"
                                            className={
                                                inputValidation.hspf
                                                    .isInputValid ||
                                                inputValidation.hspf.isUntouched
                                                    ? ''
                                                    : classNames.errorInputLabel
                                            }
                                        >
                                            {inputValidation.hspf
                                                .isInputValid ||
                                            inputValidation.hspf.isUntouched
                                                ? 'Heating seasonal performance factor:'
                                                : 'Heating seasonal performance factor rating must be a positive number:'}
                                        </label>
                                        <input
                                            type="text"
                                            name="hspf"
                                            id="hspf"
                                            onChange={handleInput}
                                            className={
                                                inputValidation.hspf
                                                    .isInputValid ||
                                                inputValidation.hspf.isUntouched
                                                    ? classNames.input
                                                    : classNames.errorInput
                                            }
                                            required
                                        ></input>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col font-semibold mb-6">
                        <div className="flex flex-col mb-4">
                            <label htmlFor="water_heater_energy_source">
                                Energy source:
                            </label>
                            <select
                                id="water_heater_energy_source"
                                name="water_heater_energy_source"
                                className="font-normal"
                                defaultValue={'Electric'}
                                onChange={handleInput}
                            >
                                <option value="Electric">Electric</option>
                                <option value="Gas">Gas</option>
                                <option value="Thermosolar">Thermosolar</option>
                                <option value="Heat pump">Heat Pump</option>
                            </select>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label
                                htmlFor="capacity"
                                className={
                                    inputValidation.capacity.isInputValid ||
                                    inputValidation.capacity.isUntouched
                                        ? ''
                                        : classNames.errorInputLabel
                                }
                            >
                                {inputValidation.capacity.isInputValid ||
                                inputValidation.capacity.isUntouched
                                    ? 'Capacity (gallons):'
                                    : 'Capacity (gallons) rating must be a positive number:'}
                            </label>
                            <input
                                type="text"
                                name="capacity"
                                id="capacity"
                                onChange={handleInput}
                                className={
                                    inputValidation.capacity.isInputValid ||
                                    inputValidation.capacity.isUntouched
                                        ? classNames.input
                                        : classNames.errorInput
                                }
                                required
                            ></input>
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="temperature_setting"
                                className={
                                    inputValidation.temperature_setting
                                        .isInputValid ||
                                    inputValidation.temperature_setting
                                        .isUntouched
                                        ? ''
                                        : classNames.errorInputLabel
                                }
                            >
                                {inputValidation.temperature_setting
                                    .isInputValid ||
                                inputValidation.temperature_setting.isUntouched
                                    ? 'Temperature Setting (°F):'
                                    : 'Temperature Setting (°F) must be a positive number:'}
                            </label>
                            <input
                                type="text"
                                name="temperature_setting"
                                id="temperature_setting"
                                onChange={handleInput}
                                className={
                                    inputValidation.temperature_setting
                                        .isInputValid ||
                                    inputValidation.temperature_setting
                                        .isUntouched
                                        ? classNames.input
                                        : classNames.errorInput
                                }
                                required
                            ></input>
                        </div>
                    </div>
                )}
                <button
                    className={areAllInputsValid() ? 'btn' : 'btn-disabled'}
                    type="submit"
                    disabled={!areAllInputsValid()}
                >
                    Add
                </button>
            </form>
        </div>
    );
}

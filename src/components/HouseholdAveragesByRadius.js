import axios from 'axios';
import { useState } from 'react';
import { isPositiveNum, classNames } from '../helpers';
import { baseUrl } from './url.js';

export default function HouseholdAveragesByRadius() {
    const [tableData, setTableData] = useState([]);
    const [isPostalCodeValid, setIsPostalCodeValid] = useState(true);
    const [formInputs, setFormInputs] = useState({
        zip_code: '',
        radius: 0,
    });

    const radii = [0, 5, 10, 25, 50, 100, 250];

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'radius') {
            setFormInputs({
                ...formInputs,
                radius: value,
            });
        }
        if (name === 'search') {
            validatePostalCodeFormat(value);
            setFormInputs({
                ...formInputs,
                zip_code: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (e.key === 'Enter' || e.type === 'submit') {
            const postalCodeRes = await checkPostalCodeInDb();
            const isPostalCodeInDb =
                postalCodeRes?.data[0]?.postalcodeID !== undefined;

            if (!isPostalCodeInDb) {
                setIsPostalCodeValid(false);
                setTableData([]);
                console.log(tableData);
            } else {
                setIsPostalCodeValid(true);
            }

            if (isPostalCodeInDb) {
                const data = [];
                await axios
                    .get(`${baseUrl}/HouseholdAveragesByRadius.php`, {
                        params: {
                            zip_code: formInputs.zip_code,
                            radius: formInputs.radius,
                        },
                    })
                    .then((response) => {
                        response.data.forEach((obj) => {
                            data.push([[obj.Name], obj.Metric]);
                        });
                    })
                    .catch((error) => {
                        return error;
                    });
                setTableData(data);
            }
        }
    };
    const validatePostalCodeFormat = (value) => {
        const POSTAL_CODE_LEN = 5;

        if (value.length !== POSTAL_CODE_LEN || !isPositiveNum(value)) {
            setIsPostalCodeValid(false);
        } else {
            setIsPostalCodeValid(true);
        }
    };
    const checkPostalCodeInDb = async () => {
        return await axios.get(`${baseUrl}/ValidatePostalCode.php`, {
            params: {
                postalcodeID: formInputs.zip_code,
            },
        });
    };

    return (
        <div className="flex flex-col justify-center">
            <h1 className="mb-6">Search Household Averages by Radius</h1>
            <form className="max-w-screen-sm" onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6">
                    <div className="flex flex-col mb-4">
                        <label
                            htmlFor="search"
                            className={
                                isPostalCodeValid
                                    ? ''
                                    : classNames.errorInputLabel
                            }
                        >
                            {isPostalCodeValid
                                ? 'Zip (Postal Code)'
                                : 'Zip code must be a valid 5-digit postal code:'}
                        </label>
                        <input
                            className={
                                isPostalCodeValid
                                    ? 'w-1/2 h-8'
                                    : classNames.errorInput + ' w-1/2 h-8'
                            }
                            type="search"
                            id="search"
                            placeholder="Search by postal code"
                            onKeyUp={handleSubmit}
                            onChange={handleChange}
                            name="search"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="radius">Radius</label>
                        <select
                            className="w-1/2"
                            id="radius"
                            name="radius"
                            onChange={handleChange}
                        >
                            <option disabled>Distance (miles)</option>
                            {radii.map((radius, key) => (
                                <option key={key} value={radius}>
                                    {radius}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    className={isPostalCodeValid ? 'btn' : 'btn-disabled'}
                    disabled={!isPostalCodeValid}
                    type="submit"
                >
                    Search
                </button>
            </form>
            {tableData && tableData.length > 0 && (
                <div className="results">
                    <hr className="my-8" />
                    <div>
                        <h2 className="mb-2">Results</h2>
                        <table>
                            <tbody>
                                {tableData.map((data, key) => (
                                    <tr key={key}>
                                        <td className="font-bold">{data[0]}</td>
                                        <td>{data[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

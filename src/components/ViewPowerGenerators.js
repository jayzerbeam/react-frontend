import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFromSessionStorage } from '../helpers';
import axios from 'axios';
import AddPowerGenerator from './AddPowerGenerator';
import SubmissionComplete from './SubmissionComplete';
import { baseUrl } from './url.js';

export default function ViewPowerGenerators() {
    const isOffGrid = getFromSessionStorage('is_off_grid');
    const [powerGeneratorData, setPowerGeneratorData] = useState([]);

    useEffect(() => {
        retrievePowerGeneratorData();
    }, []);

    const tableHeadings = [
        'Number',
        'Type',
        'Monthly kWh',
        'Battery kWh',
        'Actions',
    ];

    const handleDelete = async (e) => {
        const generatorID = e.currentTarget.getAttribute('generatorid');
        await axios
            .delete(`${baseUrl}/DeletePowerGenerator.php`, {
                data: {
                    email_address: getFromSessionStorage('user_email'),
                    generatorID: generatorID,
                },
            })
            .then(() => {
                retrievePowerGeneratorData();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const retrievePowerGeneratorData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/ViewPowerGenerators.php`, {
                params: {
                    email_address: getFromSessionStorage('user_email'),
                },
            })
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        generatorID: obj.generatorID,
                        generator_type: obj.generator_type,
                        monthly_kwh: obj.monthly_kwh,
                        battery_kwh: obj.battery_kwh,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setPowerGeneratorData(data);
    };
    return (
        <div className="flex flex-col max-w-screen-md">
            <h1 className="mb-2">Power Generation Listing</h1>
            <p className="mb-4">You have added these to your household:</p>
            {powerGeneratorData && (
                <table className="mb-4">
                    <tbody>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <th key={heading} className="font-bold">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                        {powerGeneratorData.map((entry) => (
                            <tr key={entry.generatorID}>
                                <td>{entry.generatorID}</td>
                                <td>{entry.generator_type}</td>
                                <td>{entry.monthly_kwh}</td>
                                <td>{entry.battery_kwh}</td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        generatorid={entry.generatorID}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="flex flex-col items-end">
                <Link
                    className="mb-2"
                    to="/add-power-generator"
                    element={<AddPowerGenerator />}
                >
                    + Add more power
                </Link>
                <Link
                    to="/submission-complete"
                    element={<SubmissionComplete />}
                >
                    <button
                        disabled={!powerGeneratorData.length}
                        className={
                            !isOffGrid && !powerGeneratorData.length
                                ? 'btn-disabled'
                                : 'btn'
                        }
                    >
                        Finish
                    </button>
                </Link>
            </div>
        </div>
    );
}

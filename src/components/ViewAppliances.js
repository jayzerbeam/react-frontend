import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFromSessionStorage, addToSessionStorage } from '../helpers';
import AddAppliance from './AddAppliance';
import AddPowerGenerator from './AddPowerGenerator';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function ViewAppliances() {
    const [applianceData, setApplianceData] = useState([]);

    useEffect(() => {
        retrieveApplianceData();
    }, []);

    const handleDelete = async (e) => {
        const applianceID = e.currentTarget.getAttribute('applianceid');
        await axios
            .delete(`${baseUrl}/DeleteAppliance.php`, {
                data: {
                    email_address: getFromSessionStorage('user_email'),
                    applianceID: applianceID,
                },
            })
            .then(() => {
                retrieveApplianceData();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const retrieveApplianceData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/ViewAppliances.php`, {
                params: {
                    email_address: getFromSessionStorage('user_email'),
                },
            })
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        applianceID: obj.applianceID,
                        appliance_type: obj.appliance_type,
                        manufacturer_name: obj.manufacturer_name,
                        model_name: obj.model_name,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setApplianceData(data);
    };

    const tableHeadings = [
        'Appliance #',
        'Type',
        'Manufacturer',
        'Model',
        'Actions',
    ];

    return (
        <div className="flex flex-col max-w-screen-md">
            <h1 className="mb-2">Appliance Listing</h1>
            <p className="mb-4">You have added these to your household:</p>
            <table className="mb-4">
                {applianceData && (
                    <tbody>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <td key={heading} className="font-bold">
                                    {heading}
                                </td>
                            ))}
                        </tr>
                        {applianceData.map((item) => (
                            <tr key={item.applianceID}>
                                <td>{item.applianceID}</td>
                                <td>{item.appliance_type}</td>
                                <td>{item.manufacturer_name}</td>
                                <td>{item.model_name}</td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        applianceid={item.applianceID}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            <div className="flex flex-col items-end">
                <Link
                    className="mb-2"
                    to="/add-appliance"
                    element={<AddAppliance />}
                >
                    + Add another appliance
                </Link>
                <Link to="/add-power-generator" element={<AddPowerGenerator />}>
                    <button
                        disabled={!applianceData.length}
                        className={
                            !applianceData.length ? 'btn-disabled' : 'btn'
                        }
                    >
                        Next
                    </button>
                </Link>
            </div>
        </div>
    );
}

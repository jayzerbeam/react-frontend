import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function Top25PopularManufacturers() {
    const [tableData, setTableData] = useState();
    const [drilldownData, setDrilldownData] = useState();
    const tableHeadings = ['Manufacturers', 'Appliance Count', 'Actions'];

    useEffect(() => {
        getManufacturers();
    }, []);

    const getManufacturers = async () => {
        const manufacturerData = [];
        await axios
            .get(`${baseUrl}/GetTop25Manufacturers.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    manufacturerData.push({
                        appliance_count: obj.raw_count,
                        manufacturer_name: obj.Manufacturer,
                        manufacturer_id: obj.manufacturerID,
                    });
                });
            })
            .catch((error) => {
                return error;
            });
        setTableData(manufacturerData);
    };

    const handleClick = () => {
        setDrilldownData();
    };

    const getDrilldownData = async (e) => {
        const drilldownData = [];
        const manufacturer_name =
            e.currentTarget.getAttribute('manufacturername');
        const manufacturer_id = e.currentTarget.getAttribute('manufacturerid');
        await axios
            .get(`${baseUrl}/GetTop25ManufacturersDrilldown.php`, {
                params: {
                    manufacturer_id,
                },
            })
            .then((response) => {
                response.data.forEach((obj) => {
                    drilldownData.push({
                        manufacturer_name: manufacturer_name,
                        appliance_type: obj.appliance_type,
                        appliance_count: obj.Appliance_Count,
                    });
                });
            })
            .catch((error) => {
                return error;
            });
        setDrilldownData(drilldownData);
    };

    return (
        <div className="flex flex-col relative">
            <h1 className="mb-4">Top 25 Popular Manufacturers</h1>
            {tableData && (
                <table>
                    <tbody>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {tableData.map((data) => (
                            <tr key={data.manufacturer_name}>
                                <td>{data.manufacturer_name}</td>
                                <td>{data.appliance_count}</td>
                                <td>
                                    <button
                                        className="btn-select"
                                        onClick={getDrilldownData}
                                        manufacturerid={data.manufacturer_id}
                                        manufacturername={
                                            data.manufacturer_name
                                        }
                                    >
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {drilldownData && drilldownData.length > 0 && (
                <div className="modal">
                    <div className="flex flex-col">
                        <h2 className="bg-white border-black border-t-2 border-r-2 border-l-2 font-bold text-xl text-center">
                            {drilldownData[0]?.manufacturer_name}
                        </h2>
                        <table className="bg-white">
                            <tbody>
                                <tr>
                                    <th>Appliance Type</th>
                                    <th>Appliance Count</th>
                                </tr>
                                {drilldownData.map((val, key) => (
                                    <tr key={key}>
                                        <td>{val.appliance_type}</td>
                                        <td>{val.appliance_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="btn-delete font-bold p-2 mt-3"
                            onClick={handleClick}
                        >
                            Close Modal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

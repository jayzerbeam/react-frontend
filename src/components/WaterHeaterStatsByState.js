import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function WaterHeaterStatsByState() {
    const [tableData, setTableData] = useState();
    const [drilldownData, setDrilldownData] = useState();
    const tableHeadings = [
        'State',
        'Avg. Water Heater Capacity',
        'Avg. BTUs',
        'Avg. Temp. Setting',
        'Water Heater Count w/Temp. Setting',
        'Water Heater Count w/o Temp. Setting',
        'Drilldown Report',
    ];
    const drilldownHeadings = [
        'Energy Source',
        'Min. Water Heater Capacity',
        'Avg. Water Heater Capacity',
        'Max. Water Heater Capacity',
        'Min. Temp. Setting',
        'Avg. Temp. Setting',
        'Max. Temp. Setting',
    ];

    useEffect(() => {
        retrieveTableData();
    }, []);

    const noDataForState = (key) => {
        const values = Object.values(tableData[key]);

        for (let i = 1; i < values.length; i++) {
            const value = values[i];
            if (Number(value) !== 0) {
                return false;
            }
        }
        return true;
    };

    const handleClick = () => {
        setDrilldownData();
    };

    const retrieveTableData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/WaterHeaterStatsByState.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        state: obj.state,
                        wh_cap: obj.WaterHeater_avg_capacity,
                        avg_btus: obj.WaterHeater_avg_btu,
                        avg_temp: obj.WaterHeater_avg_temp_setting,
                        wh_count_temp: obj.WaterHeater_count_with_temp_setting,
                        wh_count_no_temp:
                            obj.WaterHeater_count_with_no_temp_setting,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setTableData(data);
    };

    const getDrilldownData = async (e) => {
        const data = [];
        const state = e.currentTarget.getAttribute('state');
        await axios
            .get(`${baseUrl}/WaterHeaterStatsByStateDrilldown.php`, {
                params: {
                    state,
                },
            })
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        state: state,
                        energy_source: obj.water_heater_energy_source,
                        min_wh_cap: obj.WaterHeater_min_capacity,
                        avg_wh_cap: obj.WaterHeater_avg_capacity,
                        max_wh_cap: obj.WaterHeater_max_capacity,
                        min_temp_setting: obj.WaterHeater_min_temp_setting,
                        avg_temp_setting: obj.WaterHeater_avg_temp_setting,
                        max_temp_setting: obj.WaterHeater_max_temp_setting,
                    });
                });
            })
            .catch((error) => {
                return error;
            });
        setDrilldownData(data);
    };
    return (
        <div className="flex flex-col relative">
            <h1 className="mb-2">Water Heater Statistics by State</h1>
            {tableData && (
                <table className="mb-4 max-w-screen-xl">
                    <tbody>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <td key={heading} className="font-bold">
                                    {heading}
                                </td>
                            ))}
                        </tr>
                        {tableData.map((data, key) => (
                            <tr key={data.state}>
                                <td>{data.state}</td>
                                <td>{data.wh_cap}</td>
                                <td>{data.avg_btus}</td>
                                <td>{data.avg_temp}</td>
                                <td>{data.wh_count_temp}</td>
                                <td>{data.wh_count_no_temp}</td>
                                <td>
                                    {noDataForState(key) ? (
                                        <button
                                            className="w-40 rounded-md px-2 text-white bg-gray-600 border border-gray-600"
                                            disabled="disabled"
                                        >
                                            Report Unavailable
                                        </button>
                                    ) : (
                                        <button
                                            onClick={getDrilldownData}
                                            className="w-40 btn-select"
                                            state={data.state}
                                        >
                                            View Report
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {drilldownData && drilldownData.length > 0 && (
                <div className="modal">
                    <div className="flex flex-col">
                        <h1 className="bg-white border-black border-t-2 border-r-2 border-l-2 font-bold text-xl text-center">
                            {drilldownData[0]?.state}
                        </h1>
                        <table className="bg-white max-w-screen-xl">
                            <tbody>
                                <tr>
                                    {drilldownHeadings.map((heading, key) => (
                                        <td key={key} className="font-bold">
                                            {heading}
                                        </td>
                                    ))}
                                </tr>
                                {drilldownData.map((data, key) => (
                                    <tr key={key}>
                                        <td>{data.energy_source}</td>
                                        <td>{data.min_wh_cap}</td>
                                        <td>{data.avg_wh_cap}</td>
                                        <td>{data.max_wh_cap}</td>
                                        <td>{data.min_temp_setting}</td>
                                        <td>{data.avg_temp_setting}</td>
                                        <td>{data.max_temp_setting}</td>
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

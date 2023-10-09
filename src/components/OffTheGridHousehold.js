import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function OffTheGridHousehold() {
    const [offGridHouseStats, setOffGridHouseStats] = useState();
    const [batteryCapacityStats, setBatteryCapacityStats] = useState();
    const [powerGenStats, setPowerGenStats] = useState();
    const [waterHeaterStats, setWaterHeaterStats] = useState();
    const [applianceStats, setApplianceStats] = useState();

    useEffect(() => {
        getOffGridData();
        getBatteryCapacityData();
        getWaterHeaterData();
        getApplianceData();
        getPowerGenData();
    }, []);

    const tableHeadings = {
        stateSpecific: [
            'State with the Most Off-Grid Houses',
            'Total Count of Off-Grid Houses',
        ],
        batteryCapacity: ['Avg. Battery Capacity'],
        powerGeneration: ['Power Generation Type', 'Count', 'Percentage'],
        waterHeater: ['Household Type', 'Avg. Water Heater Capacity'],
        appliance: ['Appliance Type', 'Min. BTUs', 'Avg. BTUs', 'Max BTUs'],
    };

    const getOffGridData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetOffTheGrid.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        state: obj.state,
                        count: obj.cnt,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setOffGridHouseStats(data);
    };
    const getBatteryCapacityData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetBatteryCapacityData.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        average_battery_kwh: obj.average_battery_kwh,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setBatteryCapacityStats(data);
    };
    const getPowerGenData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetPowerGenData.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        generator_type: obj.generator_type,
                        count: obj.count,
                        percentage: obj.percentage,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setPowerGenStats(data);
    };
    const getWaterHeaterData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetWaterHeaterData.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        grid_status: obj.grid_status,
                        avg_capacity: obj.avg_capacity,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setWaterHeaterStats(data);
    };
    const getApplianceData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetApplianceData.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        appliance_type: obj.Appliance_Type,
                        min_btu: obj.min_btu,
                        avg_btu: obj.avg_btu,
                        max_btu: obj.max_btu,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setApplianceStats(data);
    };

    return (
        <div className="flex flex-col w-1/2">
            <h1 className="mb-2">Off-the-Grid Household Dashboard</h1>
            <h2 className="mb-4">
                State-Specific Off-the-Grid Household Statistics
            </h2>
            <table className="mb-8">
                {offGridHouseStats && (
                    <tbody>
                        <tr>
                            {tableHeadings.stateSpecific.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {offGridHouseStats.map((data, key) => (
                            <tr key={key}>
                                <td>{data.state}</td>
                                <td>{data.count}</td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            <h2 className="mb-4 border-b-black">
                Aggregate Off-the-Grid Household Statistics
            </h2>
            <h3 className="mb-2">Battery Capacity Statistics</h3>
            {batteryCapacityStats && (
                <table className="mb-8">
                    <tbody>
                        <tr>
                            {tableHeadings.batteryCapacity.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {batteryCapacityStats.map((data, key) => (
                            <tr key={key}>
                                <td>{data.average_battery_kwh}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3 className="mb-2">Power Generation Statistics</h3>
            {powerGenStats && (
                <table className="mb-8">
                    <tbody>
                        <tr>
                            {tableHeadings.powerGeneration.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {powerGenStats.map((data, key) => (
                            <tr key={key}>
                                <td>{data.generator_type}</td>
                                <td>{data.count}</td>
                                <td>{data.percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3 className="mb-2">Water Heater Statistics</h3>
            {waterHeaterStats && (
                <table className="mb-8">
                    <tbody>
                        <tr>
                            {tableHeadings.waterHeater.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {waterHeaterStats.map((data, key) => (
                            <tr key={key}>
                                <td>{data.grid_status}</td>
                                <td>{data.avg_capacity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3 className="mb-2">Appliance Statistics</h3>
            {applianceStats && (
                <table className="mb-8">
                    <tbody>
                        <tr>
                            {tableHeadings.appliance.map((heading) => (
                                <th key={heading}>{heading}</th>
                            ))}
                        </tr>
                        {applianceStats.map((data, key) => (
                            <tr key={key}>
                                <td>{data.appliance_type}</td>
                                {data.min_btu ? (
                                    <td>{data.min_btu}</td>
                                ) : (
                                    <td>-</td>
                                )}
                                {data.avg_btu ? (
                                    <td>{data.avg_btu}</td>
                                ) : (
                                    <td>-</td>
                                )}
                                {data.max_btu ? (
                                    <td>{data.max_btu}</td>
                                ) : (
                                    <td>-</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

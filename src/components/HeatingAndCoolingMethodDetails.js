import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function HeatingAndCoolingMethodDetails() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        retrieveTableData();
    }, []);

    const retrieveTableData = async () => {
        const data = [];
        await axios
            .get(`${baseUrl}/GetHeatingCooling.php`)
            .then((response) => {
                response.data.forEach((obj) => {
                    data.push({
                        home_type: obj.home_type,
                        AC_count: obj.AC_count,
                        AC_avg_btu_rating: obj.AC_avg_btu_rating,
                        AC_avg_eer: obj.AC_avg_eer,
                        heater_count: obj.heater_count,
                        heater_avg_btu_rating: obj.heater_avg_btu_rating,
                        heater_energy_source: obj.heater_energy_source,
                        HP_count: obj.HP_count,
                        HP_avg_btu_rating: obj.HP_avg_btu_rating,
                        HP_avg_seer: obj.HP_avg_seer,
                        HP_avg_hspf: obj.HP_avg_hspf,
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
        setTableData(data);
    };

    const tableHeadings = [
        'Household Type',
        'A/C Count',
        'Avg. A/C BTUs',
        'Avg. EER',
        'Heater Count',
        'Avg. Heater BTUs',
        'Most Common Energy Source',
        'Heat Pump Count',
        'Avg. Heat Pump BTUs',
        'Avg. SEER',
        'Avg. HSPF',
    ];

    return (
        <div className="flex flex-col max-w-screen-xl">
            <h1 className="mb-2">Heating and Cooling Method Details</h1>
            <table className="mb-4">
                {tableData.length > 0 && (
                    <tbody>
                        <tr>
                            {tableHeadings.map((heading) => (
                                <td key={heading} className="font-bold">
                                    {heading}
                                </td>
                            ))}
                        </tr>
                        {tableData.map((data, key) => (
                            <tr key={key}>
                                <td>{data.home_type}</td>
                                <td>{data.AC_count}</td>
                                <td>{data.AC_avg_btu_rating}</td>
                                <td>{data.AC_avg_eer}</td>
                                <td>{data.heater_count}</td>
                                <td>{data.heater_avg_btu_rating}</td>
                                <td>{data.heater_energy_source}</td>
                                <td>{data.HP_count}</td>
                                <td>{data.HP_avg_btu_rating}</td>
                                <td>{data.HP_avg_seer}</td>
                                <td>{data.HP_avg_hspf}</td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    );
}

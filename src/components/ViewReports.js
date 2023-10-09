import { Link } from 'react-router-dom';
import HouseholdAveragesByRadius from './HouseholdAveragesByRadius';
import ManufacturerAndModelSearch from './ManufacturerAndModelSearch';
import OffTheGridHousehold from './OffTheGridHousehold';
import Top25PopularManufacturers from './Top25PopularManufacturers';
import WaterHeaterStatsByState from './WaterHeaterStatsByState';
import HeatingAndCoolingMethodDetails from './HeatingAndCoolingMethodDetails';

export default function ViewReports() {
    const reports = [
        {
            path: '/popular-manufacturers',
            el: <Top25PopularManufacturers />,
            textContent: 'Top 25 Popular Manufacturers',
        },
        {
            path: '/manufacturer-and-model-search',
            el: <ManufacturerAndModelSearch />,
            textContent: 'Manufacturer and Model Search',
        },
        {
            path: '/off-the-grid-households',
            el: <OffTheGridHousehold />,
            textContent: 'Off the Grid Household Search',
        },
        {
            path: '/water-heater-statistics',
            el: <WaterHeaterStatsByState />,
            textContent: 'Water Heater Statistics by State',
        },
        {
            path: '/heating-and-cooling-details',
            el: <HeatingAndCoolingMethodDetails />,
            textContent: 'Heating and Cooling Method Details',
        },
        {
            path: '/household-averages',
            el: <HouseholdAveragesByRadius />,
            textContent: 'Household Averages By Radius',
        },
    ];

    return (
        <div>
            <h1 className="mb-4">View Reports</h1>
            <ul>
                {reports.map((report) => (
                    <li key={report.path} className="mb-1">
                        <Link to={report.path} element={report.el}>
                            {report.textContent}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

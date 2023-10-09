import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddAppliance from './components/AddAppliance';
import AddPowerGenerator from './components/AddPowerGenerator';
import ViewAppliances from './components/ViewAppliances';
import AddHousehold from './components/AddHousehold';
import HeatingAndCoolingMethodDetails from './components/HeatingAndCoolingMethodDetails';
import HouseholdAveragesByRadius from './components/HouseholdAveragesByRadius';
import MainMenu from './components/MainMenu';
import ManufacturerAndModelSearch from './components/ManufacturerAndModelSearch';
import OffTheGridHousehold from './components/OffTheGridHousehold';
import ViewPowerGenerators from './components/ViewPowerGenerators';
import SubmissionComplete from './components/SubmissionComplete';
import Top25PopularManufacturers from './components/Top25PopularManufacturers';
import ViewReports from './components/ViewReports';
import WaterHeaterStatsByState from './components/WaterHeaterStatsByState';

function App() {
    const routes = [
        {
            path: 'view-reports',
            el: <ViewReports />,
        },
        {
            path: 'add-household',
            el: <AddHousehold />,
        },
        {
            path: 'popular-manufacturers',
            el: <Top25PopularManufacturers />,
        },
        {
            path: 'manufacturer-and-model-search',
            el: <ManufacturerAndModelSearch />,
        },
        {
            path: 'water-heater-statistics',
            el: <WaterHeaterStatsByState />,
        },
        {
            path: 'heating-and-cooling-details',
            el: <HeatingAndCoolingMethodDetails />,
        },
        {
            path: 'off-the-grid-households',
            el: <OffTheGridHousehold />,
        },
        {
            path: 'household-averages',
            el: <HouseholdAveragesByRadius />,
        },
        {
            path: 'add-appliance',
            el: <AddAppliance />,
        },
        {
            path: 'view-appliances',
            el: <ViewAppliances />,
        },
        {
            path: 'add-power-generator',
            el: <AddPowerGenerator />,
        },
        {
            path: 'view-power-generators',
            el: <ViewPowerGenerators />,
        },
        {
            path: 'submission-complete',
            el: <SubmissionComplete />,
        },
    ];

    const debugMode = true;

    return (
        <div className="App m-4">
            <BrowserRouter>
                {debugMode && (
                    <nav className="mb-8">
                        <ul>
                            <li>
                                <Link to="/">Main Menu</Link>
                            </li>
                        </ul>
                    </nav>
                )}
                <Routes>
                    <Route index element={<MainMenu />} />
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.el}
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

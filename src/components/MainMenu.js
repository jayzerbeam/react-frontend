import ViewReports from './ViewReports';
import AddHousehold from './AddHousehold';
import { Link } from 'react-router-dom';

export default function MainMenu() {
    return (
        <div>
            <h1 className="mb-2">Welcome to Alternakraft!</h1>
            <p className="mb-4">Please choose what you'd like to do:</p>
            <ul>
                <li>
                    <Link to="/add-household" element={<AddHousehold />}>
                        Enter my household info
                    </Link>
                </li>
                <li>
                    <Link to="/view-reports" element={<ViewReports />}>
                        View reports/query data
                    </Link>
                </li>
            </ul>
        </div>
    );
}

import { Link } from 'react-router-dom';
import MainMenu from './MainMenu';

export default function SubmissionComplete() {
    return (
        <div className="flex flex-col">
            <h1 className="mb-2">Submission Complete!</h1>
            <p className="mb-4">
                Thank you for providing your information to Alternakraft!
            </p>
            <Link to="/" element={<MainMenu />}>
                Return to the main menu
            </Link>
        </div>
    );
}

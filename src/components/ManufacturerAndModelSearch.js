import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from './url.js';

export default function ManufacturerAndModelSearch() {
    const [prevSearchInput, setPrevSearchInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [results, setResultsData] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (value !== prevSearchInput) {
            setResultsData([]);
        }
    };

    const createClassName = (item) => {
        const resultItem = item.toLowerCase();
        return resultItem.match(searchInput.toLowerCase())
            ? 'bg-green-300'
            : 'bg-white';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.key === 'Enter') {
            const data = [];
            await axios
                .get(`${baseUrl}/ManufacturerAndModelSearch.php`, {
                    params: {
                        search_input: searchInput,
                    },
                })
                .then((response) => {
                    response.data.forEach((obj) => {
                        data.push({
                            manufacturer_name: obj.manufacturer_name,
                            model_name: obj.model_name,
                        });
                    });
                })
                .then(() => {
                    setResultsData(data);
                    setPrevSearchInput(searchInput);
                })
                .catch((error) => {
                    return error;
                });
        }
    };

    return (
        <div>
            <div className="search">
                <h1 className="mb-2">Manufacturer And Model Search</h1>
                <p className="mb-4">
                    Search for a manufacturer or model below.
                </p>
                <div>
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={handleChange}
                        onKeyUp={handleSubmit}
                    />
                </div>
            </div>
            <div className="results">
                <hr className="my-8" />
                {results.length > 0 && (
                    <div>
                        <h2 className="mb-2">Results</h2>
                        <table>
                            <tbody>
                                <tr>
                                    <th className="font-bold">Manufacturer</th>
                                    <th className="font-bold">Model</th>
                                </tr>
                                {results.map((data, key) => (
                                    <tr key={key}>
                                        <td
                                            className={createClassName(
                                                data.manufacturer_name
                                            )}
                                        >
                                            {data.manufacturer_name}
                                        </td>
                                        <td
                                            className={createClassName(
                                                data.model_name
                                            )}
                                        >
                                            {data.model_name}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {results.length === 0 && (
                    <div>
                        <p>
                            No results match your search input. Please enter a
                            new search term.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

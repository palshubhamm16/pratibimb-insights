export default function UploadPage() {
    return (
        <div className="p-6  bg-green-200/20 min-h-screen flex flex-col items-center">
            <div className="flex items-center justify-center mb-4 mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold mb-6 ">
                    Upload Fraud Report CSV
                </h1>
            </div>

            {/* Instructions */}
            <div className="max-w-2xl mx-auto mb-6 bg-white/70 backdrop-blur p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                <p className="text-sm text-gray-700">
                    Please upload a CSV file in the following format. Columns like{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">Suspect No</code>,{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">District</code>,{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">State</code>,{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">Amount</code>{" "}
                    etc. are required as per the csv generated from the pratibimb portal.
                </p>
            </div>

            {/* Sample Table */}
            <div className="w-full max-w-7xl mx-auto mb-6 bg-white p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-2">Sample CSV Preview</h2>

                {/* Scrollable table wrapper */}
                <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full text-sm text-left border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">Sl. No.</th>
                                <th className="border px-3 py-2">Suspect No.</th>
                                <th className="border px-3 py-2">IMEI</th>
                                <th className="border px-3 py-2">Provider</th>
                                <th className="border px-3 py-2">Location Fetched At</th>
                                <th className="border px-3 py-2">Suspect District</th>
                                <th className="border px-3 py-2">Suspect State</th>
                                <th className="border px-3 py-2">Address</th>
                                <th className="border px-3 py-2">Lat, Long</th>
                                <th className="border px-3 py-2">Victim (Ack No., District, State)</th>
                                <th className="border px-3 py-2">Victim (Name, Phone)</th>
                                <th className="border px-3 py-2">Category, Fraudulent Amount</th>
                                <th className="border px-3 py-2">Latitude</th>
                                <th className="border px-3 py-2">Longitude</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td className="border px-3 py-2">1</td>
                                <td className="border px-3 py-2">2037089576</td>
                                <td className="border px-3 py-2">8.37382E+14</td>
                                <td className="border px-3 py-2">AIRTEL</td>
                                <td className="border px-3 py-2">03/07/2025 06:28</td>
                                <td className="border px-3 py-2">Coimbatore</td>
                                <td className="border px-3 py-2">Tamil Nadu</td>
                                <td className="border px-3 py-2">89/73, Johal Zila, Vasai-Virar 332644</td>
                                <td className="border px-3 py-2">14.473111,89.357665</td>
                                <td className="border px-3 py-2">7447045019270 CHENNAI TAMIL NADU</td>
                                <td className="border px-3 py-2">Indrans Dhar 2995100687</td>
                                <td className="border px-3 py-2">KYC Update Fraud of Rs. 4665</td>
                                <td className="border px-3 py-2">14.473111</td>
                                <td className="border px-3 py-2">89.357665</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>




            {/* Upload Form */}
            <form className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <div className="flex flex-col items-center">
                    {/* Centered input */}
                    <div className="w-full flex justify-center mb-4">
                        <input
                            type="file"
                            accept=".csv"
                            className="text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0
                   file:bg-blue-100 file:text-blue-700
                   hover:file:bg-blue-200"
                        />
                    </div>

                    {/* Upload button */}
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </form>


        </div>
    );
}

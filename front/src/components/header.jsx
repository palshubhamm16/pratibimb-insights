import { Link } from "react-router-dom";
import meityLogo from "../assets/meity-logo.png"; // Replace with actual path

export default function Header() {
    return (
        <div className="w-full bg-white shadow border-b px-6 py-4">
            <div className="flex justify-between mx-auto mb-3">
                <a
                    href="https://www.meity.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={meityLogo}
                        alt="MeitY Logo"
                        className="w-50 h-12 object-contain"
                    />
                </a>
            </div>

            <div className="flex items-center justify-between  mx-auto">
                {/* Left: Logo + Title */}
                <Link to="/" className="flex items-center space-x-3">

                    <h1 className="text-3xl sm:text-5xl font-extrabold ml-1 tracking-tight text-blue-800/90">
                        Pratibimb Insights
                    </h1>
                </Link>

                {/* Right: Nav Links */}
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="text-lg font-medium hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/upload" className="text-lg font-medium hover:underline">
                                Upload
                            </Link>
                        </li>
                        <li>
                            <a href="/about" className="text-lg font-medium hover:underline">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="text-lg font-medium hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

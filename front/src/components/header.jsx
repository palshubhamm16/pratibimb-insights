import { Link } from "react-router-dom";
import profilePic from "../assets/profile.jpg"; // Replace with actual path
import coverPic from "../assets/cover.png"; // Replace with actual path

export default function Header() {
    return (
        <div className="rounded-b-lg overflow-hidden shadow border bg-white">
            {/* Cover image */}
            <div className="relative h-40 w-full border-b-2 border-gray-200">
                <img
                    src={coverPic}
                    alt="Cover"
                    className="h-full w-full object-cover "
                />

                {/* Profile image */}
                <div className="absolute left-6 -bottom-12">
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-black object-cover"
                    />
                </div>
            </div>



            <div className="flex items-center justify-between px-6 pt-16 pb-4"> {/* Increased pt-16 to pt-20 */}
                <h2 className="text-5xl font-extrabold tracking-tight text-blue-800/90">Pratibimb Insights</h2>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-3">
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

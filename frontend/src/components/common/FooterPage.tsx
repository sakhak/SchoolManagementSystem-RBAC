// ...existing code...
import React, { useState } from "react";

interface LinkItem {
    label: string;
    href: string;
}

interface FooterPageProps {
    companyName?: string;
    year?: number;
    links?: LinkItem[];
    showNewsletter?: boolean;
}

const FooterPage: React.FC<FooterPageProps> = ({
    companyName = "EduManage School System",
    year,
    links = [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Support", href: "#" },
        { label: "Contact", href: "#" },
    ],
    showNewsletter = false,
}) => {
    const currentYear = year ?? new Date().getFullYear();
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        // TODO: wire to backend or toast notification
        console.log("Subscribe:", email);
        setEmail("");
    };

    return (
        <footer className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {companyName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            A simple, secure school management platform for
                            admins, teachers and students.
                        </p>

                        <div
                            className="flex items-center space-x-3 mt-4"
                            aria-hidden
                        >
                            {/* simple SVG social icons */}
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full p-1"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path d="M22 5.92c-.7.31-1.45.52-2.24.61a3.9 3.9 0 001.7-2.15 7.8 7.8 0 01-2.48.95 3.9 3.9 0 00-6.64 3.55A11.08 11.08 0 013 4.9a3.9 3.9 0 001.21 5.2 3.86 3.86 0 01-1.77-.49v.05a3.9 3.9 0 003.13 3.82 3.9 3.9 0 01-1.76.07 3.9 3.9 0 003.64 2.7A7.83 7.83 0 012 19.54a11.04 11.04 0 005.98 1.75c7.18 0 11.11-5.95 11.11-11.11v-.51A7.9 7.9 0 0022 5.92z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full p-1"
                                aria-label="Facebook"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path d="M22 12.07C22 6.55 17.52 2 12 2S2 6.55 2 12.07c0 5 3.66 9.14 8.44 9.95v-7.05H8.07v-2.9h2.37V9.41c0-2.34 1.39-3.63 3.52-3.63.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1v7.05C18.34 21.21 22 17.07 22 12.07z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full p-1"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v12h-4zM8 8h3.84v1.64h.05c.54-1 1.86-2.05 3.82-2.05 4.09 0 4.84 2.69 4.84 6.18V20h-4v-5.1c0-1.21-.02-2.77-1.69-2.77-1.69 0-1.95 1.32-1.95 2.67V20H8z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <nav
                        aria-label="Footer navigation"
                        className="md:col-span-1"
                    >
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Quick links
                        </h4>
                        <ul className="space-y-2">
                            {links.map((l) => (
                                <li key={l.label}>
                                    <a
                                        href={l.href}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        {showNewsletter ? (
                            <>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Subscribe to updates
                                </h4>
                                <form
                                    onSubmit={handleSubscribe}
                                    className="flex items-center space-x-2"
                                >
                                    <label
                                        htmlFor="footer-email"
                                        className="sr-only"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="footer-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                <p>
                                    Need help?{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Contact support
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between">
                    <p>
                        &copy; {currentYear} {companyName}. All rights reserved.
                    </p>
                    <p className="mt-2 md:mt-0">Built with care for schools.</p>
                </div>
            </div>
        </footer>
    );
};

export default FooterPage;

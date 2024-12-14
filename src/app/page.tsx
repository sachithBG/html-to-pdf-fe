"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  // className = "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigateToSetup = () => {
    if (router) {
      router.push('/setup/editor');
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      {/* Header Section */}
      <header className="bg-blue-500 py-8 text-center text-white">
        <h1 className="text-4xl font-semibold sm:text-3xl">PDF Generator from HTML</h1>
        <p className="mt-4 text-lg sm:text-base">
          Create PDFs from your HTML content easily and seamlessly.
        </p>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 container mx-auto p-6">
        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 sm:text-xl">
            Get Started with PDF Creation
          </h2>
          <p className="text-lg text-gray-600 mt-4 sm:text-base">
            This tool helps you quickly generate PDF documents from HTML files. You can customize your settings and export your documents with just a few clicks.
          </p>
        </section>

        {/* CTA Button to Setup Page */}
        <div className="flex justify-center mt-8">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigateToSetup}
            className="py-3 px-8 text-xl sm:text-lg"
          >
            Go to Setup Page
          </Button>
        </div>

        {/* Optional Features Section */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            <div className="text-center p-6 border rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-700">Easy to Use</h4>
              <p className="text-gray-600 mt-4">
                Intuitive interface to convert HTML to PDF without complex setup.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-700">Customizable</h4>
              <p className="text-gray-600 mt-4">
                Tailor the PDF generation settings to fit your needs, like page sizes and margins.
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-700">Fast & Reliable</h4>
              <p className="text-gray-600 mt-4">
                Experience quick and error-free PDF generation with the latest technology.
              </p>
            </div>
          </div>
        </section>

        {/* Optional How It Works Section */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800">How It Works</h3>
          <p className="text-lg text-gray-600 mt-4">
            1. Enter your HTML content. <br />
            2. Customize PDF settings (size, orientation). <br />
            3. Click 'Generate PDF' and download your document.
          </p>
        </section>
      </main>

      {/* Footer Section (optional) */}
      <footer className="bg-gray-200 py-6 text-center">
        <p className="text-gray-700">
          © 2024 PDF Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

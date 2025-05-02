import { useState, useEffect } from 'react';

interface WelcomeProps {
  className?: string;
}

export default function Welcome({ className = '' }: WelcomeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`font-sans h-full md:flex md:flex-col ${className}`}>
      <img
        className="fixed top-0 left-0 w-full h-full -z-10 blur-3xl"
        src="/src/assets/background.svg"
        alt=""
        loading="eager"
      />
      <main className="h-full flex justify-center">
        <section className="flex items-start flex-col justify-center p-4 md:block md:pt-16">
          <a href="https://astro.build">
            <img
              src="/src/assets/astro.svg"
              width="115"
              height="48"
              alt="Astro Homepage"
            />
          </a>
          <h1 className="text-xl mt-1">
            To get started, open the{' '}
            <code className="inline-block bg-gradient-to-r from-pink-200 to-purple-100 border border-transparent rounded-lg px-2 py-1.5 font-mono text-sm bg-clip-padding">
              <pre className="m-0 font-mono font-normal bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                src/pages
              </pre>
            </code>{' '}
            directory in your project.
          </h1>
          <section className="flex gap-4 mt-4">
            <a
              className="flex items-center px-3 py-2.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-inner transition-shadow hover:shadow-none"
              href="https://docs.astro.build"
            >
              Read our docs
            </a>
            <a
              href="https://astro.build/chat"
              className="flex items-center px-3 py-2.5 text-gray-800 no-underline transition-colors hover:text-gray-600"
            >
              Join our Discord{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                className="h-4 ml-2"
              >
                <path
                  fill="currentColor"
                  d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"
                />
              </svg>
            </a>
          </section>
        </section>
      </main>

      <a
        href="https://astro.build/blog/astro-5/"
        className="hidden md:block p-4 bg-white rounded-2xl border border-white fixed bottom-4 right-4 max-w-xs no-underline transition-colors hover:bg-gray-50 backdrop-blur-3xl max-h-96:hidden"
      >
        <svg
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2"
        >
          <path
            d="M24.667 12c1.333 1.414 2 3.192 2 5.334 0 4.62-4.934 5.7-7.334 12C18.444 28.567 18 27.456 18 26c0-4.642 6.667-7.053 6.667-14Zm-5.334-5.333c1.6 1.65 2.4 3.43 2.4 5.333 0 6.602-8.06 7.59-6.4 17.334C13.111 27.787 12 25.564 12 22.666c0-4.434 7.333-8 7.333-16Zm-6-5.333C15.111 3.555 16 5.556 16 7.333c0 8.333-11.333 10.962-5.333 22-3.488-.774-6-4-6-8 0-8.667 8.666-10 8.666-20Z"
            fill="#111827"
          />
        </svg>
        <h2 className="m-0 mb-4 font-normal text-gray-900 text-lg">
          What's New in Astro 5.0?
        </h2>
        <p className="text-gray-600 text-sm leading-6 tracking-tight m-0">
          From content layers to server islands, click to learn more about the
          new features and improvements in Astro 5.0
        </p>
      </a>

      {/* Mobile version of news box */}
      <a
        href="https://astro.build/blog/astro-5/"
        className="md:hidden p-4 bg-white rounded-2xl border border-white m-4 -order-1 no-underline transition-colors hover:bg-gray-50 backdrop-blur-3xl"
      >
        <svg
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-2"
        >
          <path
            d="M24.667 12c1.333 1.414 2 3.192 2 5.334 0 4.62-4.934 5.7-7.334 12C18.444 28.567 18 27.456 18 26c0-4.642 6.667-7.053 6.667-14Zm-5.334-5.333c1.6 1.65 2.4 3.43 2.4 5.333 0 6.602-8.06 7.59-6.4 17.334C13.111 27.787 12 25.564 12 22.666c0-4.434 7.333-8 7.333-16Zm-6-5.333C15.111 3.555 16 5.556 16 7.333c0 8.333-11.333 10.962-5.333 22-3.488-.774-6-4-6-8 0-8.667 8.666-10 8.666-20Z"
            fill="#111827"
          />
        </svg>
        <h2 className="m-0 mb-4 font-normal text-gray-900 text-lg">
          What's New in Astro 5.0?
        </h2>
        <p className="text-gray-600 text-sm leading-6 tracking-tight m-0">
          From content layers to server islands, click to learn more about the
          new features and improvements in Astro 5.0
        </p>
      </a>
    </div>
  );
}

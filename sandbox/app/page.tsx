import Image from "next/image";
import SupabaseExample from "@/components/SupabaseExample";
import { LoadingSpinner, LoadingSpinnerInline } from "@/components/LoadingSpinner";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <SupabaseExample />

        {/* Loading Spinner Examples */}
        <div className="flex flex-col gap-8 items-center w-full">
          <h2 className="text-2xl font-bold text-center">Loading Spinner Examples</h2>
          
          {/* Basic Spinners */}
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Small</h3>
              <LoadingSpinner size="small" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Medium</h3>
              <LoadingSpinner size="medium" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Large</h3>
              <LoadingSpinner size="large" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">XL</h3>
              <LoadingSpinner size="xl" />
            </div>
          </div>

          {/* Color Variants */}
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Primary</h3>
              <LoadingSpinner variant="primary" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Success</h3>
              <LoadingSpinner variant="success" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Warning</h3>
              <LoadingSpinner variant="warning" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Error</h3>
              <LoadingSpinner variant="error" />
            </div>
          </div>

          {/* With Text */}
          <div className="text-center">
            <h3 className="text-sm font-medium mb-2">With Text</h3>
            <LoadingSpinner size="large" text="Loading data..." />
          </div>

          {/* Inline Spinner */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Inline:</h3>
            <LoadingSpinnerInline size="small" />
            <span className="text-sm text-gray-600">Saving...</span>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

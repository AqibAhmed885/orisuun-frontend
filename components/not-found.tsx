"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center flex flex-col items-center">
        <Image
          src="/empty-space.png"
          alt="Page not found illustration"
          width={400}
          height={400}
          className="mb-6 w-[260px] h-auto md:w-[340px]"
          priority
        />
        <h1 className="text-2xl md:text-4xl font-semibold text-blue-strong mb-3">
          Sorry, we can’t find that page
        </h1>
        <p className="text-sm md:text-base text-blu-ray-300">
          Try a link on our {" "}
          <Link href="/" className="underline text-blue-strong hover:text-blue-600">
            Homepage
          </Link>{" "}
          
          to find what you’re looking for.
        </p>
      </div>
    </main>
  );
}

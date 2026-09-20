export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
        Bit3un
      </h1>

      <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10">
        Secure • Fast • Borderless Digital Exchange
      </p>

      <div className="flex gap-4">
        <a
          href="/trade"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition"
        >
          Start Trading
        </a>

        <a
          href="/trade"
          className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
        >
          Learn More
        </a>
      </div>

      <div className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Bit3un. All rights reserved.
      </div>

    </main>
  );
}

import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-3xl text-center py-4">
        <h1 className="text-4xl font-bold text-gray-800">TODOs Go Here</h1>
        <p className="text-lg text-gray-600 mt-2">
          Organise your tasks, feel good.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl bg-white rounded-lg shadow p-6 mt-6">
        {/* Placeholder for Todo Form */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Enter New Task
          </h2>
          <form className="flex mt-4">
            <input
              type="text"
              placeholder="Enter your task"
              className="text-gray-800 flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
            >
              Add
            </button>
          </form>
        </section>

        {/* Placeholder for Task List */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700">TODOs</h2>
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-2">
              <span className="text-gray-400">Example Task 1</span>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                Delete
              </button>
            </li>
            <li className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-2">
              <span className="text-gray-400">Example Task 2</span>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                Delete
              </button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

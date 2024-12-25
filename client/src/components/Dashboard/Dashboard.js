import React from 'react'

const Dashboard = () => {
    const notes = [
        { title: "Note 1", pinned: false },
        { title: "Note 2", pinned: false },
        { title: "Note 3", pinned: true },
        { title: "Note 4", pinned: false },
        { title: "Note 5", pinned: false },
        { title: "Note 6", pinned: true },
        { title: "Note 5", pinned: false },
        { title: "Note 6", pinned: true },
        { title: "Note 5", pinned: false },
        { title: "Note 6", pinned: true },
        { title: "Note 5", pinned: false },
        { title: "Note 6", pinned: true },
      ];
    
  return (
    <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-peach-100 min-h-screen">
  {/* Navbar */}
  <nav className="flex justify-between items-center p-4 bg-pink-400">
    <div className="text-5xl font-bold"><h1 className='text-pink-900'>INKRYPT</h1></div>
    <div className="flex items-center space-x-4">
      <input type="text" placeholder="Search..." className="p-3 rounded-md bg-pink-300 text-pink-800" />
      <div className="flex items-center space-x-2">
        <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full w-10 h-10" />
        <span className="text-sm">John Doe</span>
        <i className="ri-logout-box-r-line ml-2 cursor-pointer"
          ></i>
      </div>
    </div>
  </nav>

  {/* Dashboard Content */}
  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {notes.map((note, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg border border-maroon-300 transition-shadow duration-300"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-maroon-800">{note.title}</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-pink-200 hover:bg-maroon-300 text-maroon-800">
              📌
            </button>
            <button className="p-2 rounded-full bg-pink-200 hover:bg-maroon-300 text-maroon-800">
              ⋮
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  )
}

export default Dashboard
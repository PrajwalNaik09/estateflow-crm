import React from 'react';

const PropertiesView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Property Portfolio</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your current listings and property inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-grow md:flex-grow-0 hidden md:block mr-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
            </span>
            <input className="pl-10 pr-4 py-2 w-64 text-sm rounded-lg border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:ring-primary focus:border-primary shadow-sm" placeholder="Search properties..." type="text"/>
          </div>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-surface-light rounded-xl shadow-card border border-gray-200 overflow-hidden group">
          <div className="relative w-full h-48 overflow-hidden">
            <img alt="Apartment, 3BHK in Whitefield, Bangalore" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmTohvaUhCXb1cEQr9f-LdiTdjdj_vy12wE4TkaUtTkoX2xebsQybOvCGwj7hbPsFryS7sQ6a1dGpRedo-5UC9k3jjWiEu-dhEKaQuRceT5szu1HMH3tPXNpYW2-NSaIWSI_LneHSEJBZvqE2n9eRxOqG5SVEfRlf8NbBVChKYNOdpw8yZfVFPkVBkqDCYeZiAIWSm4TTOHGm-HaX8cV52jmHOfJ7G3JVxTu-KyX9Y_fU-Di9I-BiMklxR2Rxq1XKJpi5QLX4HUSQ"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="badge absolute top-3 left-3 bg-teal-50 text-teal-700 border border-teal-100">Apartment</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="btn-primary flex-grow">
                <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                View Listing
              </button>
              <button className="icon-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white ml-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">Apartment, 3BHK</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              <span className="truncate">Whitefield, Bangalore</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
              <span>Added Dec 16, 2025</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-light rounded-xl shadow-card border border-gray-200 overflow-hidden group">
          <div className="relative w-full h-48 overflow-hidden">
            <img alt="Luxury Villa Plot in Sarjapur, Bangalore" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXFa70rPx5128bpInqy3HSSgiqr_haqeULD3RGOy301DvVY-JFsHTanxzjyp8gmVLVV-yk2dljXkWxbZ91zkPa0-2HAtfIzbkXn1D4U_6JUIWVgh-Y449JlA7Go_uI4XTfzfa9di3R7wHAVTCd2s2FRVBj8jwSD92PNyLlK4pq43xsR04uNATRw8FhGKLyZgwk5fl8r05DSxv9IV51ZsjSojxZLAbAbAa_0XXXozpG55p9s3E3njfwXoKFczsqfP0l-Ut19qinVTA"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="badge absolute top-3 left-3 bg-purple-50 text-purple-700 border border-purple-100">House/Land</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="btn-primary flex-grow">
                <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                View Listing
              </button>
              <button className="icon-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white ml-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">Luxury Villa Plot</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              <span className="truncate">Sarjapur, Bangalore</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
              <span>Added Dec 14, 2025</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-light rounded-xl shadow-card border border-gray-200 overflow-hidden group">
          <div className="relative w-full h-48 overflow-hidden">
            <img alt="Rented Apartment, 2BHK in Indiranagar, Bangalore" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz5ugqrji39DUk17UV2R08EeL3jR7Ar3MgxuBogIyrVwZa5WzhqWleu9PiqiGCpxrz_TAf4rnUDAjFYzpHJo_wsCDaGZ_lhLc6207oyAI8RChSCoZjyPt1jIv73O0SBmD2plsZEbFJ-ONS3Uic7dkhnhxLn-NU7VUhMaUL_ZWJcV0LKQ27YrxyEt9-06WEi7H0O3IGKa1i_jJvSzMPBdm_O5o9FuaT0YGggL-eGWt3oPqSZ2bBP0fTZz6a3CwPIBr4LrgFfwpEs9A"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="badge absolute top-3 left-3 bg-amber-50 text-amber-700 border border-amber-100">Rented Apartment</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="btn-primary flex-grow">
                <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                View Listing
              </button>
              <button className="icon-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white ml-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">Rented Apartment, 2BHK</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              <span className="truncate">Indiranagar, Bangalore</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
              <span>Added Dec 12, 2025</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-light rounded-xl shadow-card border border-gray-200 overflow-hidden group">
          <div className="relative w-full h-48 overflow-hidden">
            <img alt="Apartment, 4BHK in Hebbal, Bangalore" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPrstMFFgxJ1EAjxw2x2hI96sCB_LjzIQoLkeehIYh7JFsUV6p20NZ_6qskMLqVAHqwzOsbm9L1HY9Mf1g-qWfwJmeAPpl-xXBG-IHc-VHMWOP0fa5qNbnFsj2zDL4_TFq1pWZw8shDKVW0sa7uzshNTewzT61NWKEfSMhMaCXxOqAvzqWKOOd2ohqosMJQN0q2nF5NDSpgpTqOP9QZw3gVoeuGh8rhM1_rtGSyGXEhBNhO3vra9b2_6poi9iqGHeVxMpYUhCBc1s"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="badge absolute top-3 left-3 bg-teal-50 text-teal-700 border border-teal-100">Apartment</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="btn-primary flex-grow">
                <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                View Listing
              </button>
              <button className="icon-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white ml-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">Apartment, 4BHK</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              <span className="truncate">Hebbal, Bangalore</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
              <span>Added Dec 10, 2025</span>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-surface-light rounded-xl shadow-card border border-gray-200 overflow-hidden group">
          <div className="relative w-full h-48 overflow-hidden">
            <img alt="Corner Plot, 40x60 in Koramangala, Bangalore" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp4srHUfre5u0EhWzpqY7uKb7V_tYDUot8wDZe6R0Rn72MV3_2qawFY6O1PDuW1RCQqaz2hWerUyFicAznR6tCv_hrUHKQiC1SzQYbLORvGuFGiVfd6DY7cagTvxVFUh3geexYpbblCUYoVo8GoGHXf3XUT6WZQo5ipAo1e7a7Ox6kmRtKfZdA9ShBOlb3holJqWUKTSCl0gx0NbRTn3QrTIdmHdyClUp7HnWELbWxqoCQtCELEwwPOnBZzmIUmxgRD9F2IPQNFk0"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="badge absolute top-3 left-3 bg-purple-50 text-purple-700 border border-purple-100">House/Land</span>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="btn-primary flex-grow">
                <span className="material-symbols-outlined text-[18px] mr-2">visibility</span>
                View Listing
              </button>
              <button className="icon-btn bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white ml-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 truncate">Corner Plot, 40x60</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              <span className="truncate">Koramangala, Bangalore</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
              <span>Added Dec 08, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">42</span> results
        </p>
        <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
          <a className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" href="#">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
            Previous
          </a>
          <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-primary hover:bg-gray-100" href="#">1</a>
          <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" href="#">2</a>
          <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" href="#">3</a>
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
          <a className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" href="#">
            Next
            <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default PropertiesView;
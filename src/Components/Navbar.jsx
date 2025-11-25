import React, { useState, useRef, useEffect } from "react";
import FUTGEN from '../assets/FUTGEN.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider'
import { useCart } from '../Context/CartProvider'

const menuItems = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/product" },
  { 
    label: "Categories", 
    href: "#", 
    hasSub: true,
    subItems: [
      { label: "T-Shirts", href: "/category/tshirts" },
      { label: "Jackets", href: "/category/jackets" },
      { label: "Sweatshirts", href: "/category/sweatshirts" },
      { label: "Joggers", href: "/category/joggers" }
    ]
  },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar({ logoSrc = "/logo.png" }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setProfileOpen(!profileOpen);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="w-full z-50 bg-white backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0">
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="p-2 hover:opacity-70 transition"
              >
                <svg className="w-6 h-6 text-[#091224]" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src={FUTGEN}
                alt="Logo"
                className="h-16 md:h-20 object-contain cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative" ref={searchRef}>
                <button 
                  aria-label="Search" 
                  className="p-2 rounded-full hover:bg-gray-100 transition relative"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <svg className="w-6 h-6 text-[#091224]" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>

                {searchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[100]">
                    <form onSubmit={handleSearch}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button 
                  aria-label="Profile" 
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  onClick={handleProfileClick}
                >
                  <svg className="w-6 h-6 text-[#091224]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                
                {profileOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[100]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Hello, {user.firstName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button 
                aria-label="Cart" 
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
                onClick={() => navigate('/cart')}
              >
                <svg className="w-6 h-6 text-[#091224]" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.9 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="20" r="1" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="20" r="1" stroke="currentColor" strokeWidth="2" />
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="h-16"></div>

      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <aside
        className={`fixed left-0 top-0 bottom-0 w-80 max-w-[85%] z-[100] transform transition-transform duration-300 ease-in-out shadow-2xl
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    bg-white border-r border-gray-200`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              title="Close"
            >
              <svg className="w-5 h-5 text-[#091224]" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  {item.hasSub ? (
                    <div className="w-full">
                      <button
                        onClick={() => setCategoriesOpen(!categoriesOpen)}
                        className="w-full text-left px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} 
                          viewBox="0 0 24 24" 
                          fill="none"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
                      {categoriesOpen && (
                        <div className="bg-gray-50 py-2">
                          {item.subItems.map((subItem, subIdx) => (
                            <button
                              key={subIdx}
                              onClick={() => {
                                navigate(subItem.href);
                                setOpen(false);
                                setCategoriesOpen(false);
                              }}
                              className="w-full text-left px-10 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <span>{subItem.label}</span>
                              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(item.href);
                        setOpen(false);
                      }}
                      className="w-full text-left px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isAuthenticated && user && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

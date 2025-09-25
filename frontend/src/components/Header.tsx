
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Proyek', href: '/projects' },
    { 
      name: 'Anak Perusahaan', 
      href: '/business-units',
      dropdown: [
        { 
          name: 'PT John & Ro', 
          href: '/business-units/jhon-ro',
          subMenu: [
            { name: 'Profil', href: '/business-units/jhon-ro/profile' },
            { name: 'Proyek', href: '/business-units/jhon-ro/projects' }
          ]
        },
        { 
          name: 'PT Gunung Sahid', 
          href: '/business-units/gunung-sahid',
          subMenu: [
            { name: 'Profil', href: '/business-units/gunung-sahid/profile' },
            { name: 'Proyek', href: '/business-units/gunung-sahid/projects' }
          ]
        },
        { 
          name: 'PT Arimada Persada', 
          href: '/business-units/arimada-persada',
          subMenu: [
            { name: 'Profil', href: '/business-units/arimada-persada/profile' },
            { name: 'Proyek', href: '/business-units/arimada-persada/projects' }
          ]
        }
      ]
    },
    { name: 'Klien', href: '/clients' },
    { name: 'Karir', href: '/careers' },
    { name: 'Kontak', href: '/contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Rosa Lisca Logo" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => {
                if (item.dropdown) {
                  return (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group flex items-center space-x-1 ${
                        location.pathname.startsWith(item.href)
                          ? 'text-construction-blue-600'
                          : 'text-construction-gray-700 hover:text-construction-blue-600'
                      }`}>
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-construction-gray-200 shadow-lg min-w-[200px]">
                        {item.dropdown.map((subItem) => (
                          subItem.subMenu ? (
                            <DropdownMenuSub key={subItem.name}>
                              <DropdownMenuSubTrigger className="px-4 py-2 text-sm text-construction-gray-700 hover:bg-construction-gray-50 hover:text-construction-blue-600 cursor-pointer">
                                {subItem.name}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="bg-white border border-construction-gray-200 shadow-lg">
                                {subItem.subMenu.map((subSubItem) => (
                                  <DropdownMenuItem key={subSubItem.name} asChild>
                                    <Link 
                                      to={subSubItem.href}
                                      className="block px-4 py-2 text-sm text-construction-gray-700 hover:bg-construction-gray-50 hover:text-construction-blue-600"
                                    >
                                      {subSubItem.name}
                                    </Link>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ) : (
                            <DropdownMenuItem key={subItem.name} asChild>
                              <Link 
                                to={subItem.href}
                                className="block px-4 py-2 text-sm text-construction-gray-700 hover:bg-construction-gray-50 hover:text-construction-blue-600"
                              >
                                {subItem.name}
                              </Link>
                            </DropdownMenuItem>
                          )
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative group ${
                      location.pathname === item.href
                        ? 'text-construction-blue-600'
                        : 'text-construction-gray-700 hover:text-construction-blue-600'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-construction-blue-600 transform transition-transform duration-200 ${
                      location.pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-construction-gray-700 hover:text-construction-blue-600 hover:bg-construction-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-construction-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {/* Mobile Navigation - Now with Accordion */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                if (item.dropdown) {
                  return (
                    <Collapsible key={item.name} asChild>
                      <div className="w-full">
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                            {item.name}
                            <ChevronDown className="w-5 h-5 transition-transform duration-200 ui-open:rotate-180" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4">
                          {item.dropdown.map((subItem) => (
                             <Collapsible key={subItem.name} asChild>
                              <div className="w-full">
                                <CollapsibleTrigger asChild>
                                  <button className="w-full flex justify-between items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                                    {subItem.name}
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 ui-open:rotate-180" />
                                  </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-4">
                                  {subItem.subMenu && subItem.subMenu.map((subSubItem) => (
                                    <Link
                                      key={subSubItem.name}
                                      to={subSubItem.href}
                                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subSubItem.name}
                                    </Link>
                                  ))}
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ))}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'text-construction-blue-600 bg-construction-blue-50'
                        : 'text-construction-gray-700 hover:text-construction-blue-600 hover:bg-construction-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

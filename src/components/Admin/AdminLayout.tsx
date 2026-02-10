import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Ticket,
  Trophy,
  Receipt,
  Bell,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Панель управления' },
  { path: '/admin/users', icon: Users, label: 'Пользователи' },
  { path: '/admin/lotteries', icon: Trophy, label: 'Лотереи' },
  { path: '/admin/draws', icon: Ticket, label: 'Розыгрыши' },
  { path: '/admin/tickets', icon: Receipt, label: 'Билеты' },
  { path: '/admin/notifications', icon: Bell, label: 'Уведомления' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <motion.aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="admin-sidebar-header">
          <motion.div
            className="admin-logo"
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
          >
            {sidebarOpen && <span className="admin-logo-text">Admin Panel</span>}
          </motion.div>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} className="nav-icon" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      className="nav-label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Выход</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu-header">
                <span className="mobile-menu-title">Admin Panel</span>
                <button onClick={toggleMobileMenu}>
                  <X size={24} />
                </button>
              </div>
              <nav className="mobile-nav">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Выход</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Админ панель'}
            </h1>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">
                  {user?.firstName || 'Admin'}
                </span>
                <span className="admin-user-role">{user?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

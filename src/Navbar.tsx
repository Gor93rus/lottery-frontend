import { Link } from 'react-router-dom';
import { HomeIcon, TicketIcon, ClockIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md p-4 flex justify-around items-center text-white md:relative md:top-0 md:flex-row md:justify-center md:gap-8 md:p-0 md:bg-transparent">
      <Link to="/" className="flex flex-col items-center hover:text-yellow-400 transition">
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs">Главная</span>
      </Link>
      <Link to="/my-tickets" className="flex flex-col items-center hover:text-yellow-400 transition">
        <TicketIcon className="h-6 w-6" />
        <span className="text-xs">Мои билеты</span>
      </Link>
      <Link to="/draw-history" className="flex flex-col items-center hover:text-yellow-400 transition">
        <ClockIcon className="h-6 w-6" />
        <span className="text-xs">История</span>
      </Link>
    </nav>
  );
}

export default Navbar;
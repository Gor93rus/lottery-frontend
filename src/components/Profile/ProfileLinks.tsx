import './ProfileLinks.css';

export default function ProfileLinks() {
  return (
    <div className="profile-links">
      <a href="/terms" className="profile-link">📄 Правила</a>
      <span className="profile-links-divider">•</span>
      <a href="/about" className="profile-link">ℹ️ О приложении</a>
    </div>
  );
}

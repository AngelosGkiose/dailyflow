function Sidebar({
  activeView,
  onViewChange,
  onLogout,
}) {
  return (
    <aside>
      <div>
        <h2>DailyFlow</h2>
      </div>

      <nav aria-label="Main navigation">
        <button
          type="button"
          onClick={() => onViewChange("inbox")}
          aria-current={
            activeView === "inbox" ? "page" : undefined
          }
        >
          Inbox
        </button>

        <button
          type="button"
          onClick={() => onViewChange("today")}
          aria-current={
            activeView === "today" ? "page" : undefined
          }
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => onViewChange("upcoming")}
          aria-current={
            activeView === "upcoming" ? "page" : undefined
          }
        >
          Upcoming
        </button>
      </nav>

      <div>
        <h3>Projects</h3>
        <p>Projects will appear here.</p>
      </div>

      <div>
        <h3>Labels</h3>
        <p>Labels will appear here.</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
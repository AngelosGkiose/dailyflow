function Sidebar({
  activeView,
  selectedProjectId,
  projects,
  projectsLoading,
  onViewChange,
  onProjectSelect,
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

      <section>
        <h3>Projects</h3>

        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onProjectSelect(project)}
                  aria-current={
                    activeView === "project" &&
                    selectedProjectId === project.id
                      ? "page"
                      : undefined
                  }
                >
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Labels</h3>
        <p>Labels will appear here.</p>
      </section>

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
import { useEffect, useState } from "react";

function Sidebar({
  activeView,
  selectedProjectId,
  selectedLabelId,
  searchQuery,
  projects,
  labels,
  projectsLoading,
  labelsLoading,
  deletingProjectId,
  deletingLabelId,
  onViewChange,
  onProjectSelect,
  onLabelSelect,
  onSearch,
  onClearSearch,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddLabel,
  onEditLabel,
  onDeleteLabel,
  onLogout,
}) {
  const [searchInput, setSearchInput] = useState(
    searchQuery
  );

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const normalizedSearch =
      searchInput.trim();

    if (!normalizedSearch) {
      return;
    }

    onSearch(normalizedSearch);
  }

  function handleClearSearch() {
    setSearchInput("");
    onClearSearch();
  }

  return (
    <aside>
      <div>
        <h2>DailyFlow</h2>
      </div>

      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="task-search">
          Search tasks
        </label>

        <input
          id="task-search"
          name="search"
          type="search"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="Search tasks..."
          maxLength={100}
        />

        <button type="submit">
          Search
        </button>

        {(searchInput ||
          activeView === "search") && (
          <button
            type="button"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        )}
      </form>

      <nav aria-label="Main navigation">
        <button
          type="button"
          onClick={() =>
            onViewChange("inbox")
          }
          aria-current={
            activeView === "inbox"
              ? "page"
              : undefined
          }
        >
          Inbox
        </button>

        <button
          type="button"
          onClick={() =>
            onViewChange("today")
          }
          aria-current={
            activeView === "today"
              ? "page"
              : undefined
          }
        >
          Today
        </button>

        <button
          type="button"
          onClick={() =>
            onViewChange("upcoming")
          }
          aria-current={
            activeView === "upcoming"
              ? "page"
              : undefined
          }
        >
          Upcoming
        </button>

        <button
          type="button"
          onClick={() =>
            onViewChange("completed")
          }
          aria-current={
            activeView === "completed"
              ? "page"
              : undefined
          }
        >
          Completed
        </button>
      </nav>

      <section>
        <div>
          <h3>Projects</h3>

          <button
            type="button"
            onClick={onAddProject}
            aria-label="Create project"
          >
            + Add project
          </button>
        </div>

        {projectsLoading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => {
              const isDeleting =
                deletingProjectId ===
                project.id;

              return (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onProjectSelect(project)
                    }
                    aria-current={
                      activeView ===
                        "project" &&
                      selectedProjectId ===
                        project.id
                        ? "page"
                        : undefined
                    }
                    disabled={isDeleting}
                  >
                    {project.name}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onEditProject(project)
                    }
                    disabled={isDeleting}
                    aria-label={`Edit ${project.name}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteProject(project)
                    }
                    disabled={isDeleting}
                    aria-label={`Delete ${project.name}`}
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div>
          <h3>Labels</h3>

          <button
            type="button"
            onClick={onAddLabel}
            aria-label="Create label"
          >
            + Add label
          </button>
        </div>

        {labelsLoading ? (
          <p>Loading labels...</p>
        ) : labels.length === 0 ? (
          <p>No labels yet.</p>
        ) : (
          <ul>
            {labels.map((label) => {
              const isDeleting =
                deletingLabelId === label.id;

              return (
                <li key={label.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onLabelSelect(label)
                    }
                    aria-current={
                      activeView ===
                        "label" &&
                      selectedLabelId ===
                        label.id
                        ? "page"
                        : undefined
                    }
                    disabled={isDeleting}
                  >
                    #{label.name}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onEditLabel(label)
                    }
                    disabled={isDeleting}
                    aria-label={`Edit ${label.name}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteLabel(label)
                    }
                    disabled={isDeleting}
                    aria-label={`Delete ${label.name}`}
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
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
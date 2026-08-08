import {
  useEffect,
  useState,
} from "react";

import "../../styles/sidebar.css";


function Sidebar({
  isOpen,
  onClose,
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
  const [searchInput, setSearchInput] =
    useState(searchQuery);


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
    onClose();
  }


  function handleClearSearch() {
    setSearchInput("");

    onClearSearch();
    onClose();
  }


  function handleViewClick(view) {
    onViewChange(view);
    onClose();
  }


  function handleProjectClick(project) {
    onProjectSelect(project);
    onClose();
  }


  function handleLabelClick(label) {
    onLabelSelect(label);
    onClose();
  }


  return (
    <aside
      className={
        isOpen
          ? "sidebar sidebar-open"
          : "sidebar"
      }
    >
      <div className="sidebar-header">
        <div className="sidebar-brand-group">
          <div className="sidebar-logo">
            D
          </div>

          <div>
            <h2 className="sidebar-brand">
              DailyFlow
            </h2>

            <p className="sidebar-subtitle">
              Task manager
            </p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>


      <form
        className="sidebar-search"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(
              event.target.value
            )
          }
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />

        <button
          type="submit"
          aria-label="Search"
          disabled={
            !searchInput.trim()
          }
        >
          Search
        </button>

        {(searchInput ||
          activeView === "search") && (
          <button
            type="button"
            onClick={
              handleClearSearch
            }
          >
            Clear
          </button>
        )}
      </form>


      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        <button
          type="button"
          className={
            activeView === "inbox"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick("inbox")
          }
        >
          <span>▣</span>
          Inbox
        </button>

        <button
          type="button"
          className={
            activeView === "today"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick("today")
          }
        >
          <span>◉</span>
          Today
        </button>

        <button
          type="button"
          className={
            activeView === "upcoming"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick("upcoming")
          }
        >
          <span>▤</span>
          Upcoming
        </button>

        <button
          type="button"
          className={
            activeView === "completed"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick(
              "completed"
            )
          }
        >
          <span>✓</span>
          Completed
        </button>
      </nav>


      <section className="sidebar-section">
        <div className="sidebar-section-header">
          <h3>
            Projects
          </h3>

          <button
            type="button"
            className="sidebar-add-button"
            onClick={() => {
              onAddProject();
              onClose();
            }}
            aria-label="Add project"
          >
            +
          </button>
        </div>


        {projectsLoading ? (
          <div className="sidebar-loading-state">
            <span className="sidebar-loading-dot" />

            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="sidebar-empty-state">
            <p>
              Create your first project.
            </p>

            <button
              type="button"
              onClick={() => {
                onAddProject();
                onClose();
              }}
            >
              + New project
            </button>
          </div>
        ) : (
          <ul className="sidebar-list">
            {projects.map((project) => {
              const isDeleting =
                deletingProjectId ===
                project.id;

              const isActive =
                activeView ===
                  "project" &&
                selectedProjectId ===
                  project.id;

              return (
                <li
                  key={project.id}
                  className="sidebar-list-row"
                >
                  <button
                    type="button"
                    className={
                      isActive
                        ? "sidebar-list-item active"
                        : "sidebar-list-item"
                    }
                    onClick={() =>
                      handleProjectClick(
                        project
                      )
                    }
                    disabled={isDeleting}
                  >
                    <span className="sidebar-dot" />

                    <span className="sidebar-item-name">
                      {project.name}
                    </span>
                  </button>


                  <div className="sidebar-row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        onEditProject(
                          project
                        );

                        onClose();
                      }}
                      disabled={isDeleting}
                      aria-label={`Edit ${project.name}`}
                    >
                      ···
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteProject(
                          project
                        )
                      }
                      disabled={isDeleting}
                      aria-label={`Delete ${project.name}`}
                    >
                      {isDeleting
                        ? "…"
                        : "×"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>


      <section className="sidebar-section">
        <div className="sidebar-section-header">
          <h3>
            Labels
          </h3>

          <button
            type="button"
            className="sidebar-add-button"
            onClick={() => {
              onAddLabel();
              onClose();
            }}
            aria-label="Add label"
          >
            +
          </button>
        </div>


        {labelsLoading ? (
          <div className="sidebar-loading-state">
            <span className="sidebar-loading-dot" />

            Loading labels...
          </div>
        ) : labels.length === 0 ? (
          <div className="sidebar-empty-state">
            <p>
              Create your first label.
            </p>

            <button
              type="button"
              onClick={() => {
                onAddLabel();
                onClose();
              }}
            >
              + New label
            </button>
          </div>
        ) : (
          <ul className="sidebar-list">
            {labels.map((label) => {
              const isDeleting =
                deletingLabelId ===
                label.id;

              const isActive =
                activeView ===
                  "label" &&
                selectedLabelId ===
                  label.id;

              return (
                <li
                  key={label.id}
                  className="sidebar-list-row"
                >
                  <button
                    type="button"
                    className={
                      isActive
                        ? "sidebar-list-item active"
                        : "sidebar-list-item"
                    }
                    onClick={() =>
                      handleLabelClick(
                        label
                      )
                    }
                    disabled={isDeleting}
                  >
                    <span className="sidebar-label-icon">
                      #
                    </span>

                    <span className="sidebar-item-name">
                      {label.name}
                    </span>
                  </button>


                  <div className="sidebar-row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        onEditLabel(
                          label
                        );

                        onClose();
                      }}
                      disabled={isDeleting}
                      aria-label={`Edit ${label.name}`}
                    >
                      ···
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteLabel(
                          label
                        )
                      }
                      disabled={isDeleting}
                      aria-label={`Delete ${label.name}`}
                    >
                      {isDeleting
                        ? "…"
                        : "×"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>


      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}


export default Sidebar;
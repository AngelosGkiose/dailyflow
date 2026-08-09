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
  const [
    searchInput,
    setSearchInput,
  ] = useState(
    searchQuery
  );


  useEffect(() => {
    setSearchInput(
      searchQuery
    );
  }, [
    searchQuery,
  ]);


  function handleSearchSubmit(
    event
  ) {
    event.preventDefault();

    const normalizedSearch =
      searchInput.trim();

    if (!normalizedSearch) {
      return;
    }

    onSearch(
      normalizedSearch
    );

    onClose();
  }


  function handleClearSearch() {
    setSearchInput("");

    onClearSearch();

    onClose();
  }


  function handleViewClick(
    view
  ) {
    onViewChange(
      view
    );

    onClose();
  }


  function handleProjectClick(
    project
  ) {
    onProjectSelect(
      project
    );

    onClose();
  }


  function handleLabelClick(
    label
  ) {
    onLabelSelect(
      label
    );

    onClose();
  }


  return (
    <aside
      className={
        isOpen
          ? "sidebar sidebar-open"
          : "sidebar"
      }
      aria-label="DailyFlow sidebar"
    >
      <div className="sidebar-header">
        <div className="sidebar-brand-group">
          <div
            className="sidebar-logo"
            aria-hidden="true"
          >
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
          <span aria-hidden="true">
            ×
          </span>
        </button>
      </div>


      <form
        className="sidebar-search"
        onSubmit={
          handleSearchSubmit
        }
        role="search"
      >
        <input
          type="search"
          value={
            searchInput
          }
          onChange={(
            event
          ) =>
            setSearchInput(
              event.target.value
            )
          }
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />

        <button
          type="submit"
          aria-label="Search tasks"
          disabled={
            !searchInput.trim()
          }
        >
          Search
        </button>

        {(
          searchInput ||
          activeView ===
            "search"
        ) && (
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
            activeView ===
            "inbox"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick(
              "inbox"
            )
          }
          aria-current={
            activeView ===
            "inbox"
              ? "page"
              : undefined
          }
        >
          <span aria-hidden="true">
            ▣
          </span>

          Inbox
        </button>


        <button
          type="button"
          className={
            activeView ===
            "today"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick(
              "today"
            )
          }
          aria-current={
            activeView ===
            "today"
              ? "page"
              : undefined
          }
        >
          <span aria-hidden="true">
            ◉
          </span>

          Today
        </button>


        <button
          type="button"
          className={
            activeView ===
            "upcoming"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick(
              "upcoming"
            )
          }
          aria-current={
            activeView ===
            "upcoming"
              ? "page"
              : undefined
          }
        >
          <span aria-hidden="true">
            ▤
          </span>

          Upcoming
        </button>


        <button
          type="button"
          className={
            activeView ===
            "completed"
              ? "sidebar-nav-item active"
              : "sidebar-nav-item"
          }
          onClick={() =>
            handleViewClick(
              "completed"
            )
          }
          aria-current={
            activeView ===
            "completed"
              ? "page"
              : undefined
          }
        >
          <span aria-hidden="true">
            ✓
          </span>

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
            <span aria-hidden="true">
              +
            </span>
          </button>
        </div>


        {projectsLoading ? (
          <div
            className="sidebar-loading-state"
            role="status"
          >
            <span
              className="sidebar-loading-dot"
              aria-hidden="true"
            />

            Loading projects...
          </div>
        ) : projects.length ===
          0 ? (
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
            {projects.map(
              (project) => {
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
                    key={
                      project.id
                    }
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
                      disabled={
                        isDeleting
                      }
                      aria-current={
                        isActive
                          ? "page"
                          : undefined
                      }
                    >
                      <span
                        className="sidebar-dot"
                        aria-hidden="true"
                      />

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
                        disabled={
                          isDeleting
                        }
                        aria-label={
                          `Edit ${project.name}`
                        }
                      >
                        <span aria-hidden="true">
                          ···
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteProject(
                            project
                          )
                        }
                        disabled={
                          isDeleting
                        }
                        aria-label={
                          `Delete ${project.name}`
                        }
                      >
                        <span aria-hidden="true">
                          {isDeleting
                            ? "…"
                            : "×"}
                        </span>
                      </button>
                    </div>
                  </li>
                );
              }
            )}
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
            <span aria-hidden="true">
              +
            </span>
          </button>
        </div>


        {labelsLoading ? (
          <div
            className="sidebar-loading-state"
            role="status"
          >
            <span
              className="sidebar-loading-dot"
              aria-hidden="true"
            />

            Loading labels...
          </div>
        ) : labels.length ===
          0 ? (
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
            {labels.map(
              (label) => {
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
                    key={
                      label.id
                    }
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
                      disabled={
                        isDeleting
                      }
                      aria-current={
                        isActive
                          ? "page"
                          : undefined
                      }
                    >
                      <span
                        className="sidebar-label-icon"
                        aria-hidden="true"
                      >
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
                        disabled={
                          isDeleting
                        }
                        aria-label={
                          `Edit ${label.name}`
                        }
                      >
                        <span aria-hidden="true">
                          ···
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteLabel(
                            label
                          )
                        }
                        disabled={
                          isDeleting
                        }
                        aria-label={
                          `Delete ${label.name}`
                        }
                      >
                        <span aria-hidden="true">
                          {isDeleting
                            ? "…"
                            : "×"}
                        </span>
                      </button>
                    </div>
                  </li>
                );
              }
            )}
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
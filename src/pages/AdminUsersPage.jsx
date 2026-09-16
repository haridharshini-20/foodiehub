import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "./AdminUsersPage.css";

function AdminUsersPage() {
    const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "users")
        );

        const usersData = snapshot.docs.map((userDoc) => ({
          id: userDoc.id,
          ...userDoc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // ================================
  // CHANGE ROLE
  // ================================

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);

      await updateDoc(
        doc(db, "users", userId),
        {
          role: newRole,
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

    } catch (error) {
      console.error(
        "Error updating user role:",
        error
      );

      alert("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================================
  // SEARCH
  // ================================

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";

    return (
      name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      email
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="admin-users-page">
        <div className="admin-users-loading">
          👥 Loading users...
        </div>
      </section>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <section className="admin-users-page">

      {/* HEADER */}

      <div className="admin-users-header">

        <div>
          <h1>👥 Manage Users</h1>

          <p>
            View and manage Foodie Hub users.
          </p>
        </div>

        <div className="users-count">
          {users.length} Users
        </div>

      </div>


      {/* SEARCH */}

      <div className="users-search">

        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* USERS */}

      {filteredUsers.length === 0 ? (

        <div className="no-users">

          <div>👤</div>

          <h2>No Users Found</h2>

          <p>
            No users match your search.
          </p>

        </div>

      ) : (

        <div className="users-list">

          {filteredUsers.map((user) => {

            const role = user.role || "user";

            return (

              <div
                className="user-card"
                key={user.id}
              >

                {/* AVATAR */}

                <div className="user-avatar">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>


                {/* USER INFO */}

                <div className="user-info">

                  <h3>
                    {user.name ||
                      "Unnamed User"}
                  </h3>

                  <p>
                    {user.email ||
                      "No email"}
                  </p>

                </div>


                {/* ROLE */}

                <div className="user-role">

                  <span
                    className={
                      role === "admin"
                        ? "role-badge admin"
                        : "role-badge user"
                    }
                  >
                    {role === "admin"
                      ? "🛡️ Admin"
                      : "👤 User"}
                  </span>

                </div>


                {/* CHANGE ROLE */}

                <div className="role-control">

                 <select
  value={role}
  disabled={
    updatingId === user.id ||
    user.id === currentUser?.uid
  }
  onChange={(e) =>
    handleRoleChange(
      user.id,
      e.target.value
    )
  }
>

                    <option value="user">
                      User
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>
                  {user.id === currentUser?.uid && (
  <small className="current-user-label">
    Your account
  </small>
)}

                </div>


                {/* DATE */}

                <div className="user-date">

                  <span>
                    Joined
                  </span>

                  <strong>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </strong>

                </div>

              </div>

            );
          })}

        </div>
      )}

    </section>
  );
}

export default AdminUsersPage;
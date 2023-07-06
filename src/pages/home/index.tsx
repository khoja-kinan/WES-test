import React, { useEffect, useState } from "react";
import "../../styles/Table.scss";

interface User {
  id: number;
  name: string;
  role: string;
  username: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    role: "",
    username: "",
  });
  const userRole = localStorage.getItem("userRole");

  const handleAddUser = () => {
    setAdding(true);
    setNewUser({
      id: 0,
      name: "",
      role: "Editor",
      username: "",
    });
  };

  const handleCancelAddUser = () => {
    setAdding(false);
  };

  const handleSaveUser = async () => {
    try {
      await fetch(`https://api.kinan-khoja.com/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(newUser),
      });

      fetchUsers();
      setAdding(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleNewUserChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleEditCell = (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: number,
    field: keyof User
  ) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          [field]: event.target.value,
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (fieldA < fieldB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  async function fetchUsers() {
    try {
      const response = await fetch("https://api.kinan-khoja.com/api/users");
      const data = await response.json();

      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveChanges = async () => {
    try {
      for (const updatedUser of users) {
        const response = await fetch(
          `https://api.kinan-khoja.com/api/users/${updatedUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user.");
        }
      }

      //   fetchUsers();
      setEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(
        `https://api.kinan-khoja.com/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="header">Users Table</h1>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {userRole === "Editor" && !adding && (
          <button className="add-user-button" onClick={handleAddUser}>
            Add New User
          </button>
        )}
      </div>
      {adding && (
        <div className="new-user-form">
          <input
            type="text"
            name="name"
            value={newUser.name}
            placeholder="Name"
            onChange={handleNewUserChange}
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleNewUserChange}
          >
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <input
            type="text"
            name="username"
            value={newUser.username}
            placeholder="username"
            onChange={handleNewUserChange}
          />
          <div className="new-user-buttons">
            <button className="save-button" onClick={handleSaveUser}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancelAddUser}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID{" "}
                {sortField === "id" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("name")}>
                Name{" "}
                {sortField === "name" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("role")}>
                Role{" "}
                {sortField === "role" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("username")}>
                Username{" "}
                {sortField === "username" && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
              {userRole === "Editor" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td> Loadig ...</td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    {editing ? (
                      <input
                        type="text"
                        value={user.id}
                        onChange={(e) => handleEditCell(e, user.id, "id")}
                      />
                    ) : (
                      user.id
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleEditCell(e, user.id, "name")}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        readOnly
                        type="text"
                        value={user.role}
                        onChange={(e) => handleEditCell(e, user.id, "role")}
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="text"
                        value={user.username}
                        onChange={(e) => handleEditCell(e, user.id, "username")}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  {userRole === "Editor" && (
                    <td>
                      <div className="actions">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user.id)}
                        >
                          &#10006;
                        </button>
                        {/*  <button className="edit-button" onClick={handleEdit}>
                          &#9998;
                        </button> */}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

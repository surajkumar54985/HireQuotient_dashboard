import React, { useState, useEffect } from 'react';
import "./adminCss.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [editableUserId, setEditableUserId] = useState(null);

  // Fetch data from the provided API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Apply search filter
  const filteredUsers = users.filter(
    (user) =>
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate users
  const itemsPerPage = 10;
  const totalPageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectAll(false);
    setSelectedRows([]);
    setEditableUserId(null);
  };

  // Handle row selection
  const handleRowSelect = (userId) => {
    if (selectAll) {
      // Deselect all if selectAll is true
      setSelectAll(false);
      setSelectedRows([]);
    } else {
      // Toggle selection for the specific user
      setSelectedRows((prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId)
          : [...prevSelected, userId]
      );
    }
    setEditableUserId(null);
  };

//   const handleSelectAll = () => {
//     setSelectAll(!selectAll);
//     setSelectedRows(selectAll ? [] : paginatedUsers.map((user) => user.id));
//   };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(selectAll ? [] : paginatedUsers.map((user) => user.id));
    setEditableUserId(null);
  };

  const handleEdit = (userId) => {
    setEditableUserId(userId);
    setSelectedRows([]);
  };

  // Handle save changes
  const handleSave = (userId) => {
    // Implement logic to save changes (in memory)
    setEditableUserId(null);
  };

  // Handle delete selected rows
  const handleDeleteSelected = () => {
    // Implement deletion logic for selected rows
    setSelectAll(!selectAll);
    const updatedUsers = users.filter((user) => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="text"
        id="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-icon" onClick={() => console.log('Search')}>
        🔍
      </button>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id} style={{ background: selectedRows.includes(user.id) ? '#ccc' : 'transparent' }}>
              <td>
                <input
                  type="checkbox"
                  id={user.id}
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleRowSelect(user.id)}
                />
              </td>
              <td>
                {editableUserId === user.id ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => console.log('Update Name:', e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {editableUserId === user.id ? (
                  <button className="save" onClick={() => handleSave(user.id)}>
                    Save
                  </button>
                ) : (
                  <button className="edit" onClick={() => handleEdit(user.id)}>
                    Edit
                  </button>
                )}
                <button className="delete" onClick={() => handleDeleteSelected()}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className="page-item page-link" onClick={() => (handlePageChange(1))}>&laquo;&laquo;</li>
                <li className="page-item page-link" onClick={() => {if(currentPage>=1)
                     handlePageChange(Math.max(currentPage - 1, 1))}}>&laquo;</li>
                {/* <li className="page-item page-link">{currPage}</li> */}
                <li className="page-item page-link"><span>Page {currentPage}</span></li>
                <li className="page-item page-link" onClick={() => {handlePageChange(Math.min(currentPage + 1, totalPageCount))}}>&raquo;</li>
                <li className="page-item page-link" onClick={() => (handlePageChange(totalPageCount))}>&raquo;&raquo;</li>
            </ul>
        </nav>
      </div>

      <button id="delete-selected" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
    </div>
  );
};

export default AdminDashboard;


{/* <nav aria-label="Page navigation example">
    <ul className="pagination justify-content-center">
        <li className="page-item page-link" onClick={() => {if(currPage>=1)
            {
                setCurrPage(currPage-1);
            }}}>&laquo;</li>
        <li className="page-item page-link">{currPage}</li>
        <li className="page-item page-link" onClick={() => (setCurrPage(currPage+1))}>{currPage+1}</li>
        <li className="page-item page-link" onClick={() => (setCurrPage(currPage+2))}>{currPage+2}</li>
        <li className="page-item page-link" onClick={() => {setCurrPage(currPage+1);}}>&raquo;</li>
    </ul>
</nav> */}
// script.js

const API_BASE_URL = '/api'; // Corrected API Base URL

// DOM Elements
const userForm = document.getElementById('userForm'); // Manage Users form
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userList = document.getElementById('userList');

const groupForm = document.getElementById('groupForm');
const groupNameInput = document.getElementById('groupName');
const groupMembersSelect = document.getElementById('groupMembers'); // Multi-select dropdown for existing users
const groupList = document.getElementById('groupList');
const groupSelect = document.getElementById('groupSelect');

const expenseForm = document.getElementById('expenseForm');
const expenseNameInput = document.getElementById('expenseName');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const payerSelect = document.getElementById('payer');
const splitTypeSelect = document.getElementById('splitType');
const weightsSection = document.getElementById('weightsSection');
const weightsRow = weightsSection.querySelector('.form-row');

const settlementList = document.getElementById('settlementList');
const expenseList = document.getElementById('expenseList');
const balanceList = document.getElementById('balanceList');

// Toast Function
function showToast(message, type = 'success', title = '') {
  // Create Toast Element
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      ${
        title
          ? `<div class="toast-body"><strong>${title}</strong> ${message}</div>`
          : `<div class="toast-body">${message}</div>`
      }
      <button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `;

  // Append Toast to Container
  document.getElementById('toastContainer').appendChild(toastEl);

  // Initialize and Show Toast
  $(toastEl).toast({ delay: 5000 });
  $(toastEl).toast('show');

  // Remove Toast after Hidden
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}

// ================== Initial Data Fetch ==================

// Fetch and display all users, groups, settlements, and expenses on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  fetchGroups();
  fetchSettlements();
  fetchExpenses();
});

// ================== User Management ==================

// Handle User Creation (from Manage Users section)
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = userNameInput.value.trim();
  const email = userEmailInput.value.trim();

  if (!name || !email) {
    showToast(
      'Please enter both name and email for the user.',
      'warning',
      'Validation Error'
    );
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    if (response.ok) {
      const newUser = await response.json();
      addUserToList(newUser);
      populateGroupMembersSelect();
      userForm.reset();
      showToast(
        `User "${newUser.name}" added successfully!`,
        'success',
        'Success'
      );
    } else {
      const errorData = await response.json();
      showToast(`Error: ${errorData.message}`, 'danger', 'Error');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    showToast('An error occurred while creating the user.', 'danger', 'Error');
  }
});

// Fetch All Users
function fetchUsers() {
  fetch(`${API_BASE_URL}/users`)
    .then((response) => response.json())
    .then((users) => {
      console.log('Fetched Users:', users); // Debugging Statement
      userList.innerHTML = '';
      users.forEach((user) => addUserToList(user));
      populateGroupMembersSelect(); // Populate the user dropdown
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      showToast('An error occurred while fetching users.', 'danger', 'Error');
    });
}

// Add User to User List in UI
function addUserToList(user) {
  const li = document.createElement('li');
  li.className =
    'list-group-item d-flex justify-content-between align-items-center';
  li.textContent = `${user.name} (${user.email})`;

  userList.appendChild(li);
}

// Populate Group Members Selection Dropdown
function populateGroupMembersSelect() {
  fetch(`${API_BASE_URL}/users`)
    .then((response) => response.json())
    .then((users) => {
      groupMembersSelect.innerHTML = ''; // Clear existing options
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.name;
        groupMembersSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error populating group members select:', error);
      showToast(
        'An error occurred while populating group members.',
        'danger',
        'Error'
      );
    });
}

// ================== Group Management ==================

// Handle Group Creation
groupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = groupNameInput.value.trim();
  const members = Array.from(groupMembersSelect.selectedOptions).map(
    (option) => option.value
  );

  if (!name || members.length === 0) {
    showToast(
      'Please enter a valid group name and select at least one member.',
      'warning',
      'Validation Error'
    );
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, members }) // members: array of User IDs
    });

    if (response.ok) {
      const newGroup = await response.json();
      addGroupToList(newGroup);
      populateGroupSelect();
      groupForm.reset();
      showToast(
        `Group "${newGroup.name}" created successfully!`,
        'success',
        'Success'
      );
    } else {
      const errorData = await response.json();
      showToast(`Error: ${errorData.message}`, 'danger', 'Error');
    }
  } catch (error) {
    console.error('Error creating group:', error);
    showToast('An error occurred while creating the group.', 'danger', 'Error');
  }
});

// Fetch All Groups
function fetchGroups() {
  fetch(`${API_BASE_URL}/groups`)
    .then((response) => response.json())
    .then((groups) => {
      console.log('Fetched Groups:', groups); // Debugging Statement
      groupList.innerHTML = '';
      groups.forEach((group) => addGroupToList(group));
      populateGroupSelect();
    })
    .catch((error) => {
      console.error('Error fetching groups:', error);
      showToast('An error occurred while fetching groups.', 'danger', 'Error');
    });
}

// Add Group to Group List in UI
function addGroupToList(group) {
  const li = document.createElement('li');
  li.className =
    'list-group-item d-flex justify-content-between align-items-center';
  li.textContent = group.name;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-danger btn-sm';
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteGroup(group._id, group.name);

  li.appendChild(deleteBtn);
  groupList.appendChild(li);
}

// Delete a Group
async function deleteGroup(groupId, groupName) {
  if (
    !confirm(
      `Are you sure you want to delete the group "${groupName}"? This will also delete all associated expenses.`
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast(
        `Group "${groupName}" deleted successfully.`,
        'success',
        'Success'
      );
      fetchGroups();
      fetchSettlements();
      fetchExpenses();
    } else {
      const errorData = await response.json();
      showToast(`Error: ${errorData.message}`, 'danger', 'Error');
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    showToast('An error occurred while deleting the group.', 'danger', 'Error');
  }
}

// Populate Group Selection Dropdown in Expense Form
function populateGroupSelect() {
  fetch(`${API_BASE_URL}/groups`)
    .then((response) => response.json())
    .then((groups) => {
      console.log('Populating Group Select with:', groups); // Debugging Statement
      groupSelect.innerHTML =
        '<option value="" disabled selected>Select a group</option>';
      groups.forEach((group) => {
        const option = document.createElement('option');
        option.value = group._id;
        option.textContent = group.name;
        groupSelect.appendChild(option);
      });

      // Reset Payer Dropdown when groups are repopulated
      payerSelect.innerHTML =
        '<option value="" disabled selected>Select a group first</option>';
    })
    .catch((error) => {
      console.error('Error populating group select:', error);
      showToast(
        'An error occurred while populating groups.',
        'danger',
        'Error'
      );
    });
}

// ================== Expense Management ==================

// Handle Expense Creation
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const groupId = groupSelect.value;
  const expenseName = expenseNameInput.value.trim();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const payer = payerSelect.value;
  const splitType = splitTypeSelect.value;

  if (
    !groupId ||
    !expenseName ||
    isNaN(amount) ||
    amount <= 0 ||
    !payer ||
    !splitType
  ) {
    showToast(
      'Please fill in all required fields.',
      'warning',
      'Validation Error'
    );
    return;
  }

  // Fetch group details to get members
  let group;
  try {
    const groupResponse = await fetch(`${API_BASE_URL}/groups/${groupId}`);
    if (!groupResponse.ok) {
      throw new Error('Failed to fetch group details.');
    }
    group = await groupResponse.json();
    console.log('Fetched Group Details for Expense:', group); // Debugging Statement
  } catch (error) {
    console.error('Error fetching group details:', error);
    showToast(
      'An error occurred while fetching group details.',
      'danger',
      'Error'
    );
    return;
  }

  // Calculate shares based on split type
  let shares = {};

  if (splitType === 'equal') {
    const shareAmount = parseFloat((amount / group.members.length).toFixed(2));
    group.members.forEach((member) => {
      shares[member._id] = shareAmount;
    });
  } else if (splitType === 'percentage') {
    // Collect percentages
    const percentages = {};
    let totalPercentage = 0;
    group.members.forEach((member) => {
      const input = document.getElementById(`weight${member._id}`);
      const percent = parseFloat(input.value) || 0;
      percentages[member._id] = percent;
      totalPercentage += percent;
    });

    if (totalPercentage !== 100) {
      showToast(
        'Total percentage must equal 100%.',
        'warning',
        'Validation Error'
      );
      return;
    }

    group.members.forEach((member) => {
      shares[member._id] = parseFloat(
        ((amount * percentages[member._id]) / 100).toFixed(2)
      );
    });
  } else if (splitType === 'weight') {
    // Collect weights
    const weights = {};
    let totalWeight = 0;
    group.members.forEach((member) => {
      const input = document.getElementById(`weight${member._id}`);
      const weight = parseFloat(input.value) || 0;
      weights[member._id] = weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) {
      showToast(
        'Total weight must be greater than 0.',
        'warning',
        'Validation Error'
      );
      return;
    }

    group.members.forEach((member) => {
      shares[member._id] = parseFloat(
        ((amount * weights[member._id]) / totalWeight).toFixed(2)
      );
    });
  }

  const expenseData = {
    groupId,
    expenseName,
    description,
    amount,
    payer,
    shares
  };

  console.log('Submitting Expense Data:', expenseData); // Debugging Statement

  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });

    if (response.ok) {
      showToast(
        `Expense "${expenseName}" added to group "${group.name}" successfully!`,
        'success',
        'Success'
      );
      expenseForm.reset();
      weightsSection.style.display = 'none';
      fetchSettlements();
      fetchExpenses();
    } else {
      const errorData = await response.json();
      showToast(`Error: ${errorData.message}`, 'danger', 'Error');
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    showToast('An error occurred while adding the expense.', 'danger', 'Error');
  }
});

// Handle Split Type Change to Show/Hide Weights Section
splitTypeSelect.addEventListener('change', () => {
  const splitType = splitTypeSelect.value;
  if (splitType === 'percentage' || splitType === 'weight') {
    weightsSection.style.display = 'block';
    generateWeightInputs();
  } else {
    weightsSection.style.display = 'none';
    weightsRow.innerHTML = '';
  }
});

// Generate Weight/Percentage Inputs Based on Selected Group
async function generateWeightInputs() {
  const groupId = groupSelect.value;
  if (!groupId) {
    showToast('Please select a group first.', 'warning', 'Validation Error');
    splitTypeSelect.value = 'equal';
    weightsSection.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch group details.');
    }
    const group = await response.json();
    console.log('Generating Weight Inputs for Group:', group); // Debugging Statement
    weightsRow.innerHTML = '';

    group.members.forEach((member) => {
      const div = document.createElement('div');
      div.className = 'form-group col-md-3';
      const label = document.createElement('label');
      label.htmlFor = `weight${member._id}`;
      label.textContent = member.name;

      const input = document.createElement('input');
      input.type = 'number';
      input.id = `weight${member._id}`;
      input.className = 'form-control';
      input.placeholder = splitTypeSelect.value === 'percentage' ? '25%' : '25';
      input.step = '0.01';
      input.min = '0';

      div.appendChild(label);
      div.appendChild(input);
      weightsRow.appendChild(div);
    });
  } catch (error) {
    console.error('Error generating weight inputs:', error);
    showToast(
      'An error occurred while generating weight inputs.',
      'danger',
      'Error'
    );
  }
}

// ================== Settlement and Expenses Display ==================

function getUserNameById(users, userId) {
  return users.find((user) => user.id === userId).name;
}

// Fetch and Display Settlements
// script.js

function fetchSettlements() {
  fetch(`${API_BASE_URL}/settlements`)
    .then((response) => response.json())
    .then((settlements) => {
      console.log('Fetched Settlements:', settlements); // Debugging Statement
      settlementList.innerHTML = '';

      Object.keys(settlements).forEach((groupName) => {
        const groupSettlements = settlements[groupName];
        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-4'; // Margin bottom for spacing between groups

        // Group Title
        const groupTitle = document.createElement('h3');
        groupTitle.textContent = `Group: ${groupName}`;
        groupDiv.appendChild(groupTitle);

        // Create a Bootstrap Row to hold Balances and Settlements side by side
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        // -------------------- Balances Column --------------------
        const balancesCol = document.createElement('div');
        balancesCol.className = 'col-md-6 mb-3'; // Half width on medium+ screens, margin bottom for spacing

        // Balances Card
        const balancesCard = document.createElement('div');
        balancesCard.className = 'card h-100'; // h-100 ensures equal height

        // Balances Card Header
        const balancesCardHeader = document.createElement('div');
        balancesCardHeader.className = 'card-header bg-success text-white';
        balancesCardHeader.textContent = 'Balances';
        balancesCard.appendChild(balancesCardHeader);

        // Balances List Group
        const balancesList = document.createElement('ul');
        balancesList.className = 'list-group list-group-flush';

        Object.keys(groupSettlements.balances).forEach((userId) => {
          const balance = groupSettlements.balances[userId];
          const userName = getUserNameById(groupSettlements.users, userId);
          const balanceItem = document.createElement('li');
          balanceItem.className =
            'list-group-item d-flex justify-content-between align-items-center';
          balanceItem.textContent = userName;

          const badge = document.createElement('span');
          badge.className =
            balance > 0
              ? 'badge badge-success badge-pill'
              : 'badge badge-danger badge-pill';
          badge.textContent = `$${Math.abs(balance).toFixed(2)} ${
            balance > 0 ? 'Owed' : 'Owes'
          }`;

          balanceItem.appendChild(badge);
          balancesList.appendChild(balanceItem);
        });

        balancesCard.appendChild(balancesList);
        balancesCol.appendChild(balancesCard);
        rowDiv.appendChild(balancesCol);

        // -------------------- Settlements Column --------------------
        const settlementsCol = document.createElement('div');
        settlementsCol.className = 'col-md-6 mb-3'; // Half width on medium+ screens, margin bottom for spacing

        // Settlements Card
        const settlementsCard = document.createElement('div');
        settlementsCard.className = 'card h-100'; // h-100 ensures equal height

        // Settlements Card Header
        const settlementsCardHeader = document.createElement('div');
        settlementsCardHeader.className = 'card-header bg-danger text-white';
        settlementsCardHeader.textContent = 'Settlements';
        settlementsCard.appendChild(settlementsCardHeader);

        // Settlements List Group
        const settlementsList = document.createElement('ul');
        settlementsList.className = 'list-group list-group-flush';

        if (groupSettlements.settlements.length === 0) {
          const noSettle = document.createElement('li');
          noSettle.className = 'list-group-item';
          noSettle.textContent = 'All balances are settled!';
          settlementsList.appendChild(noSettle);
        } else {
          groupSettlements.settlements.forEach((settlement) => {
            const settlementItem = document.createElement('li');
            settlementItem.className = 'list-group-item';
            settlementItem.textContent = `${getUserNameById(
              groupSettlements.users,
              settlement.from
            )} pays ${getUserNameById(
              groupSettlements.users,
              settlement.to
            )} $${settlement.amount.toFixed(2)}`;
            settlementsList.appendChild(settlementItem);
          });
        }

        settlementsCard.appendChild(settlementsList);
        settlementsCol.appendChild(settlementsCard);
        rowDiv.appendChild(settlementsCol);

        // Append the Row to the Group Div
        groupDiv.appendChild(rowDiv);
        settlementList.appendChild(groupDiv);
      });
    })
    .catch((error) => {
      console.error('Error fetching settlements:', error);
      showToast(
        'An error occurred while fetching settlements.',
        'danger',
        'Error'
      );
    });
}

// Fetch and Display Expenses
function fetchExpenses() {
  fetch(`${API_BASE_URL}/expenses`)
    .then((response) => response.json())
    .then((expenses) => {
      console.log('Fetched Expenses:', expenses); // Debugging Statement

      const expenseTableBody = document.querySelector('#expenseTable tbody');
      expenseTableBody.innerHTML = ''; // Clear existing rows

      expenses.forEach((expense, index) => {
        const tr = document.createElement('tr');

        // Serial Number
        const serialTd = document.createElement('td');
        serialTd.textContent = index + 1;
        tr.appendChild(serialTd);

        // Expense Name
        const nameTd = document.createElement('td');
        nameTd.textContent = expense.expenseName;
        tr.appendChild(nameTd);

        // Amount
        const amountTd = document.createElement('td');
        amountTd.textContent = expense.amount.toFixed(2);
        tr.appendChild(amountTd);

        // Description
        const descTd = document.createElement('td');
        descTd.textContent = expense.description || 'N/A';
        tr.appendChild(descTd);

        // Payer
        const payerTd = document.createElement('td');
        payerTd.textContent = expense.payer?.name || 'N/A';
        tr.appendChild(payerTd);

        // Group
        const groupTd = document.createElement('td');
        groupTd.textContent = expense.group.name || 'N/A';
        tr.appendChild(groupTd);

        // Actions
        const actionsTd = document.createElement('td');

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary mr-2';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editExpense(expense._id); // Implement editExpense function
        actionsTd.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () =>
          deleteExpense(expense._id, expense.expenseName); // Implement deleteExpense function
        actionsTd.appendChild(deleteBtn);

        tr.appendChild(actionsTd);

        // Optional: Conditional Styling Based on Settlement Status
        if (expense.settled) {
          tr.classList.add('table-success'); // Green row for settled expenses
        } else {
          tr.classList.add('table-warning'); // Yellow row for unsettled expenses
        }

        expenseTableBody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error('Error fetching expenses:', error);
      showToast(
        'An error occurred while fetching expenses.',
        'danger',
        'Error'
      );
    });
}

// Delete Expense Function
function deleteExpense(expenseId, expenseName) {
  if (
    !confirm(`Are you sure you want to delete the expense "${expenseName}"?`)
  ) {
    return;
  }

  fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        showToast(
          `Expense "${expenseName}" deleted successfully!`,
          'success',
          'Success'
        );
        fetchExpenses(); // Refresh the expenses table
      } else {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || 'Failed to delete expense.');
        });
      }
    })
    .catch((error) => {
      console.error('Error deleting expense:', error);
      showToast(`Error: ${error.message}`, 'danger', 'Error');
    });
}

// ================== Additional Enhancements ==================

// Optional: Periodically Refresh Settlements and Expenses
setInterval(() => {
  fetchSettlements();
  fetchExpenses();
}, 60000); // Refresh every 60 seconds

// ================== Event Listener for Group Selection ==================

// Handle Group Selection Change to Update Payer Options
groupSelect.addEventListener('change', async () => {
  const groupId = groupSelect.value;
  if (!groupId) {
    payerSelect.innerHTML =
      '<option value="" disabled selected>Select a group first</option>';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch group details.');
    }
    const group = await response.json();

    // Populate Payer Select
    payerSelect.innerHTML =
      '<option value="" disabled selected>Select who paid</option>';
    group.members.forEach((member) => {
      const option = document.createElement('option');
      option.value = member._id;
      option.textContent = member.name;
      payerSelect.appendChild(option);
    });

    // Reset Split Type and Weights
    splitTypeSelect.value = 'equal';
    weightsSection.style.display = 'none';
    weightsRow.innerHTML = '';
  } catch (error) {
    console.error('Error updating payer options:', error);
    showToast(
      'An error occurred while updating payer options.',
      'danger',
      'Error'
    );
  }
});

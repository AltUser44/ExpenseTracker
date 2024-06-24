document.addEventListener('DOMContentLoaded', (event) => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const userInfoScreen = document.getElementById('user-info');
  const expenseTrackerScreen = document.getElementById('expense-tracker');
  const summaryScreen = document.getElementById('summary');
  const expenseOptions = document.getElementById('expense-options');

  const quotes = [
    "Today's actions make tomorrow's future",
    "Believe you can and you're halfway there",
    "Success is not the key to happiness. Happiness is the key to success",
    "Your limitation—it's only your imagination",
    "Dream it. Wish it. Do it."
  ];

  document.getElementById('quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];

  window.showForm = () => {
    welcomeScreen.style.display = 'none';
    userInfoScreen.style.display = 'block';
  };

  window.showSummary = () => {
    expenseTrackerScreen.style.display = 'none';
    summaryScreen.style.display = 'block';
    displaySummary();
  };

  window.startOver = () => {
    summaryScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    localStorage.clear();
  };

  document.getElementById('user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userData = {
      name: document.getElementById('name').value,
      age: document.getElementById('age').value,
      gender: document.getElementById('gender').value,
      career: document.getElementById('career').value,
      salary: document.getElementById('salary').value,
      budget: document.getElementById('budget').value
    };
    localStorage.setItem('user', JSON.stringify(userData));
    userInfoScreen.style.display = 'none';
    expenseTrackerScreen.style.display = 'block';
    displayUserDetails();
  });

  const displayUserDetails = () => {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const userDetailsDiv = document.getElementById('user-details');
    userDetailsDiv.innerHTML = `
      <p>Name: ${userDetails.name}</p>
      <p>Age: ${userDetails.age}</p>
      <p>Gender: ${userDetails.gender}</p>
      <p>Career: ${userDetails.career}</p>
      <p>Salary: ${userDetails.salary}</p>
      <p>Budget: ${userDetails.budget}</p>
    `;
  };

  document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const expense = {
      name: document.getElementById('expense-name').value,
      amount: parseFloat(document.getElementById('expense-amount').value)
    };
    addExpense(expense);
  });

  const addExpense = (expense) => {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    expenseOptions.style.display = 'block';
  };

  const displayExpenses = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${expense.name}: $${expense.amount} 
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      `;
      expenseList.appendChild(li);
    });
  };

  window.continueAdding = () => {
    expenseOptions.style.display = 'none';
    document.getElementById('expense-form').reset();
  };

  window.editExpense = (index) => {
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    const expense = expenses[index];
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
  };

  window.deleteExpense = (index) => {
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
  };

  const displaySummary = () => {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const remainingBudget = userDetails.budget - totalExpenses;
    const summaryDetailsDiv = document.getElementById('summary-details');
    summaryDetailsDiv.innerHTML = `
      <p>Total Expenses: $${totalExpenses}</p>
      <p>Remaining Budget: $${remainingBudget}</p>
      <p>Suggestion: ${getBudgetSuggestion(userDetails, remainingBudget)}</p>
    `;
    displayChart(expenses);
  };

  const getBudgetSuggestion = (userDetails, remainingBudget) => {
    if (remainingBudget > 0) {
      return "You're within your budget. Keep it up!";
    } else {
      return "Consider cutting down on unnecessary expenses to stay within your budget.";
    }
  };

  const displayChart = (expenses) => {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = expenses.map(expense => expense.name);
    const data = expenses.map(expense => expense.amount);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  };
});

  let expenses = [];

  function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      expenses = JSON.parse(savedExpenses);
    }
  }

  function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }
  function renderExpenses() {
    const expensesElement = document.getElementById('expenses');
    expensesElement.innerHTML = '';
    let totalExpense = 0;
    let categoryTotals = {};
    expenses.forEach((expense, index) => {
      const category = expense.category;
      const price = expense.price * expense.count;
      totalExpense += price;

      if (!categoryTotals[category]) {
        categoryTotals[category] = price;
      } else {
        categoryTotals[category] += price;
      }

      const expenseItem = document.createElement('div');
      expenseItem.classList.add('container');
      expenseItem.innerHTML = `
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <div class="category-card">
                <span>${category} <i class="fas fa-rupee-sign"></i>${price.toFixed(2)} (Count: ${expense.count})</span>
                <div class="buttons">
                  <button style="margin:2px" onclick="increaseCount(${index})">+</button>
                  <button style="margin:2px" onclick="decreaseCount(${index})">-</button>
                  <button style="margin:2px" onclick="editExpense(${index})">Edit</button>
                  <button style="margin:2px" onclick="deleteCategory(${index})">Delete</button>
                </div>
              </div>
            </div>
          </div>
      `;
      expensesElement.appendChild(expenseItem);
    });

    const totalExpenseElement = document.getElementById('totalExpense');
    totalExpenseElement.innerHTML = `Total Expense: <i class="fas fa-rupee-sign"></i>${totalExpense.toFixed(2)}`;

    // Check if it's a new day
    const currentDate = new Date().toLocaleDateString();
    const lastPromptDate = localStorage.getItem('lastPromptDate');
    if (currentDate !== lastPromptDate) {
        expenses.forEach((expense, index) => {
            const category = expense.category;
            const ordered = confirm(`Did you order ${category}?`);
            if (ordered) {
                const price = parseFloat(prompt(`Enter the price for ${category}:`));
                if (!isNaN(price)) {
                    expenses[index].price = price;
                    expenses[index].count++;
                } else {
                    alert('Please enter a valid price.');
                }
            }
        });
        localStorage.setItem('lastPromptDate', currentDate);
        // Update and render the expenses
        saveExpenses();
        renderExpenses();
    }
}

function addExpense() {
    const category = prompt('Enter expense category:');
    if (category) {
        const price = parseFloat(prompt('Enter expense price:'));
        if (!isNaN(price)) {
            expenses.push({ category, price, count: 1 });
            saveExpenses();
            renderExpenses();
        } else {
            alert('Please enter a valid price.');
        }
    }else{
        alert("enter valid category of expense...")
    }
}


  function increaseCount(index) {
    expenses[index].count++;
    saveExpenses();
    renderExpenses();
  }

  function decreaseCount(index) {
    if (expenses[index].count > 1) {
      expenses[index].count--;
    } else {
      deleteCategory(index);
    }
    saveExpenses();
    renderExpenses();
  }

  function editExpense(index) {
    const category = prompt('Edit expense category:', expenses[index].category);
    const price = parseFloat(prompt('Edit expense price:', expenses[index].price));
    if (!isNaN(price)) {
      expenses[index].category = category;
      expenses[index].price = price;
      saveExpenses();
      renderExpenses();
    } else {
      alert('Please enter a valid price.');
    }
  }

  function deleteCategory(index) {
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
  }

  loadExpenses();
  renderExpenses();

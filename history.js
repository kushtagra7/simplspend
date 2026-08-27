let expenses = [];

const historyList = document.getElementById("history-list");
//gets the expense from the browsers local storage(stored as string)
const savedExpenses = localStorage.getItem("expenses");
//converts the expenses back to an array
if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
}

function displayHistory() {
    historyList.innerHTML = "";
    //to check if there is no current expense
    if (expenses.length === 0) {
        historyList.innerHTML = //displays this if there is no expense
        `
            <p class="empty-history">No expenses yet.</p>
        `;
        return;
    }

    expenses.forEach(function(expense) {
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("history-item");
        expenseItem.innerHTML = 
        //adding all the details to the expense item
        `
            <div class="history-info">
                <p class="history-description">
                    ${expense.description}
                </p>

                <p class="history-meta">
                    ${expense.category} · ${expense.date}
                </p>
            </div>

            <p class="history-amount">
                ₹${expense.amount}
            </p>
        `;
        //makes it visible on the main page
        historyList.appendChild(expenseItem);
    });
}
displayHistory();
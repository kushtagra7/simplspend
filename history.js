let expenses = [];
const cycleSelect=document.getElementById("cycle-select");
const cycleTotal=document.getElementById("cycle-total");
const historyList = document.getElementById("history-list");
const savedPaymentDate=localStorage.getItem("nextPaymentDate");
let nextPaymentDate;
//converts string format date into js object
if (savedPaymentDate) {
    nextPaymentDate = new Date(savedPaymentDate);
}
//gets the expense from the browsers local storage(stored as string)
const savedExpenses = localStorage.getItem("expenses");
//converts the expenses back to an array
if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
}
//this function looks at the user's next payment date and oldest expense, then generate every payment cycle needed for the History dropdown.
function generateCycles() {
    if (!nextPaymentDate) {
        return;
    }
    cycleSelect.innerHTML = "";
    let oldestExpenseDate;
    if (expenses.length > 0) {
        //this stores the oldest expense of the user in the variable in date format in js
        oldestExpenseDate = new Date(expenses[0].date);
        expenses.forEach(function(expense) {
            //this changes each expense from string into a js date object
            const expenseDate = new Date(expense.date);
            //if this expense is oldest than what is at 0, we replace it
            if (expenseDate < oldestExpenseDate) {
                oldestExpenseDate = expenseDate;
            }
        });
    } else {
        oldestExpenseDate = new Date(nextPaymentDate);
        oldestExpenseDate.setMonth(oldestExpenseDate.getMonth() - 1);
    }
    let cycleEnd = new Date(nextPaymentDate);
    //Keep generating previous cycles as long as we haven't gone past the oldest expense.
    while (cycleEnd > oldestExpenseDate) {
        const cycleStart = new Date(cycleEnd);
        cycleStart.setMonth(cycleStart.getMonth() - 1);
        const option = document.createElement("option");
        option.value =
            `${cycleStart.toISOString()}|${cycleEnd.toISOString()}`;
        option.textContent =
            `${cycleStart.toLocaleDateString()} - ${cycleEnd.toLocaleDateString()}`;
        cycleSelect.appendChild(option);

        cycleEnd = cycleStart;
    }
}
//So getSelectedCycle() gives us an object like:
//{
//    start: 28 Aug,
//    end: 28 Sep
//}
function getSelectedCycle() {
    const selectedValue = cycleSelect.value;

    if (!selectedValue) {
        return null;
    }

    const dates = selectedValue.split("|");

    return {
        start: new Date(dates[0]),
        end: new Date(dates[1])
    };
}

function displayHistory() {
    historyList.innerHTML = "";
    const selectedCycle = getSelectedCycle();
    if (!selectedCycle) {
        return;
    }
    //filtering to get expenses within the start and end date
    const filteredExpenses = expenses.filter(function(expense) {
        const expenseDate = new Date(expense.date);
        return (
            expenseDate >= selectedCycle.start &&
            expenseDate < selectedCycle.end
        );
    });
    let total = 0;
    filteredExpenses.forEach(function(expense) {
       total += Number(expense.amount);
    });
    cycleTotal.textContent = `Total spent: ₹${total}`;
    //to check if there is no current expense
    if (filteredExpenses.length === 0) {
        historyList.innerHTML = //displays this if there is no expense
        `
            <p class="empty-history">No expenses yet.</p>
        `;
        return;
    }

    filteredExpenses.forEach(function(expense) {
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("history-item");
        //adding details to the expenses
        expenseItem.innerHTML = `
            <div class="history-info">
                <p class="history-description">
                    ${expense.description}
                </p>

                <p class="history-meta">
                    ${expense.category} · ${expense.date}
                </p>
            </div>

            <div class="history-actions">
                <p class="history-amount">
                    ₹${expense.amount}
                </p>

                <button class="delete-expense-btn">
                    Delete
                </button>
            </div>
        `;
        //we use expenseItem.query instead of document because we just want to check the expense items and not the whole document
        const deleteButton =expenseItem.querySelector(".delete-expense-btn");

        deleteButton.addEventListener("click", function() {
            //find the index of the expense wanted to be deleted
            const expenseIndex = expenses.indexOf(expense);
            //splice removes the element
            //it takes (index, number of items to be removed)
            expenses.splice(expenseIndex, 1);
            //then we re-save in local storage
            localStorage.setItem(
                "expenses",
                JSON.stringify(expenses)
            );
            //then we re-call everything
            generateCycles();
            displayHistory();
        });
        historyList.appendChild(expenseItem);
    });
}

cycleSelect.addEventListener("change", function() {
    displayHistory();
});

generateCycles();
displayHistory();
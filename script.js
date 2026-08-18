//expenses array stores all the expenses
let expenses=[];
const expenseList=document.getElementById("expense-list");
const expenseForm=document.getElementById("expense-form");

function displayExpenses(){
    //clears what was previously on display and then shows the current state of the list
    expenseList.innerHTML="";

    expenses.forEach(function(expense){
        const expenseItem=document.createElement("div");
        expenseItem.textContent = `${expense.description} - ₹${expense.amount}`;
        expenseList.appendChild(expenseItem);
    });
}

expenseForm.addEventListener("submit",function(event){
    //"event" has the information that is submitted in the form 
    //function → create a function
    //event → parameter containing information about the event that triggered the function
    //default action after form submission is page reload for html but preventDefault makes sure that the pages doesnt reload after submit
    event.preventDefault();
    //getting the data from the form filled by the user
    const description=document.getElementById("description").value;
    const amount=document.getElementById("amount").value;
    const category=document.getElementById("category").value;
    const date=document.getElementById("date").value;
    // console.log(description);
    // console.log(amount);
    // console.log(category);
    // console.log(date);
    const expense={
        description: description,
        amount: amount,
        category: category,
        date: date
    };
    //add the expense to the array of expenses
    expenses.push(expense);
    displayExpenses();
    

});

//expenses array stores all the expenses
let expenses=[];

const expenseList=document.getElementById("expense-list");
const expenseForm=document.getElementById("expense-form");
const totalSpent=document.getElementById("total-spent");

function displayExpenses(){
    //clears what was previously on display and then shows the current state of the list
    expenseList.innerHTML="";
    let total=0;
    expenses.forEach(function(expense){
        //Number() converts the amount from string to number as .value gives a string regardless of the input
        total+=Number(expense.amount);
        //for every element there is a new div created and we show the text content in each div
        const expenseItem=document.createElement("div");
        expenseItem.textContent = `${expense.description} - ₹${expense.amount}`;
        //append child adds the expense item to the expense list and then we can show the expense 
        expenseList.appendChild(expenseItem);
        totalSpent.textContent=`₹${total}`;//template literal string
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

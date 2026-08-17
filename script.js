//expenses array stores all the expenses
let expenses=[];

const expenseForm=document.getElementById("expense-form");
expenseForm.addEventListener("submit",function(event){
    //"event" has the information that is submitted in the form 
    //function → create a function
    //event → parameter containing information about the event that triggered the function
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
    

});

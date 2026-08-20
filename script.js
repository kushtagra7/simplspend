//expenses array stores all the expenses
let expenses=[];
let startingMoney;
let nextPaymentDate;

const expenseList=document.getElementById("expense-list");
const expenseForm=document.getElementById("expense-form");
const totalSpent=document.getElementById("total-spent");
const moneyLeft=document.getElementById("money-left");
const daysLeft=document.getElementById("days-left");

const setupSection=document.getElementById("setup");
const setupButton = document.getElementById("setup-btn");
const startingMoneyInput = document.getElementById("starting-money");
const nextPaymentInput = document.getElementById("next-payment");
//setting up the continue button so that it saves the input giver by the user
setupButton.addEventListener("click",function(){
    const money= startingMoneyInput.value;
    const paymentDate=nextPaymentInput.value;
    
    //basic validation step that checks if the user has clicked continue without entering any data
    if (money === "" || paymentDate === "" || Number(money) <= 0) {
        alert("Please enter valid starting money and a payment date.");
        return;
    }

    const selectedDate = new Date(paymentDate);
    const today = new Date(); 
    //new Date() contains the current time, not just today's date.
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        alert("Next payment date cannot be in the past.");
        return;
    }

    startingMoney=Number(money);
    nextPaymentDate=new Date(paymentDate);
    displayExpenses();
    setupSection.style.display="none";
    //set this element's CSS display property to none.
});

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
    });
    totalSpent.textContent=`₹${total}`;//template literal string
    const remaining=startingMoney-total;
    moneyLeft.textContent=`₹${remaining}`;
    const today=new Date();
    const difference=nextPaymentDate - today;
    const days=Math.ceil(difference/(1000*60*60*24));
    //difference gives in milliseconds so 1000 for sec 60 for mins and hour and 24 for day
    daysLeft.textContent=days;

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
displayExpenses();
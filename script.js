//expenses array stores all the expenses
let expenses=[];
let startingMoney;
let nextPaymentDate;
let displayedTotal=0;

const expenseList=document.getElementById("expense-list");
const expenseForm=document.getElementById("expense-form");
const totalSpent=document.getElementById("total-spent");
const moneyLeft=document.getElementById("money-left");
const daysLeft=document.getElementById("days-left");
//const totalExpenses=document.getElementById("total-expenses");

const setupSection=document.getElementById("setup");
const setupButton = document.getElementById("setup-btn");
const startingMoneyInput = document.getElementById("starting-money");
const nextPaymentInput = document.getElementById("next-payment");

const openExpenseButton=document.getElementById("open-expense-btn");
const addExpenseSection=document.querySelector(".add-expense");
const closeExpenseButton=document.getElementById("close-expense-btn");

const toast = document.getElementById("toast");

openExpenseButton.addEventListener("click",function(){
    addExpenseSection.style.display="flex";
});

closeExpenseButton.addEventListener("click", function(){
    addExpenseSection.style.display="none";
});

//when the page reloads we need to get the item that was saved in local storage so we use getItem()
const savedExpenses=localStorage.getItem("expenses");//get the item that has the key expenses
if(savedExpenses){
    // parse() parses the string back into object
    expenses=JSON.parse(savedExpenses);
}
const savedStartingMoney=localStorage.getItem("startingMoney");
const savedPaymentDate=localStorage.getItem("nextPaymentDate");
if (savedStartingMoney && savedPaymentDate){
    startingMoney=Number(savedStartingMoney);
    nextPaymentDate=new Date(savedPaymentDate);
    //this one happens when we reload the page so we initally check if there is saved memory and if saved memory exists then the setup is not displayed.
    setupSection.style.display="none";
}

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
    //in nextPaymentdate set item paymentDate which means set second one in what comes first while using set item
    localStorage.setItem("startingMoney", startingMoney);
    localStorage.setItem("nextPaymentDate",paymentDate)

    displayExpenses();
    //this display none happens when the user successfully completes the setup.
    setupSection.style.display="none";
    //set this element's CSS display property to none.
});

function animateTotal(target){
    const start=displayedTotal;
    const duration=250;
    const startTime=performance.now();

    function update(currentTime){
        const elapsed=currentTime-startTime;
        const progress=Math.min(elapsed/duration,1);

        const currentValue=Math.floor(
            start+(target-start)*progress
        );

        totalSpent.textContent=`₹${currentValue}`; //template literal string

        if(progress<1){
            requestAnimationFrame(update);
        }else{
            displayedTotal=target;
        }
    }

    requestAnimationFrame(update);
}

function displayExpenses(){
    //clears what was previously on display and then shows the current state of the list
    expenseList.innerHTML="";
    let total=0;
    expenses.forEach(function(expense){
        //Number() converts the amount from string to number as .value gives a string regardless of the input
        total+=Number(expense.amount);
        //for every element there is a new div created and we show the text content in each div
        const expenseItem=document.createElement("div");
        expenseItem.classList.add("expense-item");
        //this is for just diplaying the price and category expenseItem.textContent = `${expense.description} - ₹${expense.amount}`;
        //the below code is to show all the description of the expense
        expenseItem.innerHTML=`
            <div class="expense-info">
                <div class="expense-name">${expense.description}</div>
                <div class="expense-meta">
                    ${expense.category} · ${expense.date}
                </div>
            </div>

            <div class="expense-amount">
                ₹${expense.amount}
            </div>
        `;
        //append child adds the expense item to the expense list and then we can show the expense 
        expenseList.appendChild(expenseItem);
    });
    animateTotal(total);
    //totalExpenses.textContent=expenses.length;

    //this is done so that the page doesnt show NaN when there is nothing set up already
    if (startingMoney === undefined) {
        moneyLeft.textContent = "₹0";
    } else {
        const remaining = startingMoney - total;
        moneyLeft.textContent = `₹${remaining}`;
    }

    if (nextPaymentDate === undefined) {
        daysLeft.textContent = "0";
    } else {
        const today = new Date();
        const difference = nextPaymentDate - today;
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        daysLeft.textContent = days;
    }
    //difference gives in milliseconds so 1000 for sec 60 for mins and hour and 24 for day

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
    //json can only accept strings thus we use stringify as we can't directly put that object/array into LocalStorage.
    localStorage.setItem("expenses",JSON.stringify(expenses));//setItem stores the things
    //setitem takes 2 things key and values which means expenses is key and stringify expenses is value
    displayExpenses();
    //this makes the "expense added" show on the page for some time and then remove it 
    toast.classList.add("show"); 
    setTimeout(function() {
        toast.classList.remove("show");
    }, 1800);
    
});
displayExpenses();
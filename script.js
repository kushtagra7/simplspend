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
    updatePaymentCycle();
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

    updatePaymentCycle();
    displayExpenses();
    //this display none happens when the user successfully completes the setup.
    setupSection.style.display="none";
    //set this element's CSS display property to none.
});
/*
    Animated Total Counter:

    This function smoothly animates the Total Spent value from the previously
    displayed amount to the new target amount.

    1. displayedTotal stores the last amount shown on screen.
    2. start is the value the animation begins from.
    3. duration defines how long the animation lasts in milliseconds.
    4. performance.now() records the exact time the animation starts.
    5. update() runs repeatedly on each browser animation frame.
    6. elapsed calculates how much time has passed since the animation started.
    7. progress converts that elapsed time into a value between 0 and 1:
       0 = animation just started, 1 = animation complete.
    8. currentValue calculates the number that should be displayed at that
       moment using:
       start + (target - start) * progress
    9. Math.floor() keeps the displayed value as a whole number.
   10. requestAnimationFrame(update) keeps calling update() until progress
       reaches 1.
   11. When the animation finishes, displayedTotal is updated to the target
       so the next animation starts from the current displayed amount.
*/

function animateTotal(target){
    const start=displayedTotal;
    const duration=400;
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
//this function checks whether the saved payment date has already passed. If it has, it keeps moving that date forward month by month until it reaches the next upcoming payment date, then saves that new date back to localStorage.
function updatePaymentCycle(){
    if(!nextPaymentDate){
        return;
    }
    const today=new Date();
    while(nextPaymentDate<today){
        //this gets the numerical value of the day
        const currentDay=nextPaymentDate.getDate();
        //getMonth() gives the month number but it gives indexes which means it starts from 0 so we increase the count by one for the next payment date
        nextPaymentDate.setMonth(nextPaymentDate.getMonth()+1);

        //lets say the payment date is 31 jan next date by calc would e=be 31st feb but that doesnt exist so js shifts to 3rd march but that would disrupt the payment
        //hence the setDate(0) means that it will set the payment to the last date.
        if(nextPaymentDate.getDate()!==currentDay){
            nextPaymentDate.setDate(0);
        }
    }
    //this is done for formatting stuff
    localStorage.setItem(
        "nextPaymentDate",
        nextPaymentDate.toISOString().split("T")[0]
    );
}

//this function gets the cycle start and end then return the expenses of that cyle
function getCurrentCycleExpenses(){
    if(!nextPaymentDate){
        return [];
    }
    const cycleEnd=new Date(nextPaymentDate);//current cycle ends here
    const cycleStart=new Date(nextPaymentDate);//new creates a new copy 
    cycleStart.setMonth(cycleStart.getMonth()-1);//current cycle starts here

    //filter() checks every item in an array and keeps only the ones where the callback returns true.
    return expenses.filter(function(expense){
        //this converts the date in string into a js object and then it can be used to check whether it lies in this cycle or the next one
        const expenseDate=new Date(expense.date);
        //return if this is true
        return expenseDate>=cycleStart && expenseDate<cycleEnd;
    });
}

function displayExpenses(){
    //clears what was previously on display and then shows the current state of the list
    expenseList.innerHTML="";
    const currentCycleExpenses=getCurrentCycleExpenses();
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
    if (
    description === "" ||
    amount === "" ||
    category === "" ||
    date === "" ||
    Number(amount) <= 0
) {
    alert("Please fill in all expense details.");
    return;
}
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
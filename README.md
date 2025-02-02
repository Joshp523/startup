# startup

#Budget Tracker
###Startup for CS 260 winter 2025

##Elevator Pitch
my app will be tailored to young families like my own who need to save money and keep track of epenses. The users will be able to log in as a member of a family and view and edit goals and expenditures. This will allow both spouses to be equal partners in managing money, as well as viewing progress toward joint goals. The main attraction of this app will be the graphical representations of spending habits to incentivize frugality (as James clear describes in _Atomic Habits_, it's important to make _not_ spending as rewarding as spending.)

##Key Features
*secure login 
*persistent transaction data
*a pie chart of expenditures based on category updated in real time
*ability to select either 'income' or 'expense'
*ability to input income/expense 'amount' and 'category'
*visible transaction history that displays 'name', 'date', 'amount', 'category' 

_--depending on dificlty, these features could be added:
*A progress bar toward goals eg: 'your restaurant date fund is half full. Keep it up!', 
*Encouraging updates eg: 'your spending on car parts is down 20 percent from last month. Way to go!'
*access to bank account for automatic updates_

##Technologies
1. HTML - Uses correct HTML structure for application. Three HTML pages: 
*login
*home screen with the pie chart and options for entering a transaction
*transaction history
2. CSS - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
3. React - routing and the following graphical components:
*pie chart/progress bar
*buttons for transaction input
*transaction list
*income/expenses color coded
4. Service - Backend service with endpoints for:
*login/out
*retrieving from the database to update the dashboard
*entering a new transaction
*user/family data
*categories (custom and stock)
DB-  Store family member authentication information, family members, transactions, categories, and goals in database.
WebSocket - As each family member records a transaction, their transaction appears in the list and pie chart visible to all others _in that family_.









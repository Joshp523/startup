# Budget Tracker
### Startup for CS 260 Winter 2025

## Elevator Pitch
My app will be tailored to young families like my own who need to save money and keep track of expenses. The users will be able to log in as a member of a family and view and edit goals and expenditures. This will allow both spouses to be equal partners in managing money, as well as viewing progress toward joint goals. The main attraction of this app will be the graphical representations of spending habits to incentivize frugality (as James Clear describes in _Atomic Habits_, it's important to make _not_ spending as rewarding as spending.)

## Key Features
* Secure login 
* Persistent transaction data
* A pie chart of expenditures based on category updated in real time
* Ability to select either 'income' or 'expense'
* Ability to input income/expense 'amount' and 'category'
* Visible transaction history that displays 'name', 'date', 'amount', 'category' 

_Depending on difficulty, these features could be added:_
  * A progress bar toward goals e.g., 'Your restaurant date fund is half full. Keep it up!'
  * Encouraging updates e.g., 'Your spending on car parts is down 20 percent from last month. Way to go!'
  * Access to bank account for automatic updates

## Technologies
1. **HTML** - Uses correct HTML structure for application. Three HTML pages:
   * Login
   * Home screen with the pie chart and options for entering a transaction
   * Transaction history
2. **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice, and contrast.
3. **React** - Routing and the following graphical components:
   * Pie chart/progress bar
   * Buttons for transaction input
   * Transaction list
   * Income/expenses color-coded
4. **Service** - Backend service with endpoints for:
   * Login/out
   * Retrieving from the database to update the dashboard
   * Entering a new transaction
   * User/family data
   * Categories (custom and stock)
   
**DB** - Store family member authentication information, family members, transactions, categories, and goals in the database.

**WebSocket** - As each family member records a transaction, their transaction appears in the list and pie chart visible to all others _in that family_.





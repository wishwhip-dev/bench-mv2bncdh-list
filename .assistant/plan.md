# Plan

Goal: A reading list for books I want to read: title, author, a note on why, and a done checkbox. Add, edit, mark done, and see done ones at the bottom. I use it on my phone and on my laptop, so I need a way to carry my list from one to the other.

1. The home page shows the reading list as a list of book cards, each with its title, author and the 'why' note; books not yet read are listed first (newest at the top) and done books appear in a separate 'Done' section at the bottom, with a count of how many books are waiting and how many are done
2. A visible 'Add book' button on the home page opens a form with labelled inputs for title (required), author and a note on why I want to read it, and a submit button labelled 'Add'; submitting it closes the form and the new book appears at the top of the unread list
3. Submitting the add or edit form with an empty title shows an inline error and adds or changes nothing; a book saved with no author or note shows a card with just the title, and very long titles and notes wrap onto extra lines without breaking the layout
4. Clicking Edit on a book opens the same form pre-filled with that book's title, author and note, and saving shows the updated details on the card immediately
5. Clicking a book's checkbox marks it done, the card moves to the Done section at the bottom with a visually distinct done style, and unchecking it moves it back to the unread section
6. A 'Delete' button on each book removes it after a confirmation step, and the list updates immediately
7. Adding or editing a book saves it to the browser database: reloading the page still shows every book with its title, author, note and done state unchanged, including books marked done and books deleted before the reload
8. With no books yet, the page shows an empty state inviting me to add my first book, and the Add button still works from there; with tens of books added the whole list still renders with correct counts in both sections
9. A settings section reachable from the home page contains the 'Move to another device' panel with its own wording: pressing it shows a transfer code, and entering a wrong code shows a message saying so
10. The whole list works on a phone-sized screen: cards and form fields stack in one column, every button and checkbox is at least 32px, and tapping a checkbox, Edit or Delete works with a finger
11. The list can be operated from the keyboard alone: Tab reaches the Add button, every form field, every checkbox, and every Edit and Delete control in order, and Enter submits the add and edit forms
12. The app's name and description in app/identity.ts are rewritten to describe the reading list, and the browser tab title shows that name

These are the outcomes this task is judged against.
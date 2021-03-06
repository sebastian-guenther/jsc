# Coline - JavaScript Command Line Interface

Slim and reusable framework to define command line applications with a top-level interface and several question-answer dialogs.

# Setup

* Clone this repository
* Invoke `npm install`
* Start the demo application with `npm demo`
* Execute tests with `npm test`

# Framework

The framework is extensively [documented](./DOCUMENTATION.md), here is the nutshell:

1. You create a `InterfaceObject` that represent the top-level commands that users invoke. 
1. These commands can be simple one-of functions,  or complex dialogs called `ContextObject`
1. `ContextObject` are dialogs with multiple questions, pattern-matching rules for answers, and additional validation rules. You can return to previous questions, or stop the dialog all together
1. Questions and answers are collected in a `Map`, once complete you invoke `persist` in the `ContextObject` and define how the `InterfaceObject` handles the newly created object.

The backend class `CommandLineInterpreter` start the application, reading from the defined `inputStream` and writing to the configured `outputStream` as well as the `logStream` (defaults to `stdin`, `stdout` and a JSON file). Input is processed by the class `CommandHandler`, an `EventEmitter` that automatically provides event bindings for all commands of the `InterfaceObject`. 

# Demo

A dialog to ask the user about creating a lunch event.

```javascript
[
    {
      key: 'title',
      question: () => { return 'What is the name of the event? (Any signs)' },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'date',
      question: () => { return "When is the event going to happen? (YYYY-MM-DD / 'Back')" },
      accept: /\d{4}-\d{2}-\d{2}/,
      return: /Back/,
      validation: () => {  }
    },
    {
      key: 'participants',
      question: () => { return "Who is participating? (Any signs, separated by comma / 'Back')" },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'confirmCreation',
      question: () => {
        return `Do you want to create this event? ('Yes' / 'Back')\r\n` +
        `-- TITLE  : ${self.answers.get('title')}\r\n` +
        `-- DATE   : ${self.answers.get('date')}\r\n` +
        `-- PEOPLE : ${self.answers.get('participants')}\r\n`
      },
      accept: /Yes/,
      return: /Back/
    }
  ]
```

The interface object from which lunch events are created, modified and scheduled. 

```javascript
[
    {
        key: 'C',
        message: '(C) Create new event',
        contextObject: LunchEventCreation
    },
    {
        key: 'S',
        message: "(S) Schedule an event",
        contextObject: LunchEventScheduling,
        contextArgs: [lunchEvents],
        verify: () => lunchEvents.length != 0,
        verifyFailureMessage: "No LunchEvents are registered, please create events first!"
    },
    {
        key: 'R',
        message: '(R) Show all events',
        command: () => {
            let i = 1
            for (let event of lunchEvents) {
             self.writeCallback('result', 'Event #' + i++ + '\r\n' + event.print())
            }
        }
    },
    ...
]
```


# Mystery Lunch

What is this about? In a mystery lunch, people are randomly assigned to groups, they go out and eat together.

When starting the application, invoke `Load` to load test data. Then:

* (C ) Create new event
* (S ) Schedule an event
* (R ) Show all events
* (U ) Update an event
* (D ) Delete an Event
* (I ) Show this interface
* (Save ) Save all events to a file
* (Load ) Load events from a file

Each command starts a dialog that will ask you a set of question. The questions telly you what to do and explains the expected answer format. Inside a dialog, you can always invoke `Stop` to exit back to the main menu. If you invoke `Exit` in the interface, the application closes.

Here is an example session:

```
2018-11-27T11:25:54.905Z Mystery Lunch Planner
$> Welcome to managing lunch events. What do you want to do?
(C) Create new event
(S) Schedule an event
(R) Show all events
(U) Update an event
(D) Delete an event
(I) Show Interface
(Save) Save all events to a file
(Load) Load events from the default file

$: Load
$> Load all lunch events from './mystl.json'
$: R
$> Event #1
-- TITLE  : Test Lunch 1
-- DATE   : 2018-11-03
-- PEOPLE : Sebastian, Caro, Max, Lea
-- GROUPS :
---  1. Caro,Max
---  2. Sebastian,Lea

$> Event #2
-- TITLE  : Test Lunch 2
-- DATE   : 2018-11-07
-- PEOPLE : Caro, Julia, Lea, Thomas
$: C
$> What is the name of the event? (Any signs)
$: Test Lunch
$> When is the event going to happen? (Any signs / 'Back')
$: 2018-11-27
$> Who is participating? (Any signs, separated by comma / 'Back')
$: Sebastian, Karl, Lea, Caro, Hans, Roger
$> Do you want to create this event? ('Yes' / 'Back')
-- TITLE  : Test Lunch
-- DATE   : 2018-11-27
-- PEOPLE : Sebastian, Karl, Lea, Caro, Hans, Roger
$: Yes
$> Thank you, the event has been added
```

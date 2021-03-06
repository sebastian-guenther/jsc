<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [CommandHandler][1]
    -   [Constructor][2]
    -   [process][3]
        -   [Parameters][4]
    -   [registerInterfaceObject][5]
        -   [Parameters][6]
    -   [setContextObject][7]
        -   [Parameters][8]
    -   [resetContextObject][9]
-   [CommandLineInterpreter][10]
    -   [Constructor][11]
    -   [writeCallback][12]
        -   [Parameters][13]
    -   [setup][14]
    -   [start][15]
    -   [process][16]
        -   [Parameters][17]
    -   [stop][18]
    -   [registerInterfaceObject][19]
        -   [Parameters][20]
-   [ContextObject][21]
    -   [Constructor][22]
    -   [Parameters][23]
    -   [next][24]
    -   [answer][25]
        -   [Parameters][26]
    -   [isComplete][27]
    -   [finalize][28]
    -   [isCanceled][29]
    -   [stop][30]
    -   [persist][31]
-   [InterfaceObject][32]
    -   [Constructor][33]
    -   [Parameters][34]
    -   [registerCommands][35]
    -   [removeCommands][36]
    -   [getInterface][37]

## CommandHandler

**Extends EventEmitter**

CommandHandler is an EventEmitter. It receives commands, emits them to the registered `InterfaceObjects` and `ContextObjects`.

During application startup, it dependency injects a `writeCallback` and itself to `InterfaceObjects` so that they register their commands with the `CommandHandler`.

### Constructor

Creates an instance with the following variables:

-   `contextObject` **Object** - An object representing the current dialog
-   `interfaceObjects` **Object** - The list of all objects that represent key => commands bindings

### process

Processes all commands.

-   If a context object is set, emit `context` and the cmd message
-   Else emit the cmd
-   Else invoke `echo` with the cmd

#### Parameters

-   `cmd` **[String][38]** The command to be executed

### registerInterfaceObject

Adds new interface objects and registers their commands with this CommandHandler.

#### Parameters

-   `interfaceObject`  
-   `writeCallback` **[Object][39]** Dependency Inject the write callback to the
-   `InterfaceObject` **[Object][39]** The object that is added

### setContextObject

Set a new context object.

#### Parameters

-   `object` **[Object][39]** The new context object.

### resetContextObject

Removes the current context object

## CommandLineInterpreter

Central object that provides input and output streams.

### Constructor

Creates an instance with the following variables:

-   `inputStream` **Object**  - The stream that provides input data
-   `outputStream` **Object** - The stream that prints out the data
-   `logStream` **Object** - The stream to which log information is provided
-   `commandHandler` **Object** - The command handler that listens to, and emits, events

### writeCallback

Writes input to the `outputStream` and `logStream`.

#### Parameters

-   `type` **[String][38]** Defines how the input is written, options are 'test', 'log-\_only', 'question' or 'result'
-   `cmd` **[String][38]** The command that is written (optional, default `''`)

### setup

Registers basic commands, like 'echo' and 'exit'.

### start

Starts the command line interface.

-   Writes the `config.welcomeLine`
-   Writes the interface definition
-   Creates a listener to the `inputStream`, that pauses the stream, calls `process`, and resumes the stream

### process

Processes input from `inputStream` by logging the message and passing it to the command handler.

#### Parameters

-   `rawData` **[String][38]** The raw data entered by the user

### stop

Stops the command line processor.

### registerInterfaceObject

Registers a new `interfaceObject`.

#### Parameters

-   `interfaceObject` **[Object][39]** The interfaceObject that is registered

## ContextObject

An Object that represents a dialog consisting of questions. Questions are defined with these values:

-   `key` **String** - Represents The 'key 'in the key-value map that records the answer
-   `questions` **Function** - Returns the message that is shown to the user. Contains code that is executed before the question is shown, for example to select the appropriate part of the objects.
-   `accept` **RegRxp** - A pattern to which the given answer must match
-   `return` **String** - A command that returns the dialog to the previous question. If its the first question, stop the dialog.
-   `validate` **function** - When given, further validates the answer of the user, for example when choosing an index value from an array

### Constructor

Creates a new instance with the following variables:

-   `questions` **Array** - Represents all questions that are shown to the user.
-   `answers` **Map** - A map of questions => answers
-   `cancel` **Boolean** - Flag to indicate that the context dialog is cancelled.

### Parameters

-   `Array`  

### next

Returns the current question of the dialog

### answer

Processes the user-input.

-   If `stop` then exit the current dialog
-   If a `return` value is defined and the answer matches this value, return to previous question or exit if it is the first question
-   If the answer matches the `accept` value, and the optional `validate` function returns true, accept the answer and store (key => answer) in the answers array
-   

#### Parameters

-   `answer` **[String][38]** The user input

### isComplete

Checks if all answers of the dialog are answered.

### finalize

Is invoked when the dialog is completed to return the a final message to the user.

### isCanceled

Checks if the dialog is cancelled, for example when the `Stop` answer is invoked.

### stop

When the `Stop` answer is given, return a message to the user.

### persist

Executed when the dialog is finished to persist objects that are modified or created with the given answers.

## InterfaceObject

`InterfaceObject` exposes key=>command bindings to the user. Commands are defined with these properties:

-   `key` **String** - The keyboard key that invokes the command
-   `message` **String** - The description shown to the user
-   `command` **Function** - Executed when the command is invoked. Examples include reading and saving data, showing objects, creating context objects for other dialogs etc.
-   `contextObject` **Object** - The context object that is loaded when the key is invoked. When a `contextObject` is present, the `command` is ignored
-   `contextArgs` **Array** - Arguments passed to the command object
-   `verify` => **Function** - Additional condition that needs to be true before the context object is loaded
-   `verifyFailureMessage` **String** - The message shown to the user when the `verify` condition evaluates to false

### Constructor

Creates a new instance that receives dependency injections.

### Parameters

-   `commandHandler` **[Object][39]** The command handler to which the interface object listens
-   `writeCallback` **[Object][39]** The object on which `write` is executed to print answers
-   `commands` **[Array][40]** The commands of this `InterfaceObject`

### registerCommands

For each command, define a listener on the `CommandHandler`.

### removeCommands

Remove all commands from the `CommandHandler`.

### getInterface

Returns a newline-separated string of all commands for which a message is defined.

[1]: #commandhandler

[2]: #constructor

[3]: #process

[4]: #parameters

[5]: #registerinterfaceobject

[6]: #parameters-1

[7]: #setcontextobject

[8]: #parameters-2

[9]: #resetcontextobject

[10]: #commandlineinterpreter

[11]: #constructor-1

[12]: #writecallback

[13]: #parameters-3

[14]: #setup

[15]: #start

[16]: #process-1

[17]: #parameters-4

[18]: #stop

[19]: #registerinterfaceobject-1

[20]: #parameters-5

[21]: #contextobject

[22]: #constructor-2

[23]: #parameters-6

[24]: #next

[25]: #answer

[26]: #parameters-7

[27]: #iscomplete

[28]: #finalize

[29]: #iscanceled

[30]: #stop-1

[31]: #persist

[32]: #interfaceobject

[33]: #constructor-3

[34]: #parameters-8

[35]: #registercommands

[36]: #removecommands

[37]: #getinterface

[38]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[39]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[40]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

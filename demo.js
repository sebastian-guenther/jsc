#!/usr/bin/node
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./demo/mystery_lunch').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()
cli.start()

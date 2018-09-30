#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('./lib/inquirer')
const breakTime = require('./lib/breakTime')

const clearPage = () => {
    clear()
    console.log(
        chalk.yellow(
            figlet.textSync('Coffee Break', { horizontalLayout: 'full' })
        )
    )
}

const run = async () => {
    clearPage()
    const choice = await inquirer.choose()

    let settings
    if (choice) {
        settings = choice
    } else {
        clearPage()
        settings = await inquirer.settings()

        clearPage()
        await inquirer.save(settings)
    }

    await breakTime.start(settings)
}

run()
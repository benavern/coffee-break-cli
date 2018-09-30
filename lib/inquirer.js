const inquirer = require('inquirer')
const { conf } = require('./store')
const chalk = require('chalk')

module.exports = {
    choose: async () => {
        const choices = Object.keys(conf.all)

        const choosePrompt = [
            {
                name: 'existing',
                type: 'confirm',
                message: 'Would you like to use an existing setting ?'
            }
        ]

        const choicePrompt = [
            {
                name: 'choice',
                type: 'list',
                message: 'Which setting would you like to use ?',
                choices: [...choices, '[Neither of them]']
            }
        ]

        let choose = false

        if (choices.length) {
            const { existing } = await inquirer.prompt(choosePrompt)
            choose = existing
        }


        if (choose) {
            const { choice } = await inquirer.prompt(choicePrompt)
            return conf.all[choice] || null
        } else {
            return null
        }
    },

    settings: () => {
        const settingsPrompt = [
            {
                name: 'title',
                type: 'input',
                message: 'Title of the task you should be doing:',
                validate: function (value) {
                    if (value.length) {
                        return true
                    }
                    return 'Please enter a task name.'
                }
            },
            {
                name: 'reason',
                type: 'input',
                message: 'Description of the task you should be doing:',
                validate: function (value) {
                    if (value.length) {
                        return true
                    }
                    return 'Please enter a reason for your lazyness.'
                }
            },
            {
                name: 'duration',
                type: 'input',
                message: 'How much time do you need ? [1 - 60]min',
                default: 5,
                validate: function (value) {
                    const val = parseInt(value, 10)
                    const min = 1
                    const max = 60
                    if (isNaN(val)) {
                        return 'You must enter a number.'
                    } else if (val < min) {
                        return `The value must be greater that ${min}min (or you won't have time to fill your cup of coffee!)`
                    } else if (val > max) {
                        return `The value must be less that ${max}min (Hey, don't you think it's einough just for a coffe ?)`
                    } else {
                        return true
                    }
                },
                filter: function (value) {
                    return parseInt(value, 10)
                }
            }
        ]

        return inquirer.prompt(settingsPrompt)
    },

    save: async settings => {

        const confirmSavePrompt = [
            {
                name: 'save',
                type: 'confirm',
                message: 'Do you want to save these settings ?'
            }
        ]

        const namePrompt = [
            {
                name: 'name',
                type: 'input',
                default: settings.title || '',
                message: 'Name of the setting to save:',
                validate: function (value) {
                    if (Object.keys(conf.all).includes(value)) {
                        return `A setting with the name "${value}" already exists.`
                    } else if (!value.length) {
                        return 'Please enter a name.'
                    } else {
                        return true
                    }
                }
            }
        ]

        const confirm = await inquirer.prompt(confirmSavePrompt)

        if (confirm.save) {
            const { name } = await inquirer.prompt(namePrompt)
            conf.set(name, settings)
        }

        return confirm
    }
}
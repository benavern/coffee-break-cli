var clui = require('clui')
const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')


var Progress = clui.Progress;
var percentageBar = new Progress(60)

function update(settings) {
    return new Promise(resolve => {
        render(settings, resolve)
    })
}

function creditScreen () {
    clear()
    console.log(chalk.yellow(
        figlet.textSync('Coffee Break', { horizontalLayout: 'full' })
    ))
    console.log()
    console.log(chalk.gray.bold('Your coffee break is over.'))
    console.log()
    console.log(chalk.gray('Thank you for using coffee-break by Benjamin Caradeuc.'))
    console.log(chalk.gray('https://benjamin.caradeuc.info'))
}

function updateScreen ({ title, reason, percentage }) {
    clear()
    console.log(chalk.yellow(
        figlet.textSync(title, { horizontalLayout: 'full' })
    ))
    console.log()
    console.log(chalk.gray(reason))
    console.log()
    console.log(percentageBar.update(percentage))
}

function render({ title, reason, duration }, cb, percentage = 0) {
    setTimeout(() => {
        percentage = percentage + 1 / (duration * 60)

        if(percentage > 1) {
            creditScreen()
            cb()
        } else {
            updateScreen({ title, reason, percentage })
            render({ title, reason, duration }, cb, percentage)
        }
    }, 1000)
}

module.exports = {
    start: (settings) => {
        return update(settings)
    }
}

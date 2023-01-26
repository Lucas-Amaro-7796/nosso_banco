import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'



operation()

function operation() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'O que você deseja fazer?',
          choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
          ],
        },
      ])
      .then((answer) => {
        const action = answer['action']
  
        if (action === 'Criar conta') {
          createAccount()
        } else if (action === 'Depositar') {
           deposit()
        } else if (action === 'Consultar Saldo') {
            console.log('Consultar Saldo')
        } else if (action === 'Sacar') {
            console.log('Sacar')
        } else if (action === 'Sair') {
          console.log('Sair')
          process.exit()
        }
      })
  }

  function createAccount(){
      console.log(chalk.bgGreen.black('Parabens por escolher nosso BANCO!'))
      console.log(chalk.green('Defina as opções da sua conta a seguir!'))

      buildAccount()
  }

  function buildAccount() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Digite um nome para a sua conta:',
        },
      ])
      .then((answer) => {
        console.info(answer['accountName'])
  
        const accountName = answer['accountName']
  
        if (!fs.existsSync('accounts')) {
          fs.mkdirSync('accounts')
        }
  
        if (fs.existsSync(`accounts/${accountName}.json`)) {
          console.log(
            chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
          )
          buildAccount(accountName)
        }
  
        fs.writeFileSync(
          `accounts/${accountName}.json`,
          '{"balance":0}',
          function (err) {
            console.log(err)
          },
        )
  
        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()
      })
  }

  function deposit() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome da sua conta?',
        },
      ])
      .then((answer) => {
        const accountName = answer['accountName']
  
        if (!checkAccount(accountName)) {
          return deposit()
        }
  
        inquirer
          .prompt([
            {
              name: 'amount',
              message: 'Quanto você deseja depositar?',
            },
          ])
          .then((answer) => {
            const amount = answer['amount']
  
            addAmount(accountName, amount)
            operation()
          })
      })
  }

  function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
      console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
      return false
    }
    return true
  }

  function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
      encoding: 'utf8',
      flag: 'r',
    })
  
    return JSON.parse(accountJSON)
  }
  
  function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)
  
    if (!amount) {
      console.log(
        chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
      )
      return deposit()
    }
  
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
  
    fs.writeFileSync(
      `accounts/${accountName}.json`,
      JSON.stringify(accountData),
      function (err) {
        console.log(err)
      },
    )
  
    console.log(
      chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`),
    )
  }
# Trippediacity

Travel Agent Management System

*Ticket dealer deal (plane, hotel, train) with profit sharing system to multi investor.*

![preview](https://raw.githubusercontent.com/eksant/trippediacity/master/public/assets/img/preview.png  "Preview")

## How To Usage

```
# Clone the repo
$ git clone git@github.com:eksant/trippediacity.git

# Change directory
$ cd trippediacity

# Install dependencies using yarn
$ yarn install

# Create table (make sure database 'trippediacity' already created)
$ yarn db:migrate

# Import initial data
$ yarn db:seed

# Running app
$ yarn start
```
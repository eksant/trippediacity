function getCategory(category) {
  if (category == 1) {
    return 'Hotel'
  } else if (category == 2) {
    return 'Flight'
  } else if (category == 3) {
    return 'Train'
  }
}

function getStatus(status) {
  if (status == 1) {
    return {
      status  : 'Pending',
      label   : 'default',
    }
  } else if (status == 2) {
    return {
      status  : 'Payment Done',
      label   : 'warning',
    }
  } else if (status == 3) {
    return {
      status  : 'Completed',
      label   : 'success',
    }
  } else if (status == 4) {
    return {
      status  : 'Closing',
      label   : 'primary',
    }
  }
}

function getPaymentMethod(method) {
  if (method == 1) {
    return 'Transfer Debit'
  } else if (method == 2) {
    return 'Credit Card'
  } else if (method == 3) {
    return 'Money Cash'
  }
}

module.exports = {
  getCategory       : getCategory,
  getStatus         : getStatus,
  getPaymentMethod  : getPaymentMethod,
};

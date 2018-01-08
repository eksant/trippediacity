function getDescription(code) {
  if (code == 1) {
    return 'New Investment'
  } else if (code == 2) {
    return 'Purchases'
  } else if (code == 3) {
    return 'Sales Revenue'
  }
}

module.exports = getDescription;

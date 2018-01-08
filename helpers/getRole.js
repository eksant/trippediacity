function getRole(level) {
  if (level == 1) {
    return 'Superadmin'
  } else if (level == 2) {
    return 'Investor'
  } else if (level == 3) {
    return 'Admin'
  } else if (level == 4) {
    return 'Customer'
  }
}

module.exports = getRole;

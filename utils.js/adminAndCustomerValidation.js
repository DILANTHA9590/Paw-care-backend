export function isCustomer(req) {
  if (!req) {
    return false;
  }

  if (req.user.type != "customer") {
    return false;

    console.log(req.user.type);
  } else {
    return true;
  }
}

export function isAdmin(req) {
  if (!req) {
    return false;
  }

  if (req.user.type != "admin") {
    console.log(req.user.type);
    return false;
  } else {
    return true;
  }
}

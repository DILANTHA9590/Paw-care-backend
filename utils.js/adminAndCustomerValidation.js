export function isCustomer(req) {
  if (!req.user) {
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
  if (!req.user) {
    return false;
  }

  if (req.user.type != "admin") {
    return false;
  } else {
    return true;
  }
}

export function isDoctor(req) {
  if (!req.user) {
    return false;
  }

  if (req.user.type != "doctor") {
    console.log(req.user.type);
    return false;
  } else {
    return true;
  }
}

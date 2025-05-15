import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import Pet from "../modules/pet.js";

export async function createPet(req, res) {
  try {
    const petData = req.body;

    if (!isCustomer(req) || isAdmin(req)) {
      return res.status(403).json({
        message: "Please loging first ",
      });
    }

    petData.userId = req.user.email;
    const newpet = new Pet(petData);

    await newpet.save();

    res.status(200).json({
      message: "Pet account created success!",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while saving data",
      error: error.message,
    });
  }
}

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

export async function updatePetdetails(req, res) {
  try {
    const { petId } = req.params;
    const updateData = req.body;

    const updatedUser = await Doctor.findOneAndUpdate(
      { petId: petId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({
        message: "Pet id not found",
      });
    }

    res.status(200).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again later",
    });
  }
}

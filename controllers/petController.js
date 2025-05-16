import { isAdmin, isCustomer } from "../utils.js/adminAndCustomerValidation.js";
import Pet from "../modules/pet.js";

//  Create a new pet account-------------------------------------------------->
export async function createPet(req, res) {
  try {
    const petData = req.body;

    if (!isCustomer(req) && !isAdmin(req)) {
      return res.status(403).json({
        message: "Please loging first ",
      });
    }

    // Generate pet ID using pet count

    const count = await Pet.countDocuments();
    const petId = "PID00" + count;

    petData.petId = petId;
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

// Update  pet details. ---------------------------------------------->

export async function updatePetdetails(req, res) {
  try {
    const { petId } = req.params;
    const updateData = req.body;

    const updatedUser = await Pet.findOneAndUpdate(
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
      error: error.message,
    });
  }
}

//  Delete a pet profile by petId.------------------------------------------->
export async function DeletePetdetails(req, res) {
  try {
    const { petId } = req.params;

    const isHave = await Pet.findOneAndDelete({ petId });

    if (!isHave) {
      return res.status(200).json({
        message: "Pet id not found",
      });
    }

    res.status(200).json({
      message: "Deleted  Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again later",
      error: error.message,
    });
  }
}

//  Retrieve all pet profiles-------------------------------------------------->

export async function getAllPets(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Unauthorized access, please login with an admin account",
      });
    }

    const petData = await Pet.find();

    if (petData.length == 0) {
      return res.status(200).json({
        message: "No available pet profiles",
      });
    }

    res.status(200).json({
      message: "Pet data retrieved successfully",
      petData,
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again later",
      error: error.message,
    });
  }
}

export async function getMyPets(req, res) {
  try {
    if (!isCustomer(req)) {
      return res.status(403).json({
        message: "Unauthorized access, please login with a customer account",
      });
    }

    // Filter pets by user's email
    const petData = await Pet.find({ userId: req.user.email });

    if (petData.length == 0) {
      return res.status(200).json({
        message: "You have no registered pets",
      });
    }

    res.status(200).json({
      message: "Your pets retrieved successfully",
      petData,
    });
  } catch (error) {
    res.status(500).json({
      message: " Something went a wrong please try again later",
      error: error.message,
    });
  }
}

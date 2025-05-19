import Rewies from "../modules/rewies";

export async function createReview(req, res) {
  try {
    //genarate review id
    const count = await Rewies.countDocuments();

    const reviewId = "RI15" + count;

    const reviewData = req.body;

    // const  { doctorId :  , customerId , reviewId}= reviewData
  } catch (error) {}
}

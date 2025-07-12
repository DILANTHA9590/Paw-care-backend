import Booking from "../modules/booking.js";
import Doctor from "../modules/doctor.js";
import Order from "../modules/order.js";
import Pet from "../modules/pet.js";
import Product from "../modules/product.js";
import User from "../modules/user.js";

export async function getDashboardSummary(req, res) {
  console.log("run this");
  try {
    let startOfDay = new Date(new Date().setHours(0, 0, 0, 0)); // Today at 00:00:00
    let endOfDay = new Date(new Date().setHours(23, 59, 59, 999)); // Today at 23:59:59
    let todayRevenue = 0;

    const usersCount = await User.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    const productsCount = await Product.countDocuments();
    const petsCount = await Pet.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const ordersCount = await Order.countDocuments();

    //order
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    todayOrders.forEach((item) => {
      let price = parseInt(item.totalPrice);

      todayRevenue = todayRevenue + price;
    });

    res.status(200).json({
      todayRevenue,
      usersCount,
      doctorsCount,
      productsCount,
      petsCount,
      bookingsCount,
      ordersCount,
    });

    const todayBookings = await Booking.find({
      createdAt: { $lte: startOfDay, $gte: endOfDay },
    });
  } catch (error) {}
}

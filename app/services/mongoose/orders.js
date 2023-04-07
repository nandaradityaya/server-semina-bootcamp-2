const Orders = require("../../api/v1/orders/model");

const getAllOrders = async (req) => {
  // bikin pagination 10 per page, 1 page. filter by date, req.query.startDate, req.query.endDate
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition = {};

  // klo role bukan owner, maka filter by organizer. jadi nanti data ordernya ga tampil semua
  if (req.user.role !== "owner") {
    condition = { ...condition, "historyEvent.organizer": req.user.organizer }; // spread operator historyEvent by organizer
  }

  // klo startDate dan endDate true, maka filter by date
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); // set jam juga biar gajadi masalah waktu ngefilter order
    condition = {
      ...condition,
      date: {
        $gte: start, // lebih dari
        $lt: end, // kurang dari
      },
    };
  }

  const result = await Orders.find(condition)
    .limit(limit) // limit 10
    .skip(limit * (page - 1)); // skip 10 * (1 - 1) = 0. jadi klo halamannya 1, skipnya 0. klo halamannya 2, skipnya 10. klo halamannya 3, skipnya 20

  const count = await Orders.countDocuments(condition);

  return { data: result, pages: Math.ceil(count / limit), total: count };
};

module.exports = {
  getAllOrders,
};

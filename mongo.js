const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define order schema
const orderSchema = new Schema({
    order_id: { type: Number, required: true },
    branch_id: { type: String, required: true },
    branch_name: { type: String, required: true },
    branch_location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    toppings: { type: [String], required: true },
    is_done: { type: Boolean, required: true },
    handle_time: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);

//generate 10 random orders into the mongoDB
const generate_orders = async () => {
    try {
        const toppings = ["cheese", "pepperoni", "onions", "olives", "mushrooms"];

        // Connect to the database
        const url = "mongodb+srv://username1:username1_pass@pizza-simulator.kpeolsc.mongodb.net/pizza-orders-DB?retryWrites=true&w=majority";
        await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log("Connected to DB :)");

        // Generate and save 10 random orders
        for (let i = 1; i <= 10; i++) {
            const order = {
                order_id: i,
                branch_id: (Math.floor(Math.random() * 3) + 1).toString(),
                branch_name: "Branch " + i,
                branch_location: "location " + i,
                date: "2023-03-13",
                time: "12:00 PM",
                toppings: [toppings[Math.floor(Math.random() * toppings.length)]],
                is_done: false,
                handle_time: 0,
            };

            // Add additional toppings to the order
            const numAdditionalToppings = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numAdditionalToppings; j++) {
                const newTopping = toppings[Math.floor(Math.random() * toppings.length)];
                if (!order.toppings.includes(newTopping)) {
                    order.toppings.push(newTopping);
                }
            }

            await save_order_in_DB(order);
        }

        /*// Print toppings of all orders
        const orders = await get_order_from_DB();
        orders.forEach((order) => {
            console.log(`Order ${order.order_id} toppings: ${order.toppings}`);
        });*/

        // Close the database connection
        await mongoose.connection.close();
        console.log("Disconnected from DB :(");
    } catch (err) {
        console.error(err);
    }
};


// Save an order to the database
const save_order_in_DB = async (order) => {
    try {
        const inp_order = new Order(order);
        const return_order = await inp_order.save();
        console.log("order saved successfully");
        return return_order;
    }
    catch (err) {
        console.error(err);
    }
};

// Get orders from the database
const get_order_from_DB = async (query = {}) => {
    try {
        return await Order.find(query);
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = {save_order_in_DB, get_order_from_DB, generate_orders };
